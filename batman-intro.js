(() => {
  const desktop = matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const userAgent = navigator.userAgent;
  const tablet = /iPad|Tablet|PlayBook|Silk/i.test(userAgent) ||
    (/Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1) ||
    (/Android/i.test(userAgent) && !/Mobile/i.test(userAgent));
  const phone = !tablet && (navigator.userAgentData?.mobile ||
    /iPhone|iPod|Mobi/i.test(userAgent));

  if (tablet || (!phone && !desktop.matches) || reducedMotion.matches || location.hash ||
      typeof HTMLDialogElement === 'undefined' || !HTMLDialogElement.prototype.showModal) return;

  const dialog = document.createElement('dialog');
  dialog.id = 'batman-intro';
  dialog.setAttribute('aria-label', 'Cinematic intro');
  dialog.innerHTML = `
    <video playsinline aria-hidden="true"></video>
    <div class="intro-controls">
      <button type="button" aria-pressed="true">Sound</button>
      <button type="button" autofocus>Skip Intro</button>
    </div>`;

  const video = dialog.querySelector('video');
  const [sound, skip] = dialog.querySelectorAll('button');
  const listeners = new AbortController();
  const options = { signal: listeners.signal };
  let closing = false;
  let playbackTimeout;

  function updateSound() {
    sound.setAttribute('aria-pressed', String(!video.muted));
  }

  function finish(immediately = false) {
    if (closing) return;
    closing = true;
    clearTimeout(playbackTimeout);
    listeners.abort();
    video.pause();

    function remove() {
      video.removeAttribute('src');
      video.load();
      dialog.close();
      dialog.remove();
    }

    if (immediately || reducedMotion.matches) {
      remove();
      return;
    }

    dialog.classList.add('is-closing');
    const fallback = setTimeout(remove, 550);
    dialog.addEventListener('transitionend', () => {
      clearTimeout(fallback);
      remove();
    }, { once: true });
  }

  function waitForPlayback() {
    clearTimeout(playbackTimeout);
    playbackTimeout = setTimeout(() => finish(true), 10000);
  }

  skip.addEventListener('click', () => finish(), options);
  sound.addEventListener('click', () => {
    video.muted = !video.muted;
    updateSound();
    video.play().catch(() => finish(true));
  }, options);
  video.addEventListener('volumechange', updateSound, options);
  video.addEventListener('ended', () => finish(), options);
  video.addEventListener('error', () => finish(true), options);
  video.addEventListener('waiting', waitForPlayback, options);
  video.addEventListener('playing', () => clearTimeout(playbackTimeout), options);
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    finish();
  }, options);
  dialog.addEventListener('cancel', event => event.preventDefault());
  reducedMotion.addEventListener('change', () => finish(true), options);
  desktop.addEventListener('change', () => {
    if (!phone && !desktop.matches) finish(true);
  }, options);
  window.addEventListener('hashchange', () => finish(true), options);

  document.body.append(dialog);
  dialog.showModal();
  waitForPlayback();
  // Start inline and muted on phones so Safari can autoplay before a tap.
  video.muted = Boolean(phone);
  updateSound();
  video.src = new URL('./Polyester%20Batman%20edit_1080p60.mp4', document.currentScript.src);
  video.play().catch(error => {
    if (closing) return;
    if (video.muted || error.name !== 'NotAllowedError') {
      finish(true);
      return;
    }
    video.muted = true;
    updateSound();
    video.play().catch(() => finish(true));
  });
})();
