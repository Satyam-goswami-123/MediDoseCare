const PHRASE_TRANSLATIONS = {
  'Settings': 'सेटिंग्स',
  'Notification Special': 'सूचना सेटिंग्स',
  'Notification Settings': 'सूचना सेटिंग्स',
  'Appearance': 'रूप',
  'System': 'सिस्टम',
  'Display Language': 'दिखाने की भाषा',
  'English (US)': 'अंग्रेज़ी',
  'Health Data Sync': 'हेल्थ डेटा सिंक',
  'Daily Health Tips': 'दैनिक स्वास्थ्य सुझाव',
  'Dark Mode': 'डार्क मोड',
  'Vibration feedback': 'वाइब्रेशन फीडबैक',
  'Soft notifications': 'सॉफ्ट सूचनाएं',
  'Reminder sounds': 'रिमाइंडर ध्वनि',
  'Reminder Sound': 'रिमाइंडर ध्वनि',
  'Vibration Pattern': 'वाइब्रेशन पैटर्न',
  'Missed dose alerts': 'मिस्ड डोज़ अलर्ट',
  'Test Current Settings': 'मौजूदा सेटिंग्स जांचें',
  'Test Reminder': 'टेस्ट रिमाइंडर',
  'Home': 'होम',
  'Medicines': 'दवाइयां',
  'Health': 'स्वास्थ्य',
  'Prescriptions': 'प्रिस्क्रिप्शन',
  'Profile': 'प्रोफ़ाइल',
  'Notifications': 'सूचनाएं',
  'Today': 'आज',
  'Login': 'लॉगिन',
  'Logout': 'लॉगआउट',
  'Sign In': 'साइन इन',
  'Sign Up': 'साइन अप',
  'Phone': 'फोन',
  'Password': 'पासवर्ड',
  'Name': 'नाम',
  'Email': 'ईमेल',
  'Save': 'सेव करें',
  'Cancel': 'रद्द करें',
  'Add Medicine': 'दवा जोड़ें',
  'Medicine Name': 'दवा का नाम',
  'Dosage': 'खुराक',
  'Frequency': 'आवृत्ति',
  'Time': 'समय',
  'Morning': 'सुबह',
  'Afternoon': 'दोपहर',
  'Evening': 'शाम',
  'Night': 'रात',
  'SOS': 'एसओएस',
  'Care Network': 'देखभाल नेटवर्क',
  'AI Coach': 'एआई कोच',
  'Achievements': 'उपलब्धियां',
  'No data available': 'कोई डेटा उपलब्ध नहीं है',
  'Mark as Taken': 'लिए गए के रूप में चिह्नित करें',
  'Mark as Missed': 'छूटी हुई के रूप में चिह्नित करें',
  'Medicine Reminder': 'दवा रिमाइंडर',
  'Missed Dose Alert': 'छूटी खुराक अलर्ट',
  'Great Job! 🎉': 'बहुत बढ़िया! 🎉',
  'Proudly keeping you healthy ❤️': 'आपको स्वस्थ रखने के लिए समर्पित ❤️'
};

const WORD_TRANSLATIONS = {
  reminder: 'रिमाइंडर',
  reminders: 'रिमाइंडर्स',
  medicine: 'दवा',
  medicines: 'दवाइयां',
  health: 'स्वास्थ्य',
  settings: 'सेटिंग्स',
  notification: 'सूचना',
  notifications: 'सूचनाएं',
  sound: 'ध्वनि',
  sounds: 'ध्वनियां',
  vibration: 'वाइब्रेशन',
  language: 'भाषा',
  display: 'दिखाने की',
  sync: 'सिंक',
  daily: 'दैनिक',
  tips: 'सुझाव',
  profile: 'प्रोफ़ाइल',
  home: 'होम',
  prescriptions: 'प्रिस्क्रिप्शन',
  dose: 'खुराक',
  missed: 'छूटी',
  alerts: 'अलर्ट',
  alert: 'अलर्ट',
  dark: 'डार्क',
  mode: 'मोड',
  test: 'टेस्ट',
  current: 'मौजूदा',
  healthy: 'स्वस्थ'
};

const nodeOriginalText = new WeakMap();
let observer = null;
let animationFrameId = null;

function translateWordByWord(text) {
  return text.replace(/\b([A-Za-z]+)\b/g, (word) => {
    const translated = WORD_TRANSLATIONS[word.toLowerCase()];
    return translated || word;
  });
}

function translateText(text, language) {
  if (language !== 'hi') {
    return text;
  }

  if (PHRASE_TRANSLATIONS[text]) {
    return PHRASE_TRANSLATIONS[text];
  }

  // Fallback to term-level translation for dynamic strings that are not explicitly mapped.
  return translateWordByWord(text);
}

function translateAttributes(element, language) {
  ['placeholder', 'title', 'aria-label'].forEach((attr) => {
    if (!element.hasAttribute(attr)) return;
    const originalAttr = `data-mdc-original-${attr}`;
    if (!element.hasAttribute(originalAttr)) {
      element.setAttribute(originalAttr, element.getAttribute(attr) || '');
    }
    const originalValue = element.getAttribute(originalAttr) || '';
    element.setAttribute(attr, translateText(originalValue, language));
  });
}

function translateTextNode(textNode, language) {
  if (!textNode?.nodeValue?.trim()) return;
  if (!nodeOriginalText.has(textNode)) {
    nodeOriginalText.set(textNode, textNode.nodeValue);
  }
  const original = nodeOriginalText.get(textNode) || '';
  textNode.nodeValue = translateText(original, language);
}

function translateSubtree(root, language) {
  if (!root) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.parentElement) return NodeFilter.FILTER_REJECT;
      const tag = node.parentElement.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE') return NodeFilter.FILTER_REJECT;
      if (!node.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  while (walker.nextNode()) {
    translateTextNode(walker.currentNode, language);
  }

  root.querySelectorAll('*').forEach((el) => translateAttributes(el, language));
}

export function applyLanguageToUI(language) {
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  if (typeof document === 'undefined') return;
  const body = document.body;
  if (!body) return;

  translateSubtree(body, language);

  observer = new MutationObserver((mutations) => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    animationFrameId = requestAnimationFrame(() => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'characterData') {
          translateTextNode(mutation.target, language);
          return;
        }

        if (mutation.type === 'attributes' && mutation.target instanceof Element) {
          translateAttributes(mutation.target, language);
          return;
        }

        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            translateTextNode(node, language);
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            translateSubtree(node, language);
            translateAttributes(node, language);
          }
        });
      });
      animationFrameId = null;
    });
  });

  observer.observe(body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['placeholder', 'title', 'aria-label']
  });
}
