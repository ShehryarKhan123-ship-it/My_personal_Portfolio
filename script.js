// 1. Particle Canvas Network Background
const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let mouse = { x: null, y: null, radius: 120 };

// Resize canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Track mouse position
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.radius = Math.random() * 2 + 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Boundary bounce
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

    // Mouse interaction (repel slightly)
    if (mouse.x !== null && mouse.y !== null) {
      let dx = this.x - mouse.x;
      let dy = this.y - mouse.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        let force = (mouse.radius - dist) / mouse.radius;
        this.x += (dx / dist) * force * 2;
        this.y += (dy / dist) * force * 2;
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(Math.floor((canvas.width * canvas.height) / 14000), 100);
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}
initParticles();
window.addEventListener('resize', initParticles);

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach(p => {
    p.update();
    p.draw();
  });

  // Draw connecting lines
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let dx = particles[i].x - particles[j].x;
      let dy = particles[i].y - particles[j].y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 110) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(16, 185, 129, ${0.12 * (1 - dist / 110)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animateParticles);
}
animateParticles();


// 2. Scroll Reveal Observer
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));


// 3. Project Card Hover Glow tracker
const cards = document.querySelectorAll('.proj-card');
cards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});


// 4. Before / After Image Comparison Slider
const slider = document.getElementById('oil-spill-slider');
if (slider) {
  const afterImgContainer = slider.querySelector('.slider-after');
  const handle = slider.querySelector('.slider-handle');
  let isDragging = false;

  function updateSlider(clientX) {
    const rect = slider.getBoundingClientRect();
    let x = clientX - rect.left;
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;

    const percentage = (x / rect.width) * 100;
    afterImgContainer.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
    handle.style.left = `${percentage}%`;
  }

  // Mouse Events
  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSlider(e.clientX);
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  });
  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch Events for Mobile
  slider.addEventListener('touchstart', (e) => {
    isDragging = true;
    updateSlider(e.touches[0].clientX);
  });
  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    updateSlider(e.touches[0].clientX);
  });
  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}


// 5. Interactive Pipeline Trace Dashboard
const stepsData = [
  {
    meta: "STAGE 01 — PREPARATION",
    title: "Multimodal Ingestion",
    desc: "Ingests heterogeneous unstructured data, including PDF documentation, engineering schematics, and imagery feeds. Data is processed, normalized, and mapped into high-dimensional vector spaces.",
    code: 'pipeline.ingest(src="documents/*", format="vector")',
    cx: 65,
    cy: 80,
    paths: ["path-0"]
  },
  {
    meta: "STAGE 02 — TUNING",
    title: "Model Alignment & LoRA Fine-Tuning",
    desc: "Fine-tunes Vision-Language Models (VLMs) and LLMs utilizing Low-Rank Adaptation (LoRA) and parameter-efficient adapters. Achieves massive domain-specific accuracy gains with low compute footprints.",
    code: 'trainer.tune(model="vlm-base", adapter="lora", r=16)',
    cx: 270,
    cy: 80,
    paths: ["path-0", "path-1"]
  },
  {
    meta: "STAGE 03 — ORCHESTRATION",
    title: "Agentic Loop & Graph Planning",
    desc: "Engages a multi-agent state graph using LangGraph to perform task planning, self-evaluation, and tool execution. Connects to database engines and APIs to resolve complex user objectives.",
    code: 'agent_graph.execute(task="design_spatial_joint", iterations=5)',
    cx: 490,
    cy: 80,
    paths: ["path-0", "path-1", "path-2"]
  },
  {
    meta: "STAGE 04 — DEPLOYMENT",
    title: "Quantized Edge Execution",
    desc: "Compiles model weights via ONNX or OpenVINO, deploying quantized networks (FP16/INT8) on local edge controllers and Kubernetes cloud instances with health probes.",
    code: 'deployment.release(target="edge-controller", quantization="int8")',
    cx: 695,
    cy: 80,
    paths: ["path-0", "path-1", "path-2"] // all active
  }
];

const nodeBoxes = document.querySelectorAll('.node-box');
const pulseParticle = document.getElementById('pulse-particle');
const stepMeta = document.getElementById('step-meta');
const stepTitle = document.getElementById('step-title');
const stepDesc = document.getElementById('step-desc');
const stepCodeEl = document.getElementById('step-code');
const stepCode = stepCodeEl ? stepCodeEl.querySelector('code') : null;
const statusText = document.getElementById('pipeline-status-text');

let activeStep = 0;
let autoCycleTimer = null;

function setStep(index) {
  if (!pulseParticle || !stepMeta || !stepTitle || !stepDesc || !stepCode) return;
  // Update node active states
  nodeBoxes.forEach((box, idx) => {
    if (idx === index) {
      box.classList.add('active');
    } else {
      box.classList.remove('active');
    }
  });

  // Move the particle
  const data = stepsData[index];
  pulseParticle.setAttribute('cx', data.cx);
  pulseParticle.setAttribute('cy', data.cy);

  // Update connecting paths
  document.querySelectorAll('.trace-path').forEach(path => {
    path.classList.remove('active');
  });
  data.paths.forEach(pId => {
    const pEl = document.getElementById(pId);
    if (pEl) pEl.classList.add('active');
  });

  // Update content text
  stepMeta.textContent = data.meta;
  stepTitle.textContent = data.title;
  stepDesc.textContent = data.desc;
  stepCode.textContent = data.code;

  activeStep = index;
}

if (nodeBoxes.length > 0 && pulseParticle && stepMeta && stepTitle && stepDesc && stepCode) {
  // Click listener on SVG nodes
  nodeBoxes.forEach((box) => {
    box.addEventListener('click', () => {
      clearInterval(autoCycleTimer); // Stop auto cycling on user click
      if (statusText) {
        statusText.textContent = 'MANUAL_OVERRIDE';
        statusText.parentElement.querySelector('span').style.background = 'var(--copper)';
        statusText.parentElement.querySelector('span').style.boxShadow = '0 0 8px var(--copper)';
      }
      const targetStep = parseInt(box.getAttribute('data-step'));
      setStep(targetStep);
    });
  });

  // Auto rotation cycle
  function startAutoCycle() {
    autoCycleTimer = setInterval(() => {
      let nextStep = (activeStep + 1) % stepsData.length;
      setStep(nextStep);
    }, 5000);
  }
  startAutoCycle();
}


// 6. Recruiter Terminal Controller
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const shortcutBtns = document.querySelectorAll('.cmd-btn');

let matrixInterval = null;

function startMatrixRain() {
  const mCanvas = document.getElementById('matrix-canvas');
  if (!mCanvas) return;
  mCanvas.style.display = 'block';
  const mCtx = mCanvas.getContext('2d');
  
  // Set canvas size based on terminal body dimensions
  const parent = mCanvas.parentElement;
  mCanvas.width = parent.clientWidth;
  mCanvas.height = parent.clientHeight;
  
  const characters = "010101010101ABCDEFGHIJKLMNOPQRSTUVWXYZｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ".split("");
  const fontSize = 11;
  const columns = mCanvas.width / fontSize;
  const rainDrops = [];
  
  for (let x = 0; x < columns; x++) {
    rainDrops[x] = 1;
  }
  
  function draw() {
    mCtx.fillStyle = 'rgba(9, 14, 11, 0.08)'; // trail fading
    mCtx.fillRect(0, 0, mCanvas.width, mCanvas.height);
    
    // Get text color based on currently set --term-color or default green
    const wrapper = document.querySelector('.terminal-wrapper');
    const termColor = wrapper ? getComputedStyle(wrapper).getPropertyValue('--term-color').trim() : '#34d399';
    mCtx.fillStyle = termColor;
    mCtx.font = fontSize + 'px monospace';
    
    for (let i = 0; i < rainDrops.length; i++) {
      const text = characters[Math.floor(Math.random() * characters.length)];
      mCtx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
      
      if (rainDrops[i] * fontSize > mCanvas.height && Math.random() > 0.975) {
        rainDrops[i] = 0;
      }
      rainDrops[i]++;
    }
  }
  
  if (matrixInterval) clearInterval(matrixInterval);
  matrixInterval = setInterval(draw, 33);
  
  // Stop after 4 seconds and print complete message
  setTimeout(() => {
    clearInterval(matrixInterval);
    mCanvas.style.display = 'none';
    typeTerminalResponse("MATRIX DISRUPT SEQUENCE COMPLETED SUCCESSFULLY.<br>Shell regained control.");
  }, 4000);
}

const mockCommands = {
  help: `Available commands:<br>
  - <span class="accent-teal">about</span>      : Background summary<br>
  - <span class="accent-teal">skills</span>     : Skill metrics stack<br>
  - <span class="accent-teal">experience</span> : Career milestones overview<br>
  - <span class="accent-teal">sar-info</span>   : Oil spill project technical specification<br>
  - <span class="accent-teal">sys-check</span>  : Run automated diagnostic tests<br>
  - <span class="accent-teal">matrix</span>    : Trigger digital code rain waterfall<br>
  - <span class="accent-teal">theme &lt;name&gt;</span>: Change terminal colors (matrix, amber, cyber, classic)<br>
  - <span class="accent-teal">sudo</span>        : Request administrative execution<br>
  - <span class="accent-teal">contact</span>    : Social links and copy action<br>
  - <span class="accent-teal">clear</span>      : Reset terminal output`,
  
  about: `SYSTEM REPORT: SHEHRYAR KHAN<br>
  ===========================<br>
  AI & Machine Learning Engineer based in Islamabad, PK.<br>
  Focus areas: Real-time Computer Vision (YOLO, SAM2) and Agentic Architectures (LangGraph, RAG).<br>
  Known for bridging notebook research to optimized docker containers running on edge nodes.`,
  
  skills: `SKILL MATRIX EXPANSION DETECTED:<br>
  --------------------------------<br>
  [Python/PyTorch]  [████████████████████] 95% (Advanced)<br>
  [Computer Vision] [██████████████████░░] 90% (YOLO, SAM2, OpenCV)<br>
  [Agentic AI/RAG]  [██████████████████░░] 90% (LangGraph, LangChain)<br>
  [Docker/FastAPI]  [██████████████░░░░░░] 70% (Microservices deployment)<br>
  [C++ / Core AI]   [██████████░░░░░░░░░░] 50% (Optimization & Embedded)`,

  experience: `TIMELINE EXTRACTS:<br>
  ------------------<br>
  - <span class="accent-copper">NeuralSeek (AI Agent Intern)</span> [Oct 2025 - Nov 2025]<br>
    Built LangGraph agents & tuned VLMs (LoRA). Spatial search RAG systems.<br>
  - <span class="accent-copper">Arch Technologies (ML Intern)</span> [Apr 2025 - Jun 2025]<br>
    Validated raw data structures, configured training loops & scoring pipelines.`,

  'sar-info': `PROJECT SHOWCASE: SAR OIL SPILL DETECTOR<br>
  ========================================<br>
  Goal: Detect oceanic oil spills from Synthetic Aperture Radar (SAR) imagery.<br>
  Challenge: High speckle noise and visual similarities between slick and low-wind areas.<br>
  Architecture: Custom ResNet-50 backbone fused into U-Net decoder with intensive speckle filters.<br>
  Metric: <span class="accent-teal">0.73 Mean Intersection-Over-Union (IoU)</span> overall. Ready for edge execution.`,

  'sys-check': `SYSTEM DIAGNOSTICS:<br>
  -------------------<br>
  - HOST NAME   : shehryar-portfolio<br>
  - KERNEL LOAD : SZABIST-AI-v3.5<br>
  - CPU CORES   : 16x Intel-Neurals (Simulated)<br>
  - LOAD STACK  : PyTorch (88%) · OpenCV (65%) · LangGraph (92%)<br>
  - COFFEE LVL  : 94.6% (Resilient)<br>
  - KEY STROKES : 124 WPM average<br>
  - STATUS      : <span class="accent-teal">ALL_SYSTEMS_OPTIMAL (IoU: 0.73)</span>`,

  sudo: `[sudo] password for recruiter: *********<br>
  <span style="color:#ef4444;">WARNING: ACCESS GRANTED TO SHEHRYAR'S PRIVATE VAULT.</span><br>
  "Welcome back, Captain. Shehryar is currently open for contract AI engineering. Send him an email immediately to deploy your next pipeline!"`,

  contact: `CONNECT STRATEGY:<br>
  -----------------<br>
  Email    : shehryarkhan971@yahoo.com<br>
  Phone    : +92 303 5618555<br>
  LinkedIn : linkedin.com/in/shehryar-khan-9317ba1bb<br>
  GitHub   : github.com/ShehryarKhan123-ship-it`
};

function typeTerminalResponse(htmlContent) {
  const line = document.createElement('div');
  line.className = 'terminal-line';
  terminalOutput.appendChild(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
  line.innerHTML = htmlContent;
}

function processCommand(cmdText) {
  const cleanCmd = cmdText.trim().toLowerCase();
  
  // Display echo
  const echo = document.createElement('div');
  echo.innerHTML = `<span class="prompt-symbol">recruiter@shehryar-portfolio:~$</span> ${cmdText}`;
  terminalOutput.appendChild(echo);

  if (cleanCmd === '') {
    // empty
  } else if (cleanCmd === 'clear') {
    terminalOutput.innerHTML = '';
  } else if (cleanCmd === 'matrix') {
    startMatrixRain();
  } else if (cleanCmd.startsWith('theme ')) {
    const themeName = cleanCmd.substring(6).trim();
    const colors = {
      matrix: '#00ff00',
      amber: '#fbbf24',
      cyber: '#00f0ff',
      classic: '#e3ebe6'
    };
    const wrapper = document.querySelector('.terminal-wrapper');
    if (colors[themeName]) {
      if (wrapper) wrapper.style.setProperty('--term-color', colors[themeName]);
      typeTerminalResponse(`Terminal color theme shifted to [${themeName}].`);
    } else {
      typeTerminalResponse(`Unknown theme: [${themeName}]. Try matrix, amber, cyber, or classic.`);
    }
  } else if (mockCommands[cleanCmd]) {
    typeTerminalResponse(mockCommands[cleanCmd]);
  } else {
    typeTerminalResponse(`Command not found: <span style="color:#f43f5e;">${cleanCmd}</span>. Type <span class="accent-teal">help</span> for commands.`);
  }
  
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

if (terminalInput) {
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = terminalInput.value;
      processCommand(val);
      terminalInput.value = '';
    }
  });
}

shortcutBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const cmd = btn.getAttribute('data-cmd');
    processCommand(cmd);
  });
});


// 7. Clipboard copy for phone number & email with fallback
const copyPhoneBtn = document.getElementById('copy-phone-btn');
const copyEmailBtn = document.getElementById('copy-email-btn');
const copyNotification = document.getElementById('copy-notification');

function copyToClipboard(text, successCallback) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(successCallback).catch(fallbackCopy);
  } else {
    fallbackCopy();
  }

  function fallbackCopy() {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        successCallback();
      } else {
        console.error('Fallback: Copying text command was unsuccessful');
      }
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
  }
}

if (copyPhoneBtn) {
  copyPhoneBtn.addEventListener('click', () => {
    copyToClipboard('+923035618555', () => {
      if (copyNotification) {
        copyNotification.textContent = '✓ copied +923035618555 to clipboard';
        copyNotification.classList.add('show');
        setTimeout(() => {
          copyNotification.classList.remove('show');
        }, 2200);
      }
    });
  });
}

if (copyEmailBtn) {
  copyEmailBtn.addEventListener('click', () => {
    copyToClipboard('shehryarkhan971@yahoo.com', () => {
      if (copyNotification) {
        copyNotification.textContent = '✓ copied shehryarkhan971@yahoo.com to clipboard';
        copyNotification.classList.add('show');
        setTimeout(() => {
          copyNotification.classList.remove('show');
        }, 2200);
      }
    });
  });
}

// 8. Scroll Progress Indicator & Handshake Parallax
const handshakeWrapper = document.querySelector('.handshake-wrapper');
const handHuman = document.querySelector('.hand-human');
const handRobot = document.querySelector('.hand-robot');
const handshakeSpark = document.querySelector('.handshake-spark');

window.addEventListener('scroll', () => {
  // Update scroll bar
  const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
  const indicator = document.getElementById('scroll-indicator');
  if (indicator) {
    indicator.style.width = scrolled + '%';
  }

  // Interpolate handshake
  if (handshakeWrapper && handHuman && handRobot && handshakeSpark) {
    const rect = handshakeWrapper.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Trigger window markers
    const startTrigger = windowHeight * 0.95;
    const endTrigger = windowHeight * 0.45;
    
    let progress = (startTrigger - rect.top) / (startTrigger - endTrigger);
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;
    
    // Ease-out curve
    const easeProgress = progress * (2 - progress);
    
    // Translate human hand
    const transHuman = 150 * (1 - easeProgress);
    handHuman.style.transform = `translateY(-50%) translateX(calc(-100% - ${transHuman}px))`;
    handHuman.style.opacity = easeProgress;
    
    // Translate robot hand
    const transRobot = 150 * (1 - easeProgress);
    handRobot.style.transform = `translateY(-50%) translateX(${transRobot}px)`;
    handRobot.style.opacity = easeProgress;
    
    // Handle spark glow
    if (progress > 0.85) {
      const sparkProgress = (progress - 0.85) / 0.15; // 0 to 1
      const sparkScale = sparkProgress * 1.3;
      handshakeSpark.style.transform = `translate(-50%, -50%) scale(${sparkScale})`;
      handshakeSpark.style.opacity = sparkProgress;
    } else {
      handshakeSpark.style.transform = `translate(-50%, -50%) scale(0)`;
      handshakeSpark.style.opacity = 0;
    }
  }
});
