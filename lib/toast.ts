import { Alert, Platform } from 'react-native';

export function showToast(message: string) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    // Simple web toast — create a temporary div
    const el = document.createElement('div');
    el.textContent = message;
    Object.assign(el.style, {
      position: 'fixed',
      bottom: '32px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#1A2F38',
      color: '#fff',
      padding: '14px 28px',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '500',
      zIndex: '99999',
      opacity: '0',
      transition: 'opacity 0.3s ease',
      pointerEvents: 'none',
    });
    document.body.appendChild(el);
    requestAnimationFrame(() => { el.style.opacity = '1'; });
    setTimeout(() => {
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 300);
    }, 2500);
  } else {
    Alert.alert('', message);
  }
}

export function showUnderConstruction() {
  showToast('Under construction! Coming soon.');
}
