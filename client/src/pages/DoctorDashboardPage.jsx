import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  Clock, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Bell, 
  Search,
  Plus,
  ChevronRight,
  Stethoscope,
  Activity
} from 'lucide-react';

export default function DoctorDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // overview, appointments, patients, prescriptions
  
  const stats = [
    { label: 'Total Patients', value: '124', icon: <Users size={20} />, color: 'var(--blue)' },
    { label: 'Pending Appointments', value: '8', icon: <Clock size={20} />, color: 'var(--orange)' },
    { label: 'Completed Today', value: '12', icon: <CheckCircle size={20} />, color: 'var(--green)' },
    { label: 'Reports to Review', value: '5', icon: <FileText size={20} />, color: 'var(--purple)' },
  ];

  const appointments = [
    { id: 1, patientName: 'Ramesh Kumar', patientId: 'MDC-P-001', time: '10:30 AM', date: 'Today', type: 'Follow-up', status: 'pending', emoji: '👴' },
    { id: 2, patientName: 'Sita Devi', patientId: 'MDC-P-042', time: '11:15 AM', date: 'Today', type: 'Consultation', status: 'approved', emoji: '👵' },
    { id: 3, patientName: 'Amit Shah', patientId: 'MDC-P-089', time: '12:00 PM', date: 'Today', type: 'Report Review', status: 'pending', emoji: '👨' },
  ];

  const patients = [
    { id: 'MDC-P-001', name: 'Ramesh Kumar', age: 72, lastVisit: '2 days ago', condition: 'Type 2 Diabetes', emoji: '👴' },
    { id: 'MDC-P-042', name: 'Sita Devi', age: 65, lastVisit: '1 week ago', condition: 'Hypertension', emoji: '👵' },
  ];

  return (
    <div className="page-enter" style={{ background: 'var(--bg-app)', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ 
        padding: '24px 20px', 
        background: 'rgba(255, 255, 255, 0.05)', 
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>Dr. Priya Sharma</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>MDC-D-001 · Diabetologist</p>
        </div>
        <div style={{ position: 'relative' }}>
          <button className="btn-icon" style={{ background: 'var(--bg-secondary)' }}>
            <Bell size={20} />
          </button>
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            width: 10, 
            height: 10, 
            background: 'var(--red)', 
            borderRadius: '50%', 
            border: '2px solid var(--bg-app)' 
          }} />
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: 16, 
          marginBottom: 24 
        }}>
          {stats.map((stat, i) => (
            <div key={i} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ 
                width: 36, 
                height: 36, 
                borderRadius: 10, 
                background: `${stat.color}15`, 
                color: stat.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: 24 }}>
          <div className="section-label">Quick Actions</div>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
            <button className="btn btn-primary" style={{ whiteSpace: 'nowrap', gap: 8 }}>
              <Plus size={18} /> New Prescription
            </button>
            <button className="btn btn-ghost" style={{ whiteSpace: 'nowrap', background: 'var(--bg-card)', gap: 8 }}>
              <Activity size={18} /> Review Reports
            </button>
            <button className="btn btn-ghost" style={{ whiteSpace: 'nowrap', background: 'var(--bg-card)', gap: 8 }}>
              <Calendar size={18} /> Schedule
            </button>
          </div>
        </div>

        {/* Appointments Section */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div className="section-label" style={{ marginBottom: 0 }}>Appointment Requests</div>
            <button style={{ background: 'none', border: 'none', color: 'var(--blue)', fontSize: 13, fontWeight: 600 }}>See All</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {appointments.map((appt) => (
              <div key={appt.id} className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                  <div style={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: 12, 
                    background: 'var(--bg-secondary)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: 24
                  }}>
                    {appt.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontWeight: 700 }}>{appt.patientName}</h4>
                      <span style={{ 
                        fontSize: 11, 
                        padding: '2px 8px', 
                        borderRadius: 100, 
                        background: appt.status === 'pending' ? 'var(--orange-dim)' : 'var(--green-dim)',
                        color: appt.status === 'pending' ? 'var(--orange)' : 'var(--green)',
                        fontWeight: 700,
                        textTransform: 'uppercase'
                      }}>
                        {appt.status}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{appt.patientId} · {appt.type}</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <Calendar size={14} /> {appt.date}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <Clock size={14} /> {appt.time}
                  </div>
                </div>

                {appt.status === 'pending' && (
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn btn-primary" style={{ flex: 1, height: 38, fontSize: 13 }}>Approve</button>
                    <button className="btn btn-ghost" style={{ flex: 1, height: 38, fontSize: 13, background: 'var(--bg-secondary)' }}>Reschedule</button>
                  </div>
                )}
                {appt.status === 'approved' && (
                  <button className="btn btn-primary btn-full" style={{ height: 38, fontSize: 13, background: 'var(--teal)' }}>
                    Start Consultation
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* My Patients Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div className="section-label" style={{ marginBottom: 0 }}>Recent Patients</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-icon-sm" style={{ background: 'var(--bg-secondary)' }}><Search size={16} /></button>
              <button style={{ background: 'none', border: 'none', color: 'var(--blue)', fontSize: 13, fontWeight: 600 }}>View All</button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {patients.map((patient) => (
              <div key={patient.id} className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 24 }}>{patient.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{patient.name}</div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{patient.condition} · {patient.age}y</p>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action for Prescription */}
      <button 
        style={{ 
          position: 'fixed', 
          right: 20, 
          bottom: 100, 
          width: 56, 
          height: 56, 
          borderRadius: 28, 
          background: 'var(--blue)', 
          color: 'white', 
          border: 'none', 
          boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 100
        }}
        onClick={() => alert('New Prescription Modal')}
      >
        <Stethoscope size={24} />
      </button>
    </div>
  );
}
