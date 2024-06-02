import React, { useState, useEffect } from 'react';
import './PrivacyModal.css';

const PrivacyModal = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('gdprConsent');
    if (!hasConsented) {
      setIsVisible(true);
    }
  }, []);

  const handleConsent = (consentType) => {
    console.log("Consent type:", consentType);
    localStorage.setItem('gdprConsent', consentType);
    setIsVisible(false);
    onClose();  // 确保这里调用了 onClose
  };

  if (!isVisible) return null;

  return (
    <div className="privacy-modal-overlay">
      <div className="privacy-modal">
        <h2>Your privacy is important to us</h2>
        <p>We use cookies and other technologies to ensure you have the best experience on our website. By clicking
          "Accept all," you agree to the storage of cookies on your device to improve website navigation, analyze
          website usage, and assist with our marketing efforts. If you click on "Only necessary," only cookies that
          are required for technical reasons to operate the website will be used.</p>
        <div className="button-group">
          <button className="necessary-btn" onClick={() => handleConsent('necessary')}>Only necessary</button>
          <button className="accept-all-btn" onClick={() => handleConsent('all')}>Accept all</button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
