try {
  const preference = localStorage.getItem('portfolio-theme');
  if (preference === 'dark' || preference === 'light') {
    document.documentElement.dataset.theme = preference;
  } else if (matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.dataset.theme = 'dark';
  }
} catch {}
