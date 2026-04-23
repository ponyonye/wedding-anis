// ═══════════════════════════════════════════════════════════
//  WEDDING PREMIUM — Vanilla JS
//  Ginanjar Utardi & Anis Rahmantika | 31 Mei 2026
// ═══════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────
//  OPEN INVITATION — Magical zoom-reveal
// ───────────────────────────────────────────────────────────
function openInvitation() {
  const cover = document.getElementById('cover');
  if (!cover) return;

  // Add hiding class that triggers CSS transition
  cover.classList.add('hiding');

  // Trigger hero elements to animate in after cover fades
  setTimeout(() => {
    cover.style.display = 'none';
    revealHeroElements();
  }, 1400);

  // Music fade-in
  const music = document.getElementById('music');
  if (music) {
    music.volume = 0;
    music.play().catch(() => {});
    let vol = 0;
    const fadeIn = setInterval(() => {
      vol = Math.min(vol + 0.04, 0.7);
      music.volume = vol;
      if (vol >= 0.7) clearInterval(fadeIn);
    }, 180);
  }
}

// Reveal hero text after cover is gone
function revealHeroElements() {
  const ids = ['hero-label', 'hero-title', 'hero-date', 'hero-sub'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }
  });
}


// ═══════════════════════════════════════════════════════════
//  DOM READY
// ═══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {

  // ──────────────────────────────────────────
  //  GUEST NAME from ?to= param
  // ──────────────────────────────────────────
  const guestEl = document.getElementById('guestName');
  if (guestEl) {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('to');
    guestEl.textContent = name || 'Tamu Undangan';
  }


  // ──────────────────────────────────────────
  //  HERO SLIDER
  // ──────────────────────────────────────────
  const slides = document.querySelectorAll('.slide');
  let slideIdx = 0;
  if (slides.length) {
    setInterval(() => {
      slides[slideIdx].classList.remove('active');
      slideIdx = (slideIdx + 1) % slides.length;
      slides[slideIdx].classList.add('active');
    }, 7000);
  }


  // ──────────────────────────────────────────
  //  MUSIC TOGGLE
  // ──────────────────────────────────────────
  const musicEl = document.getElementById('music');
  const musicToggle = document.getElementById('musicToggle');
  const eqBars = document.querySelectorAll('.eq-bar');

  function pauseEq() {
    eqBars.forEach(b => { b.style.animationPlayState = 'paused'; b.style.transform = 'scaleY(0.3)'; });
  }
  function playEq() {
    eqBars.forEach(b => { b.style.animationPlayState = 'running'; b.style.transform = ''; });
  }

  if (musicEl && musicToggle) {
    musicToggle.addEventListener('click', () => {
      if (musicEl.paused) {
        musicEl.play();
        playEq();
      } else {
        musicEl.pause();
        pauseEq();
      }
    });
  }


  // ──────────────────────────────────────────
  //  COUNTDOWN
  // ──────────────────────────────────────────
  const countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    const target = new Date('2026-05-31T08:00:00').getTime();

    function renderCountdown() {
      const gap = target - Date.now();
      if (gap <= 0) {
        countdownEl.innerHTML = `<p class="font-display text-2xl text-gradient-gold">Semoga berbahagia ✦</p>`;
        return;
      }
      const d = Math.floor(gap / 86400000);
      const h = Math.floor((gap / 3600000) % 24);
      const m = Math.floor((gap / 60000) % 60);
      const s = Math.floor((gap / 1000) % 60);

      countdownEl.innerHTML = [
        { v: d, l: 'Hari' },
        { v: h, l: 'Jam' },
        { v: m, l: 'Menit' },
        { v: s, l: 'Detik' }
      ].map(({ v, l }) => `
        <div class="countdown-box">
          <div class="countdown-num">${String(v).padStart(2, '0')}</div>
          <div class="countdown-label">${l}</div>
        </div>
      `).join('');
    }

    renderCountdown();
    setInterval(renderCountdown, 1000);
  }


  // ──────────────────────────────────────────
  //  CALENDAR LINK
  // ──────────────────────────────────────────
  const calBtn = document.getElementById('calendarBtn');
  if (calBtn) {
    const title    = 'Pernikahan Ginanjar & Anis';
    const location = 'Ballroom Hotel Lemo Serpong';
    const desc     = 'Kami mengundang Anda ke hari bahagia kami. Semoga dapat hadir dan memberikan doa restu.';
    const start    = '20260531T080000';
    const end      = '20260531T120000';
    calBtn.href =
      'https://www.google.com/calendar/render?action=TEMPLATE' +
      '&text='     + encodeURIComponent(title) +
      '&dates='    + start + '/' + end +
      '&details='  + encodeURIComponent(desc) +
      '&location=' + encodeURIComponent(location);
  }


  // ──────────────────────────────────────────
  //  WHATSAPP
  // ──────────────────────────────────────────
  function buildWaLink() {
    const guest = new URLSearchParams(window.location.search).get('to') || 'Tamu';
    const msg = `Assalamu'alaikum, saya ${guest} ingin mengkonfirmasi telah mengirimkan hadiah untuk pernikahan Ginanjar & Anis. Terima kasih 😊`;
    return `https://wa.me/6285155456995?text=${encodeURIComponent(msg)}`;
  }
  const waBtn = document.getElementById('waConfirm');
  if (waBtn) waBtn.href = buildWaLink();


  // ──────────────────────────────────────────
  //  PARALLAX — Hero
  // ──────────────────────────────────────────
  let scrollY = 0;
  let rafPending = false;

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(() => {
        // Hero slider parallax
        slides.forEach(slide => {
          slide.style.transform = `translateY(${scrollY * 0.25}px) scale(1.1)`;
        });
        // Hero content upward drift
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
          heroContent.style.transform = `translateY(${scrollY * 0.12}px)`;
        }
        rafPending = false;
      });
    }
  }, { passive: true });


  // ──────────────────────────────────────────
  //  INTERSECTION OBSERVER — Reveal animations
  // ──────────────────────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible', 'show');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll(
    '.reveal, .reveal-scale, .reveal-left, .reveal-right, .fade-up'
  ).forEach(el => revealObserver.observe(el));


  // ──────────────────────────────────────────
  //  GALLERY INTERSECTION
  // ──────────────────────────────────────────
  const galleryEl = document.getElementById('gallery');
  if (galleryEl) {
    const imgs = document.querySelectorAll('.gallery-img');

    const galleryObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          imgs.forEach((img, i) => {
            setTimeout(() => img.classList.add('show'), i * 80);
          });
          galleryObserver.disconnect();
        }
      });
    }, { threshold: 0.1 });

    galleryObserver.observe(galleryEl);
  }


  // ──────────────────────────────────────────
  //  COPY REKENING
  // ──────────────────────────────────────────
  window.copyRek = function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    const text = el.innerText.trim();

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => showNotifCopy('✔ Nomor rekening disalin'))
        .catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  };

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    showNotifCopy('✔ Nomor rekening disalin');
  }

  function showNotifCopy(msg) {
    const notif = document.getElementById('notifCopy');
    if (!notif) return;
    notif.textContent = msg;
    notif.classList.add('opacity-100');
    notif.classList.remove('opacity-0');
    setTimeout(() => {
      notif.classList.remove('opacity-100');
      notif.classList.add('opacity-0');
    }, 2200);
  }


  // ──────────────────────────────────────────
  //  LIGHTBOX
  // ──────────────────────────────────────────
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeLB     = document.getElementById('closeLightbox');
  const lightPrev   = document.getElementById('lightPrev');
  const lightNext   = document.getElementById('lightNext');
  const lightboxBg  = document.querySelector('.lightbox-bg');
  const galleryImgs = document.querySelectorAll('.gallery-img');
  let currentLBIndex = 0;

  galleryImgs.forEach((img, i) => {
    img.addEventListener('click', () => { currentLBIndex = i; openLB(); });
  });

  function openLB() {
    if (!lightbox) return;
    lightbox.classList.remove('hidden');
    updateLB();
    document.body.style.overflow = 'hidden';
  }

  function closeLBFn() {
    if (!lightbox) return;
    lightbox.classList.add('hidden');
    document.body.style.overflow = '';
    resetParallax();
  }

  function updateLB() {
    if (!lightboxImg) return;
    const src = galleryImgs[currentLBIndex]?.src;
    lightboxImg.style.opacity = '0';
    lightboxImg.style.transform = 'scale(0.95)';
    setTimeout(() => {
      lightboxImg.src = src;
      lightboxImg.style.opacity = '1';
      lightboxImg.style.transform = 'scale(1)';
    }, 200);
    if (lightboxBg && src) {
      lightboxBg.style.backgroundImage = `url(${src})`;
      lightboxBg.style.backgroundSize = 'cover';
      lightboxBg.style.backgroundPosition = 'center';
      lightboxBg.style.filter = 'blur(40px) brightness(0.25)';
    }
  }

  closeLB?.addEventListener('click', closeLBFn);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLBFn(); });

  function nextLB() { currentLBIndex = (currentLBIndex + 1) % galleryImgs.length; updateLB(); }
  function prevLB() { currentLBIndex = (currentLBIndex - 1 + galleryImgs.length) % galleryImgs.length; updateLB(); }

  lightNext?.addEventListener('click', nextLB);
  lightPrev?.addEventListener('click', prevLB);

  document.addEventListener('keydown', e => {
    if (!lightbox || lightbox.classList.contains('hidden')) return;
    if (e.key === 'ArrowRight') nextLB();
    if (e.key === 'ArrowLeft')  prevLB();
    if (e.key === 'Escape')     closeLBFn();
  });

  // Swipe on lightbox
  let lbTouchX = 0;
  lightbox?.addEventListener('touchstart', e => { lbTouchX = e.touches[0].clientX; }, { passive: true });
  lightbox?.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - lbTouchX;
    if (dx < -50) nextLB();
    if (dx >  50) prevLB();
  }, { passive: true });


  // ──────────────────────────────────────────
  //  RSVP FORM
  // ──────────────────────────────────────────
  const form    = document.getElementById('rsvpForm');
  const ucapanList = document.getElementById('ucapanList');

  function timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60)    return 'Baru saja';
    if (diff < 3600)  return Math.floor(diff / 60)   + ' menit lalu';
    if (diff < 86400) return Math.floor(diff / 3600)  + ' jam lalu';
    return Math.floor(diff / 86400) + ' hari lalu';
  }

  function statusIcon(s) {
    if (s === 'Hadir')           return '✓ Hadir';
    if (s === 'Tidak Hadir')     return '✗ Tidak Hadir';
    return '? Belum Tentukan';
  }
  function statusColor(s) {
    if (s === 'Hadir')       return '#c6a85b';
    if (s === 'Tidak Hadir') return 'rgba(255,255,255,0.3)';
    return 'rgba(255,255,255,0.4)';
  }

  async function loadUcapan() {
    if (!ucapanList) return;
    try {
      const res  = await fetch('get_ucapan.php');
      const data = await res.json();
      ucapanList.innerHTML = '';

      if (!data.length) {
        ucapanList.innerHTML = `
          <p style="text-align:center; color:rgba(255,255,255,0.25); font-size:13px; font-family:'Jost',sans-serif; font-weight:300; padding:20px 0; letter-spacing:0.1em;">
            Belum ada ucapan. Jadilah yang pertama! ✦
          </p>`;
        return;
      }

      data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'ucapan-item';
        div.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
            <span style="font-family:'Cormorant Garamond',serif; font-size:16px; font-weight:400; color:rgba(255,255,255,0.85);">
              ${escapeHtml(item.nama)}
            </span>
            <span style="font-family:'Jost',sans-serif; font-size:9px; font-weight:300; letter-spacing:0.15em; color:${statusColor(item.status)}; white-space:nowrap; margin-left:8px; padding-top:2px;">
              ${statusIcon(item.status)}
            </span>
          </div>
          <p style="font-family:'Jost',sans-serif; font-size:13px; font-weight:300; color:rgba(255,255,255,0.5); line-height:1.6; margin-bottom:6px;">
            ${escapeHtml(item.pesan)}
          </p>
          <span style="font-family:'Jost',sans-serif; font-size:10px; font-weight:300; color:rgba(198,168,91,0.4); letter-spacing:0.1em;">
            ${timeAgo(item.created_at)}
          </span>
        `;
        ucapanList.appendChild(div);
      });
    } catch (err) {
      console.warn('Load ucapan error:', err);
    }
  }

  function escapeHtml(str) {
    const map = { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' };
    return String(str).replace(/[&<>"']/g, c => map[c]);
  }

  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Mengirim...';
      }

      const data = {
        nama:   document.getElementById('nama')?.value.trim()   || '',
        status: document.getElementById('status')?.value        || '',
        pesan:  document.getElementById('pesan')?.value.trim()  || ''
      };

      if (!data.nama || !data.pesan) {
        showToast('Nama & ucapan wajib diisi ✦');
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Kirim Ucapan'; }
        return;
      }

      try {
        const res    = await fetch('rsvp.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await res.json();

        if (!res.ok || result.error) throw new Error(result.error || 'Server error');

        form.reset();
        showToast('Ucapan berhasil dikirim ✨');
        loadUcapan();

      } catch (err) {
        console.error('RSVP error:', err);
        showToast('Gagal mengirim, coba lagi ❌');
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Kirim Ucapan'; }
      }
    });
  }

  if (ucapanList) {
    loadUcapan();
    setInterval(loadUcapan, 7000);
  }

}); // end DOMContentLoaded


// ═══════════════════════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════════════════════
function showToast(msg = 'Berhasil!') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2800);
}


// ═══════════════════════════════════════════════════════════
//  COPY REKENING (global, callable from HTML onclick)
// ═══════════════════════════════════════════════════════════
function copyRek(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const text = el.innerText.trim();

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
      .then(() => showToast('✔ Nomor rekening disalin'))
      .catch(() => _fallbackCopy(text));
  } else {
    _fallbackCopy(text);
  }
}

function _fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); } catch (e) {}
  document.body.removeChild(ta);
  showToast('✔ Nomor rekening disalin');
}


// ═══════════════════════════════════════════════════════════
//  PARALLAX — Lightbox image tilt
// ═══════════════════════════════════════════════════════════
let lbTargetX = 0, lbTargetY = 0;
let lbCurrentX = 0, lbCurrentY = 0;
const LB_STRENGTH = 16;
const LB_EASE = 0.07;

const lightboxEl  = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxBgEl = document.querySelector('.lightbox-bg');

function isLBOpen() { return lightboxEl && !lightboxEl.classList.contains('hidden'); }

window.addEventListener('mousemove', e => {
  if (!isLBOpen()) return;
  lbTargetX = (e.clientX / window.innerWidth  - 0.5) * 2 * LB_STRENGTH;
  lbTargetY = (e.clientY / window.innerHeight - 0.5) * 2 * LB_STRENGTH;
});

function animLB() {
  if (isLBOpen() && lightboxImg && lightboxBgEl) {
    lbCurrentX += (lbTargetX - lbCurrentX) * LB_EASE;
    lbCurrentY += (lbTargetY - lbCurrentY) * LB_EASE;
    lightboxImg.style.transform  = `translate3d(${lbCurrentX}px, ${lbCurrentY}px, 0) scale(1.01)`;
    lightboxBgEl.style.transform = `translate3d(${lbCurrentX * 1.6}px, ${lbCurrentY * 1.6}px, 0) scale(1.12)`;
  }
  requestAnimationFrame(animLB);
}
animLB();

function resetParallax() {
  lbTargetX = lbTargetY = lbCurrentX = lbCurrentY = 0;
  if (lightboxImg)  lightboxImg.style.transform  = 'translate3d(0,0,0) scale(1)';
  if (lightboxBgEl) lightboxBgEl.style.transform = 'translate3d(0,0,0) scale(1)';
}


// ═══════════════════════════════════════════════════════════
//  CANVAS — GOLD DUST PARTICLES
// ═══════════════════════════════════════════════════════════
(function initGoldDust() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const DPR = window.devicePixelRatio || 1;
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth  * DPR;
    H = canvas.height = window.innerHeight * DPR;
    canvas.style.width  = window.innerWidth  + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  resize();
  window.addEventListener('resize', resize);

  const COUNT = window.innerWidth < 768 ? 40 : 80;

  // Each particle is a tiny gold mote that drifts organically
  const particles = Array.from({ length: COUNT }, () => ({
    x:     Math.random() * window.innerWidth,
    y:     Math.random() * window.innerHeight,
    r:     Math.random() * 1.8 + 0.3,
    vx:    (Math.random() - 0.5) * 0.25,
    vy:    -(Math.random() * 0.5 + 0.15),  // gently float upward
    alpha: Math.random(),
    alphaDir: Math.random() < 0.5 ? 1 : -1,
    alphaSpeed: Math.random() * 0.006 + 0.002,
    // Organic drift using sine-wave
    phase: Math.random() * Math.PI * 2,
    wobble: Math.random() * 0.4 + 0.1
  }));

  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, W / DPR, H / DPR);
    frame++;

    particles.forEach(p => {
      // Organic sideways wobble
      p.x += p.vx + Math.sin(frame * 0.01 + p.phase) * p.wobble * 0.3;
      p.y += p.vy;

      // Alpha pulse
      p.alpha += p.alphaDir * p.alphaSpeed;
      if (p.alpha >= 1 || p.alpha <= 0) p.alphaDir *= -1;

      // Wrap
      if (p.y < -5)                  p.y = window.innerHeight + 5;
      if (p.x < -10)                 p.x = window.innerWidth  + 10;
      if (p.x > window.innerWidth + 10) p.x = -10;

      // Gold dust glow
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
      grd.addColorStop(0,   `rgba(240, 210, 130, ${p.alpha * 0.9})`);
      grd.addColorStop(0.5, `rgba(198, 168, 91,  ${p.alpha * 0.5})`);
      grd.addColorStop(1,   `rgba(198, 168, 91,  0)`);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Inner bright core
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 235, 170, ${p.alpha * 0.8})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();
})();


// ═══════════════════════════════════════════════════════════
//  CANVAS — CURSOR TRAIL (gold)
// ═══════════════════════════════════════════════════════════
(function initCursorTrail() {
  const canvas = document.getElementById('cursorTrail');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const DPR = window.devicePixelRatio || 1;
  let W, H;

  let trails  = [];
  let ripples = [];
  let sparks  = [];

  function resize() {
    W = canvas.width  = window.innerWidth  * DPR;
    H = canvas.height = window.innerHeight * DPR;
    canvas.style.width  = window.innerWidth  + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  function addTrail(x, y) {
    // Limit pool
    if (trails.length > 120) trails.splice(0, 20);
    for (let i = 0; i < 3; i++) {
      trails.push({
        x, y,
        r:     Math.random() * 2.5 + 0.5,
        alpha: 0.8 + Math.random() * 0.2,
        vx:    (Math.random() - 0.5) * 0.8,
        vy:    (Math.random() - 0.5) * 0.8 - 0.3
      });
    }
  }

  function addClick(x, y) {
    ripples.push({ x, y, r: 0, alpha: 0.7 });
    for (let i = 0; i < 14; i++) {
      const angle = (Math.PI * 2 / 14) * i + Math.random() * 0.4;
      sparks.push({
        x, y,
        vx: Math.cos(angle) * (Math.random() * 3 + 1),
        vy: Math.sin(angle) * (Math.random() * 3 + 1),
        r:  Math.random() * 1.5 + 0.5,
        alpha: 1
      });
    }
  }

  window.addEventListener('mousemove',  e => addTrail(e.clientX, e.clientY));
  window.addEventListener('touchmove',  e => { const t = e.touches[0]; addTrail(t.clientX, t.clientY); }, { passive: true });
  window.addEventListener('click',      e => addClick(e.clientX, e.clientY));
  window.addEventListener('touchstart', e => { const t = e.touches[0]; addClick(t.clientX, t.clientY); }, { passive: true });

  function animate() {
    ctx.clearRect(0, 0, W, H);

    // TRAIL
    for (let i = trails.length - 1; i >= 0; i--) {
      const p = trails[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.025;

      if (p.alpha <= 0) { trails.splice(i, 1); continue; }

      ctx.shadowBlur  = 8;
      ctx.shadowColor = `rgba(198,168,91,0.6)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(198,168,91,${p.alpha})`;
      ctx.fill();
    }

    // RIPPLE
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.r     += 3;
      r.alpha -= 0.018;

      if (r.alpha <= 0) { ripples.splice(i, 1); continue; }

      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(198,168,91,${r.alpha})`;
      ctx.lineWidth   = 1.5;
      ctx.stroke();
    }

    // SPARKS
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.05; // gentle gravity
      s.alpha -= 0.028;

      if (s.alpha <= 0) { sparks.splice(i, 1); continue; }

      ctx.shadowBlur  = 6;
      ctx.shadowColor = `rgba(240,210,130,0.8)`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240,210,130,${s.alpha})`;
      ctx.fill();
    }

    ctx.shadowBlur = 0;
    requestAnimationFrame(animate);
  }

  animate();
})();


// ─── passive listeners ────────────────────────────────────
document.addEventListener('touchmove', () => {}, { passive: true });
