(function () {
  try {
    var d = document.documentElement;
    var saved = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply theme classes
    if (saved === 'ocean') { d.classList.add('dark', 'theme-ocean'); }
    else if (saved === 'sunset') { d.classList.add('dark', 'theme-sunset'); }
    else if (saved === 'cyberpunk') { d.classList.add('dark', 'theme-cyberpunk'); }
    else if (saved === 'forest') { d.classList.add('dark', 'theme-forest'); }
    else if (saved === 'dark' || (!saved && prefersDark)) { d.classList.add('dark'); }
    
    // Set background-color to prevent flash
    var bgMap = {
      dark: '#000000',
      ocean: '#0d1b32',
      sunset: '#2b0a0a',
      cyberpunk: '#09090b',
      forest: '#052e16'
    };
    var bg = bgMap[saved] || (prefersDark ? '#000000' : '#ffffff');
    d.style.backgroundColor = bg;
  } catch (e) {
    console.warn('Theme init failed', e);
  }
})();
