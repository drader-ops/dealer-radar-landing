/* =====================================================
   딜러 레이더 - Main JavaScript
   ===================================================== */

'use strict';

// ─── 1. NAVBAR SCROLL EFFECT ───────────────────────
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Hamburger toggle
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Mobile nav links close menu
document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});


// ─── 2. HERO PARTICLES ─────────────────────────────
function createParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const count = window.innerWidth < 600 ? 12 : 24;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * 30}%;
      animation-duration: ${Math.random() * 8 + 6}s;
      animation-delay: ${Math.random() * 6}s;
      opacity: 0;
    `;
    container.appendChild(p);
  }
}
createParticles();


// ─── 3. WAVEFORM BARS ──────────────────────────────
function generateWaveform() {
  const waveform = document.getElementById('waveform');
  if (!waveform) return;

  const barCount = 52;
  const heights = [
    20, 35, 48, 30, 55, 42, 28, 60, 45, 32,
    52, 38, 25, 50, 44, 36, 58, 40, 28, 62,
    46, 33, 55, 41, 29, 48, 38, 52, 44, 30,
    56, 43, 27, 50, 37, 60, 42, 31, 54, 40,
    26, 48, 36, 58, 44, 32, 52, 38, 24, 46, 34, 50
  ];

  waveform.innerHTML = '';
  heights.forEach((h, i) => {
    const bar = document.createElement('div');
    bar.className = 'wave-bar';
    bar.style.height = `${h}%`;
    bar.dataset.index = i;
    waveform.appendChild(bar);
  });
}
generateWaveform();


// ─── 4. DEMO PLAYER ────────────────────────────────
const DEMO_SCRIPT = [
  {
    delay: 600,
    speaker: 'dealer',
    text: '안녕하세요, 저번에 문의주신 그랜저 건데요, 좋은 매물 들어왔어요.',
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
    text: '네, 21년식 그랜저 IG 흰색 풀옵션 있습니다. 2,950만 원이에요.',
  },
  {
    delay: 5600,
    speaker: 'customer',
    text: '음... 3천이 좀 넘는 건 부담스러워서요. 3천 안으로는 안 되나요?',
    signal: { type: 'budget', label: '💰 예산 한계 감지: 3,000만 원 이하' },
  },
  {
    delay: 7400,
    speaker: 'dealer',
    text: '아, 그렇군요. 이 차 상태가 정말 좋아서요. 혹시 색상은 흰색이 꼭 필요하신가요?',
  },
  {
    delay: 9200,
    speaker: 'customer',
    text: '흰색이면 제일 좋긴 한데... 다른 색도 괜찮긴 해요.',
    signal: { type: 'preference', label: '🎨 선호 옵션: 흰색 (협상 가능)' },
  },
  {
    delay: 11000,
    speaker: 'dealer',
    text: '그럼 비슷한 조건의 은색 21년식이 2,870만 원에 있거든요. 어떠세요?',
  },
  {
    delay: 13000,
    speaker: 'customer',
    text: '음, 그렇군요. 아내랑 한 번 상의해 봐야 할 것 같아요.',
    signal: { type: 'hesitation', label: '⚠️ 주의: 가족 협의 요청 = 재접촉 필요' },
  },
  {
    delay: 15000,
    speaker: 'dealer',
    text: '물론이죠! 언제쯤 연락 드릴까요?',
  },
  {
    delay: 16800,
    speaker: 'customer',
    text: '내일 저녁쯤이면 좋을 것 같아요.',
    signal: { type: 'preference', label: '📅 재접촉 타이밍: 내일 저녁' },
  },
];

const COACHING_TEXT = `<strong>📌 AI 코칭 제안</strong><br><br>
이 고객은 <strong>예산 3,000만 원 이하</strong>를 원하며, 흰색 선호이나 협상 여지가 있습니다.<br><br>
→ <strong>내일 저녁</strong> 재연락 시: <em>"2,870만 원 은색 차량에 블랙박스 설치 무료 제공 가능"</em> 으로 접근하세요.<br><br>
→ 아내의 반응이 관건이므로 <strong>패밀리 친화적인 멘트</strong>로 마무리하세요.`;

const SCORE_DATA = [
  { label: '경청 스킬', value: 78 },
  { label: '니즈 파악', value: 85 },
  { label: '가격 협상', value: 62 },
  { label: '클로징', value: 54 },
];

let isPlaying = false;
let playTimeout = null;
let currentProgress = 0;
let progressInterval = null;
let demoPhase = 'idle'; // idle | playing | done
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
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function updateWaveActive(progress) {
  const bars = document.querySelectorAll('.wave-bar');
  const activePct = progress / 100;
  bars.forEach((bar, i) => {
    const barPct = i / bars.length;
    bar.classList.remove('active', 'played');
    if (barPct < activePct - 0.02) {
      bar.classList.add('played');
    } else if (barPct < activePct + 0.04) {
      bar.classList.add('active');
    }
  });
}

function setStatus(state) {
  statusDot.className = 'status-dot ' + state;
  const labels = { idle: '분석 대기 중', analyzing: 'AI 분석 중...', done: '분석 완료' };
  statusText.textContent = labels[state] || '';
  if (state === 'analyzing') {
    analysisLoader.style.display = 'flex';
  } else {
    analysisLoader.style.display = 'none';
  }
}

function addTranscriptLine(speaker, text, delay) {
  return new Promise(resolve => {
    setTimeout(() => {
      // Remove placeholder if first item
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

      // Typing effect
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
    coachingSection.style.display = 'block';
    coachingCard.innerHTML = '';
    const fullText = COACHING_TEXT;
    coachingCard.innerHTML = fullText;
    coachingCard.style.animation = 'fadeInUp 0.5s ease both';
  }, delay);
}

function showScores(delay) {
  setTimeout(() => {
    scoreSection.style.display = 'block';
    scoreBars.innerHTML = '';
    SCORE_DATA.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = 'score-item';
      el.style.animationDelay = `${idx * 0.1}s`;
      el.innerHTML = `
        <span class="score-label">${item.label}</span>
        <div class="score-bar-wrap">
          <div class="score-bar-fill" data-val="${item.value}"></div>
        </div>
        <span class="score-val">${item.value}</span>
      `;
      scoreBars.appendChild(el);
    });

    // Animate bars
    setTimeout(() => {
      document.querySelectorAll('.score-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.val + '%';
      });
    }, 100);
  }, delay);
}

function resetDemo() {
  clearTimeout(playTimeout);
  clearInterval(progressInterval);
  currentProgress = 0;
  transcriptItemCount = 0;
  demoPhase = 'idle';
  isPlaying = false;

  playIcon.className = 'fa-solid fa-play';
  progressFill.style.width = '0%';
  progressThumb.style.left = '0%';
  currentTimeEl.textContent = '0:00';
  setStatus('idle');

  transcriptBox.innerHTML = `
    <div class="transcript-placeholder">
      <i class="fa-regular fa-circle-play"></i>
      <p>재생 버튼을 눌러 AI 분석을 시작하세요</p>
    </div>
  `;
  signalsSection.style.display = 'none';
  signalTags.innerHTML = '';
  coachingSection.style.display = 'none';
  coachingCard.innerHTML = '';
  scoreSection.style.display = 'none';
  scoreBars.innerHTML = '';

  updateWaveActive(0);
}

function startDemo() {
  isPlaying = true;
  demoPhase = 'playing';
  playIcon.className = 'fa-solid fa-pause';
  setStatus('analyzing');

  const totalSeconds = 272; // 4:32
  const totalDuration = 18000; // ms simulation

  // Progress bar animation
  const startTime = Date.now();
  progressInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const pct = Math.min((elapsed / totalDuration) * 100, 100);
    currentProgress = pct;
    progressFill.style.width = pct + '%';
    progressThumb.style.left = pct + '%';
    currentTimeEl.textContent = formatTime((pct / 100) * totalSeconds);
    updateWaveActive(pct);

    if (pct >= 100) {
      clearInterval(progressInterval);
      demoPhase = 'done';
      isPlaying = false;
      playIcon.className = 'fa-solid fa-rotate-right';
      setStatus('done');
    }
  }, 80);

  // Transcript + signal timing
  let cumulativeDelay = 0;

  DEMO_SCRIPT.forEach((item) => {
    const lineDelay = item.delay;
    addTranscriptLine(item.speaker, item.text, lineDelay);

    if (item.signal) {
      addSignalTag(item.signal, lineDelay + 600);
    }
  });

  // Coaching & score appear after most dialog
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
      // pause
      isPlaying = false;
      clearInterval(progressInterval);
      playIcon.className = 'fa-solid fa-play';
      setStatus('idle');
    } else {
      // resume (simplified: just show message)
      showToast('실제 서비스에서는 일시정지/재개가 지원됩니다.', 2200);
    }
  });
}

// Reset button
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

  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger within same parent
    const siblings = el.parentElement.querySelectorAll('.reveal');
    const idx = Array.from(siblings).indexOf(el);
    if (idx > 0) {
      el.classList.add(`reveal-delay-${Math.min(idx, 4)}`);
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

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

const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !statsAnimated) {
    statsAnimated = true;
    document.querySelectorAll('.stat-number').forEach(el => {
      const target = parseInt(el.dataset.target);
      animateCounter(el, target);
    });
  }
}, { threshold: 0.3 });

if (statsSection) statsObserver.observe(statsSection);


// ─── 7. CTA FORM ───────────────────────────────────
const ctaForm = document.getElementById('ctaForm');
if (ctaForm) {
  ctaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('ctaName').value.trim();
    const phone = document.getElementById('ctaPhone').value.trim();
    const region = document.getElementById('ctaRegion').value.trim();

    if (!name || !phone) {
      showToast('이름과 연락처를 입력해 주세요.', 2200, 'error');
      return;
    }

    // Simulate form submission
    const btn = ctaForm.querySelector('.btn-cta-submit');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 신청 중...';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-check"></i> 신청 완료!';
      btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
      showToast(`${name}님, 베타 신청이 완료되었습니다! 곧 연락드릴게요 🎉`, 3500);
      ctaForm.reset();
      setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-rocket"></i> 지금 무료로 시작하기';
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1500);
  });
}


// ─── 8. TOAST NOTIFICATION ─────────────────────────
function showToast(msg, duration = 2500, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  const icon = toast.querySelector('i');

  toastMsg.textContent = msg;
  if (type === 'error') {
    icon.className = 'fa-solid fa-circle-exclamation';
    toast.style.borderColor = 'rgba(239,68,68,0.35)';
    icon.style.color = 'var(--danger)';
    toast.style.color = 'var(--danger)';
  } else {
    icon.className = 'fa-solid fa-circle-check';
    toast.style.borderColor = 'rgba(16,185,129,0.35)';
    icon.style.color = 'var(--success)';
    toast.style.color = 'var(--success)';
  }

  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}


// ─── 9. EDIT MODE ──────────────────────────────────
const editToggleBtn = document.getElementById('editToggleBtn');
const editToolbarInfo = document.getElementById('editToolbarInfo');
const editSaveBtn = document.getElementById('editSaveBtn');
let editMode = false;
let savedEdits = {};

// Load saved edits from localStorage
function loadSavedEdits() {
  try {
    const stored = localStorage.getItem('dealer-radar-edits');
    if (stored) {
      savedEdits = JSON.parse(stored);
      Object.entries(savedEdits).forEach(([key, val]) => {
        const el = document.querySelector(`[data-editable="${key}"]`);
        if (el) el.innerHTML = val;
      });
    }
  } catch(e) {}
}

loadSavedEdits();

if (editToggleBtn) {
  editToggleBtn.addEventListener('click', () => {
    editMode = !editMode;
    document.body.classList.toggle('edit-mode', editMode);
    editToggleBtn.classList.toggle('active', editMode);
    editToolbarInfo.style.display = editMode ? 'flex' : 'none';

    const editables = document.querySelectorAll('.editable');
    editables.forEach(el => {
      if (editMode) {
        el.contentEditable = 'true';
        el.spellcheck = false;
      } else {
        el.contentEditable = 'false';
      }
    });

    if (editMode) {
      showToast('편집 모드 활성화 · 파란 테두리 텍스트를 직접 수정하세요!', 3000);
    }
  });
}

if (editSaveBtn) {
  editSaveBtn.addEventListener('click', () => {
    // Save all editable content
    document.querySelectorAll('.editable').forEach(el => {
      const key = el.dataset.editable;
      if (key) savedEdits[key] = el.innerHTML;
    });

    try {
      localStorage.setItem('dealer-radar-edits', JSON.stringify(savedEdits));
      showToast('변경 사항이 저장되었습니다! ✅', 2500);
    } catch(e) {
      showToast('저장 중 오류가 발생했습니다.', 2000, 'error');
    }
  });
}


// ─── 10. SMOOTH SCROLL ─────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = navbar.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


// ─── 11. ACTIVE NAV HIGHLIGHT ──────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  const scrollY = window.scrollY + navbar.offsetHeight + 60;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(l => l.style.color = '');
        link.style.color = 'var(--primary-light)';
      }
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });


// ─── 12. INIT ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 딜러 레이더 랜딩페이지 로드 완료');
});
