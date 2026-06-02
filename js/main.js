/* =====================================================
   딜러 레이더 - Main JavaScript
   Google Sheets 신청 연동 버전
   ===================================================== */

'use strict';

/**
 * 여기에 Google Apps Script 배포 후 나온 /exec URL을 넣으세요.
 * 예:
 * const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxxxxx/exec';
 */
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyPTEindHXKc5LHARyF2yzcTuQ7ZJktTpGUS7icKySVu79lyH6SWnu814jlhJPcGGHh/exec';

// ─── 1. NAVBAR SCROLL EFFECT ───────────────────────
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
}

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (hamburger) hamburger.classList.remove('open');
    if (mobileMenu) mobileMenu.classList.remove('open');
  });
});

// ─── 2. HERO PARTICLES ─────────────────────────────
function createParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const count = window.innerWidth < 600 ? 12 : 24;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 4 + 2;

    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * 30}%;
      animation-duration: ${Math.random() * 8 + 6}s;
      animation-delay: ${Math.random() * 6}s;
      opacity: 0;
    `;

    container.appendChild(particle);
  }
}

createParticles();

// ─── 3. WAVEFORM BARS ──────────────────────────────
function generateWaveform() {
  const waveform = document.getElementById('waveform');
  if (!waveform) return;

  const heights = [
    20, 35, 48, 30, 55, 42, 28, 60, 45, 32,
    52, 38, 25, 50, 44, 36, 58, 40, 28, 62,
    46, 33, 55, 41, 29, 48, 38, 52, 44, 30,
    56, 43, 27, 50, 37, 60, 42, 31, 54, 40,
    26, 48, 36, 58, 44, 32, 52, 38, 24, 46, 34, 50
  ];

  waveform.innerHTML = '';

  heights.forEach((height, index) => {
    const bar = document.createElement('div');
    bar.className = 'wave-bar';
    bar.style.height = `${height}%`;
    bar.dataset.index = index;
    waveform.appendChild(bar);
  });
}

generateWaveform();

// ─── 4. DEMO PLAYER ────────────────────────────────
const DEMO_SCRIPT = [
  {
    delay: 600,
    speaker: 'dealer',
    text: '안녕하세요, 저번에 문의주신 그랜저 건인데요. 좋은 매물이 들어와서 연락드렸습니다.',
  },
  {
    delay: 2200,
    speaker: 'customer',
    text: '아, 네. 어떤 거예요? 혹시 흰색 있나요?',
    signal: null,
  },
  {
    delay: 3800,
    speaker: 'dealer',
    text: '네, 2021년식 그랜저 IG 흰색 풀옵션 차량이 있습니다. 가격은 2,950만 원입니다.',
  },
  {
    delay: 5600,
    speaker: 'customer',
    text: '음... 3천이 넘는 건 조금 부담스러워서요. 3천 안으로는 안 되나요?',
    signal: { type: 'budget', label: '💰 예산 기준 확인: 3,000만 원 이하 선호' },
  },
  {
    delay: 7400,
    speaker: 'dealer',
    text: '아, 그렇군요. 혹시 색상은 흰색이 꼭 필요하신가요?',
  },
  {
    delay: 9200,
    speaker: 'customer',
    text: '흰색이면 제일 좋긴 한데... 다른 색도 괜찮긴 해요.',
    signal: { type: 'preference', label: '🎨 선호 옵션: 흰색 선호, 대체 색상 가능' },
  },
  {
    delay: 11000,
    speaker: 'dealer',
    text: '그럼 비슷한 조건의 은색 2021년식이 2,870만 원에 있습니다. 이쪽도 비교해보실 수 있습니다.',
  },
  {
    delay: 13000,
    speaker: 'customer',
    text: '음, 그렇군요. 아내랑 한 번 상의해 봐야 할 것 같아요.',
    signal: { type: 'hesitation', label: '⚠️ 망설임 포인트: 가족 협의 필요' },
  },
  {
    delay: 15000,
    speaker: 'dealer',
    text: '네, 괜찮습니다. 그럼 언제쯤 다시 연락드리면 좋을까요?',
  },
  {
    delay: 16800,
    speaker: 'customer',
    text: '내일 저녁쯤이면 좋을 것 같아요.',
    signal: { type: 'preference', label: '📅 재연락 타이밍: 내일 저녁' },
  },
];

const COACHING_TEXT = `<strong>📌 AI 후속관리 제안</strong><br><br>
이 고객은 <strong>3,000만 원 이하 예산</strong>을 중요하게 보고 있으며, 흰색을 선호하지만 대체 색상도 검토할 여지가 있습니다.<br><br>
→ <strong>내일 저녁</strong> 재연락 시에는 가격보다 <strong>예산 안에 들어오는 대체 차량</strong>을 먼저 정리해주는 흐름이 좋습니다.<br><br>
→ 추천 멘트: <em>"고객님, 말씀하신 3천만 원 이하 조건 기준으로 흰색과 대체 가능한 색상 차량을 같이 정리해드렸습니다."</em>`;

const SCORE_DATA = [
  { label: '예산 확인', value: 85 },
  { label: '선호 조건 파악', value: 78 },
  { label: '망설임 포인트 확인', value: 72 },
  { label: '재연락 일정 확보', value: 90 },
];

let isPlaying = false;
let currentProgress = 0;
let progressInterval = null;
let demoPhase = 'idle';
let transcriptItemCount = 0;

const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const progressFill = document.getElementById('progressFill');
const progressThumb = document.getElementById('progressThumb');
const currentTimeEl = document.getElementById('currentTime');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const analysisLoader = document.getElementById('analysisLoader');
const transcriptBox = document.getElementById('transcriptBox');
const signalsSection = document.getElementById('signalsSection');
const signalTags = document.getElementById('signalTags');
const coachingSection = document.getElementById('coachingSection');
const coachingCard = document.getElementById('coachingCard');
const scoreSection = document.getElementById('scoreSection');
const scoreBars = document.getElementById('scoreBars');

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const restSeconds = Math.floor(seconds % 60);
  return `${minutes}:${restSeconds.toString().padStart(2, '0')}`;
}

function updateWaveActive(progress) {
  const bars = document.querySelectorAll('.wave-bar');
  const activePct = progress / 100;

  bars.forEach((bar, index) => {
    const barPct = index / bars.length;
    bar.classList.remove('active', 'played');

    if (barPct < activePct - 0.02) {
      bar.classList.add('played');
    } else if (barPct < activePct + 0.04) {
      bar.classList.add('active');
    }
  });
}

function setStatus(state) {
  if (!statusDot || !statusText) return;

  statusDot.className = 'status-dot ' + state;

  const labels = {
    idle: '분석 대기 중',
    analyzing: 'AI 분석 중...',
    done: '분석 완료'
  };

  statusText.textContent = labels[state] || '';

  if (analysisLoader) {
    analysisLoader.style.display = state === 'analyzing' ? 'flex' : 'none';
  }
}

function addTranscriptLine(speaker, text, delay) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (!transcriptBox) {
        resolve();
        return;
      }

      if (transcriptItemCount === 0) {
        transcriptBox.innerHTML = '';
      }

      transcriptItemCount++;

      const line = document.createElement('div');
      line.className = 'transcript-line';

      const speakerTag = document.createElement('span');
      speakerTag.className = `transcript-speaker ${speaker === 'dealer' ? 'speaker-dealer' : 'speaker-customer'}`;
      speakerTag.textContent = speaker === 'dealer' ? '딜러' : '고객';

      const textEl = document.createElement('span');
      textEl.className = 'transcript-text';
      textEl.textContent = '';

      line.appendChild(speakerTag);
      line.appendChild(textEl);
      transcriptBox.appendChild(line);
      transcriptBox.scrollTop = transcriptBox.scrollHeight;

      let charIdx = 0;
      const typingInterval = setInterval(() => {
        if (charIdx < text.length) {
          textEl.textContent += text[charIdx];
          charIdx++;
          transcriptBox.scrollTop = transcriptBox.scrollHeight;
        } else {
          clearInterval(typingInterval);
          resolve();
        }
      }, 22);
    }, delay);
  });
}

function addSignalTag(signal, delay) {
  setTimeout(() => {
    if (!signal || !signalsSection || !signalTags) return;

    if (signalsSection.style.display === 'none') {
      signalsSection.style.display = 'block';
    }

    const tag = document.createElement('div');
    tag.className = `signal-tag ${signal.type}`;
    tag.innerHTML = `<i class="fa-solid fa-bolt"></i> ${signal.label}`;
    signalTags.appendChild(tag);
  }, delay);
}

function showCoaching(delay) {
  setTimeout(() => {
    if (!coachingSection || !coachingCard) return;

    coachingSection.style.display = 'block';
    coachingCard.innerHTML = COACHING_TEXT;
    coachingCard.style.animation = 'fadeInUp 0.5s ease both';
  }, delay);
}

function showScores(delay) {
  setTimeout(() => {
    if (!scoreSection || !scoreBars) return;

    scoreSection.style.display = 'block';
    scoreBars.innerHTML = '';

    SCORE_DATA.forEach((item, index) => {
      const el = document.createElement('div');
      el.className = 'score-item';
      el.style.animationDelay = `${index * 0.1}s`;
      el.innerHTML = `
        <span class="score-label">${item.label}</span>
        <div class="score-bar-wrap">
          <div class="score-bar-fill" data-val="${item.value}"></div>
        </div>
        <span class="score-val">${item.value}</span>
      `;
      scoreBars.appendChild(el);
    });

    setTimeout(() => {
      document.querySelectorAll('.score-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.val + '%';
      });
    }, 100);
  }, delay);
}

function resetDemo() {
  clearInterval(progressInterval);

  currentProgress = 0;
  transcriptItemCount = 0;
  demoPhase = 'idle';
  isPlaying = false;

  if (playIcon) playIcon.className = 'fa-solid fa-play';
  if (progressFill) progressFill.style.width = '0%';
  if (progressThumb) progressThumb.style.left = '0%';
  if (currentTimeEl) currentTimeEl.textContent = '0:00';

  setStatus('idle');

  if (transcriptBox) {
    transcriptBox.innerHTML = `
      <div class="transcript-placeholder">
        <i class="fa-regular fa-circle-play"></i>
        <p>재생 버튼을 눌러 AI 분석을 시작하세요</p>
      </div>
    `;
  }

  if (signalsSection) signalsSection.style.display = 'none';
  if (signalTags) signalTags.innerHTML = '';
  if (coachingSection) coachingSection.style.display = 'none';
  if (coachingCard) coachingCard.innerHTML = '';
  if (scoreSection) scoreSection.style.display = 'none';
  if (scoreBars) scoreBars.innerHTML = '';

  updateWaveActive(0);
}

function startDemo() {
  if (!playIcon || !progressFill || !progressThumb || !currentTimeEl) return;

  isPlaying = true;
  demoPhase = 'playing';
  playIcon.className = 'fa-solid fa-pause';
  setStatus('analyzing');

  const totalSeconds = 272;
  const totalDuration = 18000;
  const startTime = Date.now();

  progressInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const percent = Math.min((elapsed / totalDuration) * 100, 100);

    currentProgress = percent;
    progressFill.style.width = percent + '%';
    progressThumb.style.left = percent + '%';
    currentTimeEl.textContent = formatTime((percent / 100) * totalSeconds);

    updateWaveActive(percent);

    if (percent >= 100) {
      clearInterval(progressInterval);
      demoPhase = 'done';
      isPlaying = false;
      playIcon.className = 'fa-solid fa-rotate-right';
      setStatus('done');
    }
  }, 80);

  DEMO_SCRIPT.forEach(item => {
    addTranscriptLine(item.speaker, item.text, item.delay);

    if (item.signal) {
      addSignalTag(item.signal, item.delay + 600);
    }
  });

  showCoaching(13800);
  showScores(15500);
}

if (playBtn) {
  playBtn.addEventListener('click', () => {
    if (demoPhase === 'idle') {
      startDemo();
    } else if (demoPhase === 'done') {
      resetDemo();
      setTimeout(startDemo, 300);
    } else if (isPlaying) {
      isPlaying = false;
      clearInterval(progressInterval);
      if (playIcon) playIcon.className = 'fa-solid fa-play';
      setStatus('idle');
    } else {
      showToast('실제 서비스에서는 일시정지/재개가 지원됩니다.', 2200);
    }
  });
}

const nextBtn = document.getElementById('nextBtn');
if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    resetDemo();
    showToast('데모가 초기화되었습니다.', 1800);
  });
}

const prevBtn = document.getElementById('prevBtn');
if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    resetDemo();
  });
}

// ─── 5. SCROLL REVEAL ──────────────────────────────
function initScrollReveal() {
  const revealEls = document.querySelectorAll(
    '.problem-card, .solution-step, .feature-card, .stat-card, .testimonial-card, .audio-player-card, .analysis-panel'
  );

  revealEls.forEach(el => {
    el.classList.add('reveal');

    const siblings = el.parentElement ? el.parentElement.querySelectorAll('.reveal') : [];
    const index = Array.from(siblings).indexOf(el);

    if (index > 0) {
      el.classList.add(`reveal-delay-${Math.min(index, 4)}`);
    }
  });

  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

initScrollReveal();

// ─── 6. COUNTER ANIMATION ──────────────────────────
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const increment = target / (duration / 16);

  const timer = setInterval(() => {
    start += increment;

    if (start >= target) {
      start = target;
      clearInterval(timer);
    }

    el.textContent = Math.floor(start);
  }, 16);
}

const statsSection = document.getElementById('results');
let statsAnimated = false;

if (statsSection && 'IntersectionObserver' in window) {
  const statsObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !statsAnimated) {
      statsAnimated = true;
      document.querySelectorAll('.stat-number').forEach(el => {
        const target = parseInt(el.dataset.target, 10) || 0;
        animateCounter(el, target);
      });
    }
  }, { threshold: 0.3 });

  statsObserver.observe(statsSection);
}

// ─── 7. CTA FORM → GOOGLE SHEETS ───────────────────
const ctaForm = document.getElementById('ctaForm');

if (ctaForm) {
  ctaForm.addEventListener('submit', async event => {
    event.preventDefault();

    const nameInput = document.getElementById('ctaName');
    const phoneInput = document.getElementById('ctaPhone');
    const regionInput = document.getElementById('ctaRegion');
    const privacyAgreeInput = document.getElementById('ctaPrivacyAgree');
    const websiteInput = document.getElementById('ctaWebsite');
    const submitButton = ctaForm.querySelector('.btn-cta-submit');

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const region = regionInput ? regionInput.value.trim() : '';
    const privacyAgree = privacyAgreeInput ? privacyAgreeInput.checked : false;
    const website = websiteInput ? websiteInput.value.trim() : '';

    if (!name) {
      showToast('이름 또는 닉네임을 입력해 주세요.', 2200, 'error');
      if (nameInput) nameInput.focus();
      return;
    }

    if (!phone) {
      showToast('연락처를 입력해 주세요.', 2200, 'error');
      if (phoneInput) phoneInput.focus();
      return;
    }

    const normalizedPhone = phone.replace(/\s/g, '');
    const phonePattern = /^01[0-9]-?\d{3,4}-?\d{4}$/;

    if (!phonePattern.test(normalizedPhone)) {
      showToast('연락처 형식을 확인해 주세요. 예: 010-1234-5678', 2600, 'error');
      if (phoneInput) phoneInput.focus();
      return;
    }

    if (!privacyAgree) {
      showToast('개인정보 수집·이용 동의가 필요합니다.', 2600, 'error');
      if (privacyAgreeInput) privacyAgreeInput.focus();
      return;
    }

    if (!GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL.includes('여기에_')) {
      showToast('Apps Script 웹앱 URL이 아직 설정되지 않았습니다.', 3000, 'error');
      return;
    }

    const originalButtonHtml = submitButton ? submitButton.innerHTML : '';

    try {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 신청 중...';
      }

      const payload = {
        name,
        phone,
        region,
        privacyAgree,
        website,
        source: 'dealer_radar_landing_beta',
        pageUrl: window.location.href,
        userAgent: navigator.userAgent,
        submittedAt: new Date().toISOString()
      };

      await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      showToast(`${name}님, 베타 신청이 완료되었습니다. 곧 안내드리겠습니다.`, 3500, 'success');
      ctaForm.reset();

    } catch (error) {
      console.error('Beta signup error:', error);
      showToast('신청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.', 3000, 'error');

    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonHtml || '<i class="fa-solid fa-rocket"></i> 베타테스트 신청하기';
      }
    }
  });
}

// ─── 8. TOAST NOTIFICATION ─────────────────────────
function showToast(message, duration = 2500, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');

  if (!toast || !toastMsg) {
    alert(message);
    return;
  }

  const icon = toast.querySelector('i');

  toastMsg.textContent = message;

  if (icon) {
    if (type === 'error') {
      icon.className = 'fa-solid fa-circle-exclamation';
      icon.style.color = 'var(--danger)';
    } else {
      icon.className = 'fa-solid fa-circle-check';
      icon.style.color = 'var(--success)';
    }
  }

  if (type === 'error') {
    toast.style.borderColor = 'rgba(239,68,68,0.35)';
    toast.style.color = 'var(--danger)';
  } else {
    toast.style.borderColor = 'rgba(16,185,129,0.35)';
    toast.style.color = 'var(--success)';
  }

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// ─── 9. EDIT MODE ──────────────────────────────────
const editToggleBtn = document.getElementById('editToggleBtn');
const editToolbarInfo = document.getElementById('editToolbarInfo');
const editSaveBtn = document.getElementById('editSaveBtn');

let editMode = false;
let savedEdits = {};

function loadSavedEdits() {
  try {
    const stored = localStorage.getItem('dealer-radar-edits');

    if (!stored) return;

    savedEdits = JSON.parse(stored);

    Object.entries(savedEdits).forEach(([key, value]) => {
      const el = document.querySelector(`[data-editable="${key}"]`);
      if (el) el.innerHTML = value;
    });
  } catch (error) {
    console.warn('편집 저장값을 불러오지 못했습니다.', error);
  }
}

loadSavedEdits();

if (editToggleBtn) {
  editToggleBtn.addEventListener('click', () => {
    editMode = !editMode;

    document.body.classList.toggle('edit-mode', editMode);
    editToggleBtn.classList.toggle('active', editMode);

    if (editToolbarInfo) {
      editToolbarInfo.style.display = editMode ? 'flex' : 'none';
    }

    document.querySelectorAll('.editable').forEach(el => {
      el.contentEditable = editMode ? 'true' : 'false';
      el.spellcheck = false;
    });

    if (editMode) {
      showToast('편집 모드 활성화 · 파란 테두리 텍스트를 직접 수정하세요.', 3000);
    }
  });
}

if (editSaveBtn) {
  editSaveBtn.addEventListener('click', () => {
    document.querySelectorAll('.editable').forEach(el => {
      const key = el.dataset.editable;
      if (key) savedEdits[key] = el.innerHTML;
    });

    try {
      localStorage.setItem('dealer-radar-edits', JSON.stringify(savedEdits));
      showToast('변경 사항이 저장되었습니다.', 2500);
    } catch (error) {
      showToast('저장 중 오류가 발생했습니다.', 2000, 'error');
    }
  });
}

// ─── 10. SMOOTH SCROLL ─────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', event => {
    const selector = anchor.getAttribute('href');

    if (!selector || selector === '#') return;

    const target = document.querySelector(selector);

    if (target) {
      event.preventDefault();

      const navHeight = navbar ? navbar.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    }
  });
});

// ─── 11. ACTIVE NAV HIGHLIGHT ──────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  if (!navbar) return;

  const scrollY = window.scrollY + navbar.offsetHeight + 60;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);

    if (!link) return;

    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(navLink => {
        navLink.style.color = '';
      });

      link.style.color = 'var(--primary-light)';
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });

// ─── 12. INIT ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 딜러 레이더 랜딩페이지 로드 완료');
});