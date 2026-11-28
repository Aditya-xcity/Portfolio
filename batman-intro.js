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
      <button type="button" aria-label="Sound" aria-pressed="true" title="Mute intro" style="width:44px;padding:0;display:grid;place-items:center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M11 5 6 9H3v6h3l5 4V5Z"/>
          <path data-sound-on d="M15 9a4 4 0 0 1 0 6m3-9a8 8 0 0 1 0 12"/>
          <path data-sound-off style="display:none" d="m16 10 4 4m0-4-4 4"/>
        </svg>
      </button>
      <button type="button" autofocus>Skip Intro</button>
    </div>`;

  const video = dialog.querySelector('video');
  const [sound, skip] = dialog.querySelectorAll('button');
  const soundOn = sound.querySelector('[data-sound-on]');
  const soundOff = sound.querySelector('[data-sound-off]');
  const listeners = new AbortController();
  const options = { signal: listeners.signal };
  let closing = false;
  let playbackTimeout;

  function updateSound() {
    sound.setAttribute('aria-pressed', String(!video.muted));
    sound.title = video.muted ? 'Unmute intro' : 'Mute intro';
    soundOn.style.display = video.muted ? 'none' : '';
    soundOff.style.display = video.muted ? '' : 'none';
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
