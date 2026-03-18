import './style.css'
import { judge, generateSecretCode } from './lib/utils';
import type { ColorName } from './consts';
import { COLOR_PALETTE, CODE_LENGTH, MAX_ATTEMPTS } from './consts';

// 変数にするとややこしいので
// Vite = eat（位置も色も合っている数）
// vite = bite（色は合っているが位置が違う数）
// と呼ぶことにする

// --- ゲームの状態 ---
let secretCode: ColorName[] = [];
let currentGuess: ColorName[] = [];
let attempts: { guess: ColorName[], eat: number, bite: number }[] = [];
let isGameOver = false;

// --- UI レンダリング関数 ---
function getPillHtml(colorName: ColorName, size: 'sm' | 'md' = 'md') {
  const color = COLOR_PALETTE.find(c => c.name === colorName);
  if (!color) return '';
  const sizeClass = size === 'sm' ? 'w-6 h-6' : 'w-10 h-10';
  return `<div class="${sizeClass} rounded-full ${color.bg} border-2 ${color.border} shadow-inner"></div>`;
}

function render() {
  const app = document.querySelector<HTMLDivElement>('#app')!;
  
  app.innerHTML = `
    <div class="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <header class="flex items-center justify-between pb-6 border-b border-slate-800 mb-8">
        <h1 class="text-3xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
          Vite+vite
        </h1>
        <button id="reset-btn" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-semibold transition">
          New Game
        </button>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="lg:col-span-2 space-y-8">
          
          <div class="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold">Make your Guess</h2>
              <span class="text-sm font-mono px-3 py-1 bg-slate-800 rounded-full text-slate-400">
                Attempt: ${attempts.length + 1} / ${MAX_ATTEMPTS}
              </span>
            </div>

            <div class="flex justify-center gap-4 py-6 bg-slate-950 rounded-xl border border-slate-800 mb-6 min-h-[80px]">
              ${currentGuess.map(color => getPillHtml(color, 'md')).join('')}
              ${Array(CODE_LENGTH - currentGuess.length).fill(0).map(() => 
                `<div class="w-10 h-10 rounded-full bg-slate-800 border-2 border-dashed border-slate-700"></div>`
              ).join('')}
            </div>

            <div class="flex justify-center gap-3 md:gap-4 mb-6">
              ${COLOR_PALETTE.map(color => `
                <button 
                  data-color="${color.name}" 
                  class="color-pick-btn w-12 h-12 md:w-14 md:h-14 rounded-xl ${color.bg} border-4 ${color.border} 
                         active:scale-95 transition-transform shadow-lg focus:outline-none focus:ring-4 focus:ring-cyan-500/50
                         ${isGameOver ? 'opacity-50 cursor-not-allowed' : ''}"
                  ${isGameOver ? 'disabled' : ''}
                ></button>
              `).join('')}
            </div>

            <div class="flex gap-4">
              <button id="clear-btn" class="flex-1 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition disabled:opacity-50"
                ${currentGuess.length === 0 || isGameOver ? 'disabled' : ''}>
                Clear
              </button>
              <button id="submit-btn" class="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl font-bold transition shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                ${currentGuess.length !== CODE_LENGTH || isGameOver ? 'disabled' : ''}>
                Check (Enter)
              </button>
            </div>
          </div>

          <div id="message-area" class="min-h-[60px]"></div>
        </div>

        <div class="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            History
          </h2>
          <div class="space-y-3 max-h-[400px] lg:max-h-[600px] overflow-y-auto pr-2 text-sm font-mono">
            ${attempts.slice().reverse().map((attempt, index) => `
              <div class="flex items-center justify-between gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span class="text-slate-600 w-6">${attempts.length - index}.</span>
                <div class="flex gap-1.5 flex-1">
                  ${attempt.guess.map(color => getPillHtml(color, 'sm')).join('')}
                </div>
                <div class="flex gap-2 text-xs">
                  <span class="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">Vite: ${attempt.eat}</span>
                  <span class="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">vite: ${attempt.bite}</span>
                </div>
              </div>
            `).join('')}
            ${attempts.length === 0 ? '<p class="text-center text-slate-600 py-4 font-sans">No guesses yet.</p>' : ''}
          </div>
        </div>

      </div>
    </div>
  `;

  setupEventListeners();
}

// --- イベントリスナーとゲームロジック ---

function showMessage(html: string, type: 'info' | 'success' | 'error') {
  const area = document.querySelector('#message-area')!;
  const baseClass = "p-4 rounded-xl border text-center font-bold animate-fade-in";
  const types = {
    info: "bg-slate-800 border-slate-700 text-slate-100",
    success: "bg-emerald-950 border-emerald-800 text-emerald-200",
    error: "bg-red-950 border-red-800 text-red-200"
  };
  area.innerHTML = `<div class="${baseClass} ${types[type]}">${html}</div>`;
}

function handleGuess() {
  if (currentGuess.length !== CODE_LENGTH || isGameOver) return;

  const result = judge(secretCode, currentGuess);
  attempts.push({ guess: [...currentGuess], ...result });
  
  if (result.eat === CODE_LENGTH) {
    isGameOver = true;
    showMessage(`🎉 PERFECT! You guessed it in ${attempts.length} tries!`, 'success');
  } else if (attempts.length >= MAX_ATTEMPTS) {
    isGameOver = true;
    const codeHtml = `<div class="flex justify-center gap-2 mt-2">${secretCode.map(c => getPillHtml(c, 'sm')).join('')}</div>`;
    showMessage(`GAME OVER. The answer was:${codeHtml}`, 'error');
  } else {
    showMessage(`Vite: ${result.eat} / vite: ${result.bite}`, 'info');
  }

  currentGuess = [];
  render();
}

function setupEventListeners() {
  // 色選択ボタン
  document.querySelectorAll('.color-pick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (isGameOver || currentGuess.length >= CODE_LENGTH) return;
      const color = btn.getAttribute('data-color') as ColorName;
      currentGuess.push(color);
      render();
    });
  });

  // クリアボタン
  document.querySelector('#clear-btn')?.addEventListener('click', () => {
    if (isGameOver) return;
    currentGuess = [];
    render();
  });

  // 送信ボタン
  document.querySelector('#submit-btn')?.addEventListener('click', handleGuess);

  // リセットボタン
  document.querySelector('#reset-btn')?.addEventListener('click', initGame);

  // Enterキーで送信
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && currentGuess.length === CODE_LENGTH && !isGameOver) {
      handleGuess();
    }
  };
  // イベントが重複しないように一度削除してから追加
  document.removeEventListener('keydown', handleKeyDown);
  document.addEventListener('keydown', handleKeyDown);
}

function initGame() {
  secretCode = generateSecretCode();
  currentGuess = [];
  attempts = [];
  isGameOver = false;
  // デバッグ用（正解をコンソールに表示）
  console.log("Secret Code (for debugging):", secretCode);
  render();
  showMessage("Game started! Pick 4 colors.", 'info');
}

// ゲーム開始
initGame();
