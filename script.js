/* ============================================================
   EduLearn – main.js
   Covers: dark mode, navbar scroll, hamburger, course filter,
   tab switching, form validation, quiz, progress tracker, blog
   ============================================================ */

// ── DOM Ready ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // ── Dark / Light Mode ──────────────────────────────────
  const toggle = document.getElementById('darkToggle');
  const body = document.body;

  // Persist preference
  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark');
    if (toggle) toggle.textContent = '☀️';
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      body.classList.toggle('dark');
      const isDark = body.classList.contains('dark');
      toggle.textContent = isDark ? '☀️' : '🌙';
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  // ── Navbar Scroll Effect ───────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  // ── Hamburger Menu ─────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // ── Course Filter (courses.html) ───────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('.course-card-big');

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;

        courseCards.forEach(card => {
          const show = f === 'all' || card.dataset.category === f;
          card.classList.toggle('hidden', !show);
          if (show) {
            card.style.animation = 'none';
            card.offsetHeight; // reflow
            card.style.animation = 'fadeUp 0.4s ease both';
          }
        });
      });
    });
  }

  // ── Tab Switching (interactive.html) ──────────────────
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  if (tabBtns.length) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        const target = document.getElementById('tab-' + btn.dataset.tab);
        if (target) target.classList.add('active');
      });
    });
  }

  // ── Auth Toggle (interactive.html) ────────────────────
  const showLogin = document.getElementById('showLogin');
  const showSignup = document.getElementById('showSignup');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  if (showLogin && showSignup) {
    showLogin.addEventListener('click', () => {
      loginForm.classList.remove('hidden');
      signupForm.classList.add('hidden');
      showLogin.classList.add('active');
      showSignup.classList.remove('active');
    });
    showSignup.addEventListener('click', () => {
      signupForm.classList.remove('hidden');
      loginForm.classList.add('hidden');
      showSignup.classList.add('active');
      showLogin.classList.remove('active');
    });
  }

  // ── Helpers ────────────────────────────────────────────
  function showErr(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
  }
  function clearErr(id) {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  }
  function markError(inputId, errId, msg) {
    const input = document.getElementById(inputId);
    if (input) input.classList.add('error');
    showErr(errId, msg);
  }
  function clearInput(inputId, errId) {
    const input = document.getElementById(inputId);
    if (input) input.classList.remove('error');
    clearErr(errId);
  }
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  // ── Login Form Validation ──────────────────────────────
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      clearInput('loginEmail', 'loginEmailErr');
      clearInput('loginPass', 'loginPassErr');

      const email = document.getElementById('loginEmail').value.trim();
      const pass = document.getElementById('loginPass').value;

      if (!email) { markError('loginEmail','loginEmailErr','Email is required.'); valid = false; }
      else if (!isEmail(email)) { markError('loginEmail','loginEmailErr','Enter a valid email.'); valid = false; }

      if (!pass) { markError('loginPass','loginPassErr','Password is required.'); valid = false; }
      else if (pass.length < 6) { markError('loginPass','loginPassErr','Password must be at least 6 characters.'); valid = false; }

      if (valid) {
        const s = document.getElementById('loginSuccess');
        s.textContent = '✅ Login successful! Redirecting...';
        setTimeout(() => s.textContent = '', 3000);
        loginForm.reset();
      }
    });
    // Live clear
    ['loginEmail','loginPass'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', () => clearInput(id, id + 'Err'));
    });
  }

  // ── Signup Form Validation ─────────────────────────────
  if (signupForm) {
    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      ['signupName','signupEmail','signupPass','signupConfirm'].forEach(id => {
        clearInput(id, id + 'Err');
      });

      const name = document.getElementById('signupName').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const pass = document.getElementById('signupPass').value;
      const confirm = document.getElementById('signupConfirm').value;

      if (!name || name.length < 2) { markError('signupName','signupNameErr','Enter your full name.'); valid = false; }
      if (!email || !isEmail(email)) { markError('signupEmail','signupEmailErr','Enter a valid email.'); valid = false; }
      if (!pass || pass.length < 8) { markError('signupPass','signupPassErr','Password must be at least 8 characters.'); valid = false; }
      if (pass !== confirm) { markError('signupConfirm','signupConfirmErr','Passwords do not match.'); valid = false; }

      if (valid) {
  const users = JSON.parse(localStorage.getItem('edulearn_users') || '[]');
  users.push({ name, email, time: new Date().toLocaleString() });
  localStorage.setItem('edulearn_users', JSON.stringify(users));

  let table = '<br><strong>📋 Registered Users:</strong><br><br>';
  users.forEach((u, i) => {
    table += `<div style="border:1px solid #f97316;padding:0.75rem;border-radius:8px;margin-bottom:0.5rem;font-size:0.85rem;text-align:left">
      <strong>#${i+1}</strong> &nbsp;|&nbsp;
      👤 <strong>${u.name}</strong> &nbsp;|&nbsp;
      📧 ${u.email} &nbsp;|&nbsp;
      🕐 ${u.time}
    </div>`;
  });

  const s = document.getElementById('signupSuccess');
  s.innerHTML = '🎉 Account created! Welcome to EduLearn!' + table;
  signupForm.reset();
}
    });
    ['signupName','signupEmail','signupPass','signupConfirm'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', () => clearInput(id, id + 'Err'));
    });
  }

  // ── Contact Form Validation ────────────────────────────
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      ['cName','cEmail','cSubject','cMessage'].forEach(id => clearInput(id, id + 'Err'));

      const name = document.getElementById('cName').value.trim();
      const email = document.getElementById('cEmail').value.trim();
      const subject = document.getElementById('cSubject').value;
      const message = document.getElementById('cMessage').value.trim();

      if (!name || name.length < 2) { markError('cName','cNameErr','Please enter your name.'); valid = false; }
      if (!email || !isEmail(email)) { markError('cEmail','cEmailErr','Enter a valid email address.'); valid = false; }
      if (!subject) { markError('cSubject','cSubjectErr','Please select a topic.'); valid = false; }
      if (!message || message.length < 10) { markError('cMessage','cMessageErr','Message must be at least 10 characters.'); valid = false; }

      if (valid) {
        const s = document.getElementById('contactSuccess');
        s.textContent = '✅ Message sent! We\'ll get back to you within 24 hours.';
        setTimeout(() => s.textContent = '', 4000);
        contactForm.reset();
      }
    });
  }

  // ── Quiz (interactive.html) ────────────────────────────
  const questions = [
    {
      q: "Which language is most commonly used for Machine Learning?",
      options: ["Java", "Python", "C++", "Ruby"],
      answer: 1
    },
    {
      q: "What does HTML stand for?",
      options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Method Language", "Home Tool Markup Language"],
      answer: 0
    },
    {
      q: "What is a 'wireframe' in UI/UX design?",
      options: ["A finished product design", "A basic structural layout of a page", "A colour palette", "A type of animation"],
      answer: 1
    },
    {
      q: "Which of these is NOT a JavaScript framework?",
      options: ["React", "Vue", "Django", "Angular"],
      answer: 2
    },
    {
      q: "What does CSS stand for?",
      options: ["Computer Style Sheets", "Creative Style System", "Cascading Style Sheets", "Coded Styling Standard"],
      answer: 2
    }
  ];

  let current = 0, score = 0, answered = false;

  const quizQuestion = document.getElementById('quizQuestion');
  const quizOptions = document.getElementById('quizOptions');
  const nextBtn = document.getElementById('nextBtn');
  const quizProgress = document.getElementById('quizProgress');
  const quizFill = document.getElementById('quizFill');
  const quizContainer = document.getElementById('quizContainer');
  const quizResult = document.getElementById('quizResult');
  const retryBtn = document.getElementById('retryBtn');

  function loadQuestion() {
    if (!quizQuestion) return;
    answered = false;
    if (nextBtn) nextBtn.disabled = true;
    const q = questions[current];
    quizQuestion.textContent = q.q;
    quizOptions.innerHTML = '';
    if (quizProgress) quizProgress.textContent = `Question ${current + 1} of ${questions.length}`;
    if (quizFill) quizFill.style.width = ((current + 1) / questions.length * 100) + '%';

    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = opt;
      btn.addEventListener('click', () => selectOption(btn, i));
      quizOptions.appendChild(btn);
    });
  }

  function selectOption(btn, index) {
    if (answered) return;
    answered = true;
    const correct = questions[current].answer;
    const allBtns = quizOptions.querySelectorAll('.quiz-option');
    allBtns.forEach(b => b.disabled = true);

    if (index === correct) {
      btn.classList.add('correct');
      score++;
    } else {
      btn.classList.add('wrong');
      allBtns[correct].classList.add('correct');
    }
    if (nextBtn) nextBtn.disabled = false;
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      current++;
      if (current < questions.length) {
        loadQuestion();
      } else {
        showQuizResult();
      }
    });
  }

  function showQuizResult() {
    if (!quizContainer || !quizResult) return;
    quizContainer.style.display = 'none';
    quizResult.classList.remove('hidden');
    const pct = Math.round(score / questions.length * 100);
    document.getElementById('quizEmoji').textContent = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚';
    document.getElementById('quizScore').textContent = `You scored ${score} / ${questions.length} (${pct}%)`;
    document.getElementById('quizMsg').textContent = pct >= 80
      ? 'Excellent! You\'re ready for advanced courses!'
      : pct >= 60
      ? 'Good job! A little more practice and you\'ll ace it.'
      : 'Keep learning! Review the basics and try again.';
  }

  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      current = 0; score = 0;
      if (quizContainer) quizContainer.style.display = 'block';
      if (quizResult) quizResult.classList.add('hidden');
      loadQuestion();
    });
  }

  if (quizQuestion) loadQuestion();

  // ── Progress Tracker ───────────────────────────────────
  const progressRange = document.getElementById('progressRange');
  const rangeVal = document.getElementById('rangeVal');
  const trackerSelect = document.getElementById('trackerSelect');
  const updateProgressBtn = document.getElementById('updateProgress');

  if (progressRange && rangeVal) {
    progressRange.addEventListener('input', () => {
      rangeVal.textContent = progressRange.value;
    });
  }

  if (updateProgressBtn) {
    updateProgressBtn.addEventListener('click', () => {
      const idx = trackerSelect.value;
      const val = progressRange.value;
      const fill = document.getElementById('fill' + idx);
      const pct = document.getElementById('pct' + idx);
      if (fill) fill.style.width = val + '%';
      if (pct) pct.textContent = val + '%';
    });
  }

  // ── Blog Search ────────────────────────────────────────
  const blogSearch = document.getElementById('blogSearch');
  const blogSearchBtn = document.getElementById('blogSearchBtn');
  const blogCards = document.querySelectorAll('.blog-card');

  function doSearch() {
    if (!blogSearch) return;
    const query = blogSearch.value.trim().toLowerCase();
    blogCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.classList.toggle('search-hidden', query.length > 0 && !text.includes(query));
    });
  }

  if (blogSearchBtn) blogSearchBtn.addEventListener('click', doSearch);
  if (blogSearch) {
    blogSearch.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
    blogSearch.addEventListener('input', () => { if (!blogSearch.value.trim()) doSearch(); });
  }

  // ── Load More Blog ─────────────────────────────────────
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      loadMoreBtn.textContent = '✅ All articles loaded!';
      loadMoreBtn.disabled = true;
    });
  }

  // ── Scroll Fade-In Observer ────────────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(
    '.feature-card, .course-card, .course-card-big, .team-card, .tl-item, .blog-card, .tracker-item'
  ).forEach(el => observer.observe(el));

});

// ── Blog: Toggle Read More ─────────────────────────────────
function togglePost(btn) {
  const body = btn.closest('.blog-body');
  const full = body.querySelector('.blog-full');
  if (!full) return;
  full.classList.toggle('hidden');
  btn.textContent = full.classList.contains('hidden') ? 'Read More ↓' : 'Show Less ↑';
}
