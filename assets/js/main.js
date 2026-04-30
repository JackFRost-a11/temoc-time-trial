// main.js

const TOTAL_HEADS  = 10;
const HEAD_SIZE    = 90;
const MASCOT_EMOJI = '🐾';
const PADDING      = 20;

let startTime  = null;
let timerFrame = null;
let clicked    = 0;
let bestTime   = null;
let running    = false;

const arena         = document.getElementById('arena');
const overlay       = document.getElementById('overlay');
const timerVal      = document.getElementById('timer-val');
const remainingVal  = document.getElementById('remaining-val');
const bestVal       = document.getElementById('best-val');
const progressBar   = document.getElementById('progress-bar');
const startBtn      = document.getElementById('start-btn');
const resultBox     = document.getElementById('result-box');
const resultTime    = document.getElementById('result-time');
const bestResultVal = document.getElementById('best-result-val');
const overlayTitle  = document.getElementById('overlay-title');
const overlaySub    = document.getElementById('overlay-sub');

function formatTime(ms) {
  return (ms / 1000).toFixed(2) + 's';
}

function arenaRect() {
  return {
    w: window.innerWidth,
    h: window.innerHeight - 64 - 10
  };
}

function randomPos() {
  const { w, h } = arenaRect();
  const x = PADDING + Math.random() * (w - HEAD_SIZE - PADDING * 2);
  const y = PADDING + Math.random() * (h - HEAD_SIZE - PADDING * 2);
  return { x, y };
}

function nonOverlappingPos(existingPositions) {
  const MIN_DIST = HEAD_SIZE * 1.3; //
  let pos;
  let attempts = 0;

  do {
    pos = randomPos();
    attempts++;

    const tooClose = existingPositions.some(p => {
      const dx = p.x - pos.x;
      const dy = p.y - pos.y;
      return Math.sqrt(dx * dx + dy * dy) < MIN_DIST;
    });

    if (!tooClose || attempts > 60) break;

  } while (true);

  return pos;
}

function spawnClickLabel(x, y) {
  const label = document.createElement('div');
  label.className   = 'click-label';
  label.textContent = '✓';
  label.style.left  = x + 'px';
  label.style.top   = y + 'px';
  arena.appendChild(label);
  setTimeout(() => label.remove(), 520);
}

function spawnConfetti() {
  const colors = ['#f0c040', '#e05c20', '#50e090', '#60b0ff', '#ff6090'];

for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className        = 'confetti';
    piece.style.left       = Math.random() * 100 + 'vw';
    piece.style.top        = '-10px';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (1.2 + Math.random() * 1.6) + 's';
    piece.style.animationDelay   = (Math.random() * 0.6) + 's';
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3000);
  }
}

function tickTimer() {
  if (!running) return;
  const elapsed = Date.now() - startTime;
  timerVal.textContent = formatTime(elapsed);
  timerFrame = requestAnimationFrame(tickTimer);
}

function buildHeads() {
  arena.innerHTML = '';
  const positions = [];

  for (let i = 0; i < TOTAL_HEADS; i++) {
    const pos = nonOverlappingPos(positions);
    positions.push(pos);

 const head = document.createElement('div');
    head.className        = 'mascot-head spawning';
    head.dataset.emoji    = MASCOT-EMOJI;
    head.dataset.index    = i;
    head.style.left       = pos.x + 'px';
    head.style.top        = pos.y + 'px';
    head.style.animationDelay = (i * 40) + 'ms';

    head.addEventListener('click', onHeadClick);
    arena.appendChild(head);
  }
}

function onHeadClick(e) {
  if (!running) return;
  const head = e.currentTarget;
  if (head.classList.contains('hit')) return;
  head.classList.add('hit');
  head.removeEventListener('click', onHeadClick);

const rect     = head.getBoundingClientRect();
  const arenaTop = arena.getBoundingClientRect().top;
  spawnClickLabel(
    rect.left + HEAD_SIZE / 2,
    rect.top - arenaTop
  );

clicked++;
  remainingVal.textContent  = TOTAL_HEADS - clicked;
  progressBar.style.width   = (clicked / TOTAL_HEADS * 100) + '%';
  if (clicked === TOTAL_HEADS) {
    endGame();
  }
}

function startGame() {
  clicked  = 0;
  running  = true;

  timerVal.textContent     = '0.00s';
  remainingVal.textContent = TOTAL_HEADS;
  progressBar.style.width  = '0%';
  overlay.classList.add('hidden');
  buildHeads();

  startTime  = Date.now();
  timerFrame = requestAnimationFrame(tickTimer);
}

function endGame() {
  running = false;
  cancelAnimationFrame(timerFrame);

  const elapsed = Date.now() - startTime;
  const timeStr = formatTime(elapsed);
  if (bestTime === null || elapsed < bestTime) {
    bestTime = elapsed;
  }
  const bestStr = formatTime(bestTime);
  bestVal.textContent = bestStr;

  spawnConfetti();

 setTimeout(() => {
    overlayTitle.textContent  = 'You Got Them All!';
    overlaySub.textContent    = 'All 10 mascot heads clicked!';
    resultTime.textContent    = timeStr;
    bestResultVal.textContent = bestStr;
    resultBox.classList.add('show');
    startBtn.textContent      = 'Play Again';
    overlay.classList.remove('hidden');
  }, 400);
}
startBtn.addEventListener('click', startGame);