(function () {
  try {
    var d = document.documentElement;
    var saved = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var legacy = ['ocean', 'sunset', 'cyberpunk', 'forest'];
    var theme =
      saved === 'light' || saved === 'dark'
        ? saved
        : legacy.indexOf(saved) !== -1
          ? 'dark'
          : prefersDark
            ? 'dark'
            : 'light';
    if (theme === 'dark') d.classList.add('dark');
    d.style.backgroundColor = theme === 'dark' ? '#07080a' : '#e9edf2';
  } catch (e) {}
})();
