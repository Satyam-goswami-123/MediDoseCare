import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Mic, MicOff, Volume2 } from 'lucide-react';

const INSIGHTS = [
  { icon: '⚠️', title: 'Blood Sugar Trending Up', desc: 'Your fasting glucose rose 8% over 3 days. Consider reducing evening carbs.', color: 'var(--amber)', priority: 'high' },
  { icon: '✅', title: 'BP Within Healthy Range', desc: 'Your blood pressure readings have been stable this week. Great progress!', color: 'var(--green)', priority: 'good' },
  { icon: '💊', title: 'Adherence at 80%', desc: 'You missed 2 Amlodipine doses. Set a louder alarm for 9 AM to stay on track.', color: 'var(--blue)', priority: 'med' },
  { icon: '🚶', title: 'Activity Recommendation', desc: 'A 20-minute morning walk can lower your blood pressure by up to 8 mmHg.', color: 'var(--teal)', priority: 'tip' },
  { icon: '💧', title: 'Hydration Reminder', desc: 'Seniors need 8 glasses of water daily. Staying hydrated helps all your vitals.', color: 'var(--indigo)', priority: 'tip' },
];

export default function AiCoachPage() {
  const navigate = useNavigate();
  const { medicines, healthLogs, user } = useApp();
  const latest = healthLogs[0] || {};
  
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Speech Recognition Setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
  }

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceCommand = (command) => {
    const cmd = command.toLowerCase();
    
    if (cmd.includes('medicine') || cmd.includes('medication')) {
      const upcoming = medicines.filter(m => m.status === 'upcoming');
      if (upcoming.length === 0) {
        speak("You have no more medicines scheduled for today. Great job keeping up!");
      } else {
        const medNames = upcoming.map(m => m.name).join(', ');
        speak(`You have ${upcoming.length} medicines remaining today: ${medNames}. Don't forget to take them on time.`);
      }
    } else if (cmd.includes('hello') || cmd.includes('hi')) {
      speak(`Hello ${user?.name || 'there'}! How can I help you with your health today?`);
    } else if (cmd.includes('blood pressure') || cmd.includes('bp')) {
      speak(`Your latest blood pressure is ${latest.systolic || 128} over ${latest.diastolic || 82}. This is within a healthy range.`);
    } else {
      speak("I heard you, but I'm not sure how to help with that. You can ask me about your medicines or your vitals.");
    }
  };

  const toggleListening = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setVoiceText('Listening...');
      setIsListening(true);
      recognition.start();
    }
  };

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setVoiceText(transcript);
      setIsListening(false);
      handleVoiceCommand(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      setVoiceText('Error hearing you. Try again.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  }, [recognition]);

  return (
    <div className="page-enter">
      <style>{`
        @keyframes voiceActive {
          0% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.05); }
          100% { opacity: 0.1; transform: scale(1); }
        }
        .voice-pulse {
          animation: voiceActive 2s infinite ease-in-out;
        }
      `}</style>
      <div className="page-content">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/home')}>←</button>
          <h2>AI Health Coach</h2>
        </div>
        <div style={{ padding: '8px 20px 20px' }}>
          {/* Hero */}
          <div className="ai-card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 36 }}>🤖</span>
              <div>
                <h3 style={{ color: 'var(--indigo)' }}>Hello, I'm your AI Coach</h3>
                <p style={{ fontSize: 13 }}>Personalized health insights just for you</p>
              </div>
            </div>
            <div style={{ padding: '12px 16px', background: 'rgba(99,102,241,0.1)', borderRadius: 'var(--radius-md)', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Based on your recent vitals and medication history, I've found <strong style={{ color: 'var(--purple-light)' }}>{INSIGHTS.length} insights</strong> to help improve your health this week.
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'Medicines', value: medicines.length, icon: '💊' },
              { label: 'Avg BP', value: `${latest.systolic || 128}/${latest.diastolic || 82}`, icon: '🩸' },
              { label: 'Glucose', value: `${latest.blood_sugar || 118}`, icon: '🩺' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22 }}>{icon}</div>
                <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)', marginTop: 4 }}>{value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Insights */}
          <div className="section-label">AI Insights</div>
          {INSIGHTS.map((ins, i) => (
            <div key={i} className="card" style={{ marginBottom: 12, borderLeft: `3px solid ${ins.color}`, paddingLeft: 14 }}>
              <div className="flex items-center gap-12" style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>{ins.icon}</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>{ins.title}</span>
                <span className="badge" style={{ marginLeft: 'auto', background: `${ins.color}20`, color: ins.color, fontSize: 10 }}>{ins.priority.toUpperCase()}</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.6 }}>{ins.desc}</p>
            </div>
          ))}

          {/* Voice Assistant */}
          <div className="card" style={{ 
            marginTop: 8, 
            textAlign: 'center', 
            borderColor: isListening ? 'var(--blue)' : isSpeaking ? 'var(--purple)' : 'rgba(168,85,247,0.3)', 
            background: isListening ? 'var(--blue-dim)' : isSpeaking ? 'var(--purple-dim)' : 'transparent',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {isListening && <div className="voice-pulse" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'var(--blue)', pointerEvents: 'none' }}></div>}
            
            <div style={{ fontSize: 40, marginBottom: 8, position: 'relative' }}>
              {isListening ? '🎧' : isSpeaking ? '🔊' : '🎙️'}
            </div>
            
            <h4 style={{ color: 'var(--purple-light)' }}>Voice Assistant</h4>
            <p style={{ fontSize: 14, marginTop: 8, minHeight: '1.4em', fontWeight: 500 }}>
              {voiceText || 'Say "Hey MediDose, what medicines do I need today?"'}
            </p>

            <button 
              className={`btn ${isListening ? 'btn-red' : 'btn-primary'}`} 
              style={{ marginTop: 16, width: 200, gap: 10 }}
              onClick={toggleListening}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              {isListening ? 'Stop Listening' : 'Activate Voice'}
            </button>
            
            {isSpeaking && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12, color: 'var(--purple-light)', fontSize: 12 }}>
                <Volume2 size={14} /> AI is speaking...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
