/**
 * SANCHITA MALAKAR - MODERN 3D & HR-FRIENDLY PORTFOLIO
 * Main JavaScript: Three.js Scene, 3D Tilt, Recruiter Modal, & Interactive Features
 */

// ==========================================================================
// 1. THREE.JS INTERACTIVE 3D BACKGROUND
// ==========================================================================
(function initThreeBackground() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x06080d, 0.0018);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 400;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particle System (Constellation Field)
  const particleCount = 1400;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorOptions = [
    new THREE.Color(0x6366f1), // Indigo
    new THREE.Color(0x06b6d4), // Cyan
    new THREE.Color(0xa855f7), // Purple
    new THREE.Color(0xffffff)  // White
  ];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 1600;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 1600;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 1600;

    const chosenColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    colors[i * 3] = chosenColor.r;
    colors[i * 3 + 1] = chosenColor.g;
    colors[i * 3 + 2] = chosenColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Custom Particle Canvas Texture
  const createParticleTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(200,230,255,0.8)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, Math.PI * 2);
    ctx.fill();
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  };

  const particleMaterial = new THREE.PointsMaterial({
    size: 5.5,
    vertexColors: true,
    map: createParticleTexture(),
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleSystem = new THREE.Points(geometry, particleMaterial);
  scene.add(particleSystem);

  // Floating 3D Geometric Tech Polyhedrons
  const meshGroup = new THREE.Group();

  // 1. Icosahedron Wireframe
  const icoGeo = new THREE.IcosahedronGeometry(70, 1);
  const icoMat = new THREE.MeshBasicMaterial({
    color: 0x6366f1,
    wireframe: true,
    transparent: true,
    opacity: 0.22
  });
  const icoMesh = new THREE.Mesh(icoGeo, icoMat);
  icoMesh.position.set(280, 80, -80);
  meshGroup.add(icoMesh);

  // 2. Torus Knot
  const torusGeo = new THREE.TorusKnotGeometry(45, 12, 64, 16);
  const torusMat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    wireframe: true,
    transparent: true,
    opacity: 0.18
  });
  const torusMesh = new THREE.Mesh(torusGeo, torusMat);
  torusMesh.position.set(-320, -120, -150);
  meshGroup.add(torusMesh);

  // 3. Octahedron
  const octaGeo = new THREE.OctahedronGeometry(55, 0);
  const octaMat = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    wireframe: true,
    transparent: true,
    opacity: 0.2
  });
  const octaMesh = new THREE.Mesh(octaGeo, octaMat);
  octaMesh.position.set(320, -180, -120);
  meshGroup.add(octaMesh);

  scene.add(meshGroup);

  // Mouse Parallax Effect
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.3;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.3;
  });

  // Animation Loop
  let clock = new THREE.Clock();
  const animate = () => {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth camera inertia
    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;

    camera.position.x = targetX * 0.35;
    camera.position.y = -targetY * 0.35;
    camera.lookAt(scene.position);

    // Slowly rotate particle system
    particleSystem.rotation.y = elapsedTime * 0.035;
    particleSystem.rotation.x = elapsedTime * 0.015;

    // Rotate meshes
    icoMesh.rotation.x = elapsedTime * 0.2;
    icoMesh.rotation.y = elapsedTime * 0.25;

    torusMesh.rotation.x = elapsedTime * 0.15;
    torusMesh.rotation.y = elapsedTime * 0.2;

    octaMesh.rotation.y = elapsedTime * 0.25;
    octaMesh.rotation.z = elapsedTime * 0.18;

    renderer.render(scene, camera);
  };

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
})();

// ==========================================================================
// 2. 3D CARD TILT & PARALLAX EFFECT (Hero Profile Card & Project Cards)
// ==========================================================================
(function initTiltEffects() {
  const heroCard = document.getElementById('profile-card-3d');
  const floatTags = document.querySelectorAll('.float-tag');

  if (heroCard) {
    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateX = -(y / (rect.height / 2)) * 12;
      const rotateY = (x / (rect.width / 2)) * 12;

      heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      // Parallax for floating pills
      floatTags.forEach((tag) => {
        const speed = parseFloat(tag.getAttribute('data-speed') || '1.5');
        tag.style.transform = `translate3d(${x * 0.05 * speed}px, ${y * 0.05 * speed}px, 35px)`;
      });
    });

    heroCard.addEventListener('mouseleave', () => {
      heroCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
      floatTags.forEach((tag) => {
        tag.style.transform = `translate3d(0, 0, 0)`;
      });
    });
  }

  // Tilt on Project Cards
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateX = -(y / (rect.height / 2)) * 6;
      const rotateY = (x / (rect.width / 2)) * 6;

      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0)`;
    });
  });
})();

// ==========================================================================
// 3. TOAST NOTIFICATIONS & ONE-CLICK COPY
// ==========================================================================
function showToast(message, iconClass = 'fa-solid fa-check') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="${iconClass} text-cyan"></i> <span>${message}</span>`;
  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);

  // Remove toast
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// Copy triggers
document.querySelectorAll('.copy-trigger').forEach((trigger) => {
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    const textToCopy = trigger.getAttribute('data-copy');
    if (!textToCopy) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied: ${textToCopy}`);
      }).catch(() => {
        fallbackCopy(textToCopy);
      });
    } else {
      fallbackCopy(textToCopy);
    }
  });
});

function fallbackCopy(text) {
  const input = document.createElement('input');
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
  showToast(`Copied: ${text}`);
}

// ==========================================================================
// 4. RECRUITER FAST-TRACK MODAL
// ==========================================================================
(function initRecruiterModal() {
  const modal = document.getElementById('recruiter-modal');
  const openButtons = [
    document.getElementById('open-recruiter-modal-btn'),
    document.getElementById('hero-recruiter-btn'),
    document.getElementById('dock-recruiter-btn'),
    document.getElementById('mobile-recruiter-btn')
  ];
  const closeBtn = document.getElementById('close-recruiter-modal');
  const printBtn = document.getElementById('modal-print-resume');
  const contactForwardBtn = document.getElementById('recruiter-contact-forward');

  const openModal = () => {
    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  openButtons.forEach((btn) => {
    if (btn) btn.addEventListener('click', openModal);
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  if (contactForwardBtn) {
    contactForwardBtn.addEventListener('click', () => {
      closeModal();
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          const nameInput = document.getElementById('contact-name');
          if (nameInput) nameInput.focus();
        }, 600);
      }
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
})();

// ==========================================================================
// 5. RESUME ACTIONS (Download / Print)
// ==========================================================================
const resumeButtons = [
  document.getElementById('btn-resume-download'),
  document.getElementById('hero-resume-btn'),
  document.getElementById('dock-resume-btn'),
  document.getElementById('mobile-resume-btn')
];

resumeButtons.forEach((btn) => {
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Opening ATS-formatted printable resume...', 'fa-solid fa-print');
      setTimeout(() => {
        window.print();
      }, 350);
    });
  }
});

// ==========================================================================
// 6. SKILLS MATRIX FILTERING
// ==========================================================================
(function initSkillsFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
})();

// ==========================================================================
// 7. PROJECT DEEP-DIVE MODAL & SPECS
// ==========================================================================
(function initProjectModal() {
  const projectModal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('close-project-modal');
  const modalTitle = document.getElementById('proj-modal-title');
  const modalSubtitle = document.getElementById('proj-modal-subtitle');
  const modalBody = document.getElementById('project-modal-body');

  const projectData = {
    empiq: {
      title: 'EmpIQ — AI-Powered HR Analytics & Workforce Intelligence',
      subtitle: 'Multi-Class Performance Prediction & Explainable AI (SHAP)',
      html: `
        <div class="project-modal-detail">
          <div class="modal-section-block">
            <h4><i class="fa-solid fa-diagram-project text-purple"></i> Architecture & Engineering Breakdown</h4>
            <p>EmpIQ is designed for strategic human capital management. It transforms raw workforce logs into proactive, explainable actions that mitigate flight risk and optimize compensation allocations.</p>
          </div>

          <div class="modal-spec-grid">
            <div class="spec-card">
              <span class="spec-label">Model Architecture</span>
              <span class="spec-value">Random Forest & XGBoost Multi-Class Classifier (High, Medium, Low tiers)</span>
            </div>
            <div class="spec-card">
              <span class="spec-label">Evaluation Metrics</span>
              <span class="spec-value">Stratified K-Fold CV, Macro/Weighted F1, ROC-AUC, and Confusion Matrix</span>
            </div>
            <div class="spec-card">
              <span class="spec-label">Explainable AI</span>
              <span class="spec-value">SHAP TreeExplainer (Feature Importance & Individual Prediction Attribution)</span>
            </div>
            <div class="spec-card">
              <span class="spec-label">UI / Dashboard Code</span>
              <span class="spec-value">1,000+ Lines of Streamlit, Plotly Radar & Heatmaps, CSV Export</span>
            </div>
          </div>

          <div class="modal-section-block">
            <h4><i class="fa-solid fa-microchip text-cyan"></i> Domain-Specific Feature Engineering</h4>
            <ul class="modal-list">
              <li><code>engagement_score</code>: Composite weighted index measuring survey feedback, activity velocity, and peer collaboration.</li>
              <li><code>salary_per_exp</code>: Normalized ratio measuring salary fairness relative to years in industry.</li>
              <li><code>career_momentum</code>: Ratio of promotions and skill advancements per unit tenure.</li>
              <li><code>overwork_flag</code>: Binary threshold detecting burn-out risks from logged project hours.</li>
              <li>Preprocessed via Scikit-learn Pipelines: Imputation, One-Hot Encoding, Pearson Correlation pruning, and StandardScaler normalization.</li>
            </ul>
          </div>

          <div class="modal-section-block">
            <h4><i class="fa-solid fa-briefcase text-yellow"></i> Actionable HR Workflows Enabled</h4>
            <p>EmpIQ bridges the gap between data science and HR operations with four automated decision modules:</p>
            <ol class="modal-ordered-list">
              <li><strong>Retention & Flight Risk:</strong> Flags critical team members at risk of leaving before attrition occurs.</li>
              <li><strong>Merit & Promotion Prioritization:</strong> Objective, bias-minimized ranking for quarterly cycles.</li>
              <li><strong>Compensation Benchmarking:</strong> Detects pay gaps and suggests targeted adjustments.</li>
              <li><strong>Upskilling Matcher:</strong> Recommends technical training programs based on model weakness indicators.</li>
            </ol>
          </div>
        </div>
      `
    },
    'bssvm-portal': {
      title: 'BSSVM Web Portal & Digital Admissions Platform',
      subtitle: 'Production Institutional Platform Deployed on Hostinger',
      html: `
        <div class="project-modal-detail">
          <div class="modal-section-block">
            <h4><i class="fa-solid fa-layer-group text-cyan"></i> Full-Stack System Architecture</h4>
            <p>Architected and launched a production institutional web portal for a private institution, automating admissions, fee structures, and administrative governance with zero manual paperwork.</p>
          </div>

          <div class="modal-spec-grid">
            <div class="spec-card">
              <span class="spec-label">Frontend Stack</span>
              <span class="spec-value">Next.js 16 (App Router), React 19, TypeScript</span>
            </div>
            <div class="spec-card">
              <span class="spec-label">Backend & APIs</span>
              <span class="spec-value">Node.js, 28 RESTful Endpoints, OTP Authentication, 2FA</span>
            </div>
            <div class="spec-card">
              <span class="spec-label">Database & Storage</span>
              <span class="spec-value">17 PostgreSQL Tables, Row-Level Security (RLS), Supabase Storage</span>
            </div>
            <div class="spec-card">
              <span class="spec-label">Deployment</span>
              <span class="spec-value">Hostinger Production Server, CI/CD Pipeline, Bilingual Caching</span>
            </div>
          </div>

          <div class="modal-section-block">
            <h4><i class="fa-solid fa-shield-halved text-purple"></i> Security & Audit State Engine</h4>
            <ul class="modal-list">
              <li><strong>PostgreSQL Row-Level Security:</strong> Strict multi-tenant isolation separating public views, parent applications, and confidential records.</li>
              <li><strong>Automated Audit & Rollback:</strong> Database triggers track all mutations in a historical log, allowing administrators to inspect state diffs and roll back mistaken deletions.</li>
              <li><strong>Bilingual Localization:</strong> Full English and Bengali language localization with fast edge caching.</li>
              <li><strong>Automated Fee Engine:</strong> Dynamic computation of sibling discounts, class-specific fees, and payment reconciliation.</li>
            </ul>
          </div>
        </div>
      `
    },
    campuscore: {
      title: 'BSSVM CampusCore — School Operations & ERP Platform',
      subtitle: 'Managing 500+ Students, 35+ Staff, Biometric TCP-IP & WhatsApp Queues',
      html: `
        <div class="project-modal-detail">
          <div class="modal-section-block">
            <h4><i class="fa-solid fa-server text-emerald"></i> Enterprise Operations Architecture</h4>
            <p>CampusCore handles the entire operational life-cycle of the institution, uniting financial ledgers, biometric staff time tracking, and parent communication into a cohesive distributed platform.</p>
          </div>

          <div class="modal-spec-grid">
            <div class="spec-card">
              <span class="spec-label">Active User Scale</span>
              <span class="spec-value">500+ Enrolled Students & 35+ Faculty/Staff Members</span>
            </div>
            <div class="spec-card">
              <span class="spec-label">Relational Data Model</span>
              <span class="spec-value">24-Table PostgreSQL Schema with strict ACID and foreign-key indexing</span>
            </div>
            <div class="spec-card">
              <span class="spec-label">Asynchronous Queue</span>
              <span class="spec-value">Redis + BullMQ orchestrating 15,000+ monthly Meta WhatsApp alerts</span>
            </div>
            <div class="spec-card">
              <span class="spec-label">Report Card Generation</span>
              <span class="spec-value">500+ personalized high-res PDFs compiled in &lt; 30 seconds</span>
            </div>
          </div>

          <div class="modal-section-block">
            <h4><i class="fa-solid fa-fingerprint text-yellow"></i> Biometric Hardware & Asynchronous Pipelines</h4>
            <ul class="modal-list">
              <li><strong>TCP-IP Biometric Integration:</strong> Custom Node.js microservice communicates directly with on-premise biometric fingerprint scanners, synchronizing punch logs real-time into database ledgers.</li>
              <li><strong>Automated Payroll & Leave:</strong> Live attendance logs calculate late arrivals, half-days, and salary deductions automatically.</li>
              <li><strong>Resilient Notification Workers:</strong> BullMQ queues dispatch fee reminders and attendance alerts to parents via Meta WhatsApp API with exponential backoff retries and rate limit protection.</li>
              <li><strong>Role-Based Access (RBAC):</strong> Granular permissions across 4 distinct user tiers: Super Admin, Finance Manager, Teacher, and Parent.</li>
            </ul>
          </div>
        </div>
      `
    }
  };

  document.querySelectorAll('.open-project-details').forEach((btn) => {
    btn.addEventListener('click', () => {
      const projKey = btn.getAttribute('data-project');
      const data = projectData[projKey];
      if (!data) return;

      modalTitle.innerText = data.title;
      modalSubtitle.innerText = data.subtitle;
      modalBody.innerHTML = data.html;

      projectModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeProjectModal = () => {
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeProjectModal);
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeProjectModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('active')) {
      closeProjectModal();
    }
  });
})();

// ==========================================================================
// 8. NAVBAR SCROLL SPY & MOBILE MENU
// ==========================================================================
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  const openMobileMenu = () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
  if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);

  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Active section spy
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
})();

// ==========================================================================
// 9. CONTACT FORM SUBMISSION
// ==========================================================================
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const role = document.getElementById('contact-role').value;
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all required fields.', 'fa-solid fa-triangle-exclamation');
      return;
    }

    const submitBtn = document.getElementById('contact-submit-btn');
    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Dispatching...`;
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Message Dispatched!`;
      submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      showToast(`Thank you ${name}! Your inquiry has been dispatched.`);

      // Also generate mailto link for direct fallback
      const mailtoSubject = encodeURIComponent(`[Portfolio Inquiry - ${role}] from ${name}`);
      const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nRole Type: ${role}\n\nMessage:\n${message}`);
      const mailtoUrl = `mailto:sanchitamalakar873@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

      setTimeout(() => {
        window.location.href = mailtoUrl;
        form.reset();
        submitBtn.innerHTML = originalContent;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 1200);
    }, 800);
  });
})();

// Additional styling injected for project modal spec items
const styleModalExtra = document.createElement('style');
styleModalExtra.innerHTML = `
  .project-modal-detail { display: flex; flex-direction: column; gap: 1.4rem; }
  .modal-section-block h4 { font-family: var(--font-heading); font-size: 1.1rem; color: #fff; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; }
  .modal-section-block p { font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6; }
  .modal-spec-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; }
  .spec-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: var(--radius-sm); padding: 0.8rem 1rem; }
  .spec-label { display: block; font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.2rem; }
  .spec-value { font-size: 0.88rem; font-weight: 600; color: #f8fafc; }
  .modal-list, .modal-ordered-list { margin-left: 1.2rem; display: flex; flex-direction: column; gap: 0.45rem; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; }
  .modal-list code { font-family: var(--font-mono); background: rgba(99,102,241,0.15); color: #a5b4fc; padding: 0.1rem 0.35rem; border-radius: 4px; }
  @media (max-width: 600px) { .modal-spec-grid { grid-template-columns: 1fr; } }
`;
document.head.appendChild(styleModalExtra);
console.log('Portfolio application initialized successfully.');
