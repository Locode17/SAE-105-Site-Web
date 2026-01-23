document.addEventListener('DOMContentLoaded', function() {
  const button = document.querySelector('.footer button');
  if (!button) return;

  const path = window.location.pathname;
  const isEnglish = /\/EN\//.test(path);
  const pageLanguage = isEnglish ? 'en' : 'fr';

  // Set document language and initialize button state
  document.documentElement.lang = pageLanguage;
  button.textContent = isEnglish ? 'en ▼' : 'fr ▼';
  button.style.cursor = 'pointer';
  button.setAttribute('role', 'button');
  button.setAttribute('aria-pressed', isEnglish ? 'true' : 'false');
  button.setAttribute('tabindex', '0');
  button.setAttribute('aria-label', isEnglish ? 'Switch language to French' : 'Changer la langue, anglais');

  function computeTargetUrl() {
    // Replace the language folder in the current path
    return isEnglish ? path.replace('/EN/', '/FR/') : path.replace('/FR/', '/EN/');
  }

  function toggleLanguage() {
    const nextLanguage = isEnglish ? 'fr' : 'en';
    localStorage.setItem('preferredLang', nextLanguage);
    // Navigate to the counterpart page in the other language
    window.location.href = computeTargetUrl();
  }

  // click and keyboard support
  button.addEventListener('click', toggleLanguage);
  button.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleLanguage();
    }
  });
});
