import "./style.css";
import { judge, generateSecretCode } from "./lib/utils";
import type { ColorName } from "./consts";
import { COLOR_PALETTE, CODE_LENGTH, MAX_ATTEMPTS } from "./consts";

// 変数にするとややこしいので
// Vite = eat（位置も色も合っている数）
// vite = bite（色は合っているが位置が違う数）
// と呼ぶことにする

// --- ゲームの状態 ---
let secretCode: ColorName[] = [];
let currentGuess: ColorName[] = [];
let attempts: { guess: ColorName[]; eat: number; bite: number }[] = [];
let isGameOver = false;

// --- UI レンダリング関数 ---
function getPillHtml(colorName: ColorName, size: "sm" | "md" = "md") {
  const color = COLOR_PALETTE.find((c) => c.name === colorName);
  if (!color) return "";
  const sizeClass = size === "sm" ? "w-6 h-6" : "w-10 h-10";
  return `<div class="${sizeClass} rounded-full ${color.bg} border-2 ${color.border} shadow-inner"></div>`;
}

function render() {
  const app = document.querySelector<HTMLDivElement>("#app")!;

  // 外側に背景用のコンテナを追加
  app.innerHTML = `
    <div class="fixed inset-0 bg-slate-950 flex justify-center">
      
      <div class="relative w-full max-w-md bg-slate-900 flex flex-col shadow-2xl border-x border-slate-800 h-[100dvh] overflow-hidden">
        
        <header class="flex-none flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md z-10">
          <h1 class="text-3xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
            Vite+vite
          </h1>
          <button id="reset-btn" class="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded-full text-xs font-bold transition-all border border-slate-700">
            NEW GAME
          </button>
        </header>

        <main class="flex-1 flex flex-col min-h-0">
          
          <div class="flex-none p-6 space-y-6">
            
            <div class="flex items-center justify-between">
              <h2 class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Current Trace</h2>
              <span class="text-[10px] font-mono px-2 py-0.5 bg-cyan-950/50 rounded border border-cyan-800/50 text-cyan-400">
                LOG: ${String(attempts.length + 1).padStart(2, "0")} / ${MAX_ATTEMPTS}
              </span>
            </div>

            <div class="flex justify-center gap-4 py-6 bg-slate-950/50 rounded-2xl border border-slate-800 shadow-inner">
              ${currentGuess.map((color) => getPillHtml(color, "md")).join("")}
              ${Array(CODE_LENGTH - currentGuess.length)
                .fill(0)
                .map(
                  () =>
                    `<div class="w-10 h-10 rounded-full bg-slate-900/50 border-2 border-dashed border-slate-800/80 transition-all"></div>`,
                )
                .join("")}
            </div>

            <div class="grid grid-cols-3 gap-3">
              ${COLOR_PALETTE.map(
                (color) => `
                <button 
                  data-color="${color.name}" 
                  class="color-pick-btn h-12 rounded-xl ${color.bg} border-2 ${color.border} 
                         active:scale-95 transition-all shadow-md hover:brightness-110
                         ${isGameOver ? "opacity-20 grayscale cursor-not-allowed" : ""}"
                  ${isGameOver ? "disabled" : ""}
                ></button>
              `,
              ).join("")}
            </div>

            <div class="flex gap-3">
              <button id="clear-btn" class="flex-1 py-3 bg-slate-800 text-xs font-black rounded-xl hover:bg-slate-750 transition-colors disabled:opacity-20"
                ${currentGuess.length === 0 || isGameOver ? "disabled" : ""}>
                CLEAR
              </button>
              <button id="submit-btn" class="flex-[2] py-3 bg-cyan-600 text-xs font-black rounded-xl shadow-lg shadow-cyan-900/20 hover:bg-cyan-500 transition-colors disabled:opacity-20"
                ${currentGuess.length !== CODE_LENGTH || isGameOver ? "disabled" : ""}>
                CHECK_LOG
              </button>
            </div>

            <div id="message-area" class="h-6 flex items-center justify-center"></div>
          </div>

          <div class="flex-1 flex flex-col min-h-0 bg-slate-950/30">
            <div class="px-6 py-2 border-t border-b border-slate-800/50 bg-slate-900/50">
              <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Diagnostic History</span>
            </div>
            
            <div class="flex-1 overflow-y-auto px-6 py-4 space-y-3 pb-12 custom-scrollbar">
              ${attempts
                .slice()
                .reverse()
                .map(
                  (attempt, index) => `
                <div class="flex items-center justify-between gap-4 p-3 bg-slate-900/50 rounded-xl border border-slate-800/50 animate-fade-in hover:border-slate-700 transition-colors">
                  <span class="text-[10px] font-mono text-slate-600 w-4">${String(attempts.length - index).padStart(2, "0")}</span>
                  <div class="flex gap-1.5 flex-1">
                    ${attempt.guess.map((color) => getPillHtml(color, "sm")).join("")}
                  </div>
                  <div class="flex gap-2">
                    <div class="flex flex-col items-center">
                      <span class="text-[8px] font-black text-cyan-500 uppercase">Vite</span>
                      <span class="text-sm font-mono font-bold text-cyan-200">${attempt.eat}</span>
                    </div>
                    <div class="w-[1px] h-6 bg-slate-800 self-center"></div>
                    <div class="flex flex-col items-center">
                      <span class="text-[8px] font-black text-slate-500 uppercase italic">vite</span>
                      <span class="text-sm font-mono font-bold text-slate-300">${attempt.bite}</span>
                    </div>
                  </div>
                </div>
              `,
                )
                .join("")}
              ${attempts.length === 0 ? '<p class="text-center text-slate-700 py-20 text-[10px] uppercase tracking-[0.2em]">Ready to analyze</p>' : ""}
            </div>
          </div>
        </main>
      </div>
    </div>
  `;

  setupEventListeners();
}

// --- イベントリスナーとゲームロジック ---

function showMessage(html: string, type: "info" | "success" | "error") {
  const area = document.querySelector("#message-area")!;
  const baseClass = "p-4 rounded-xl border text-center font-bold animate-fade-in";
  const types = {
    info: "bg-slate-800 border-slate-700 text-slate-100",
    success: "bg-emerald-950 border-emerald-800 text-emerald-200",
    error: "bg-red-950 border-red-800 text-red-200",
  };
  area.innerHTML = `<div class="${baseClass} ${types[type]}">${html}</div>`;
}

function handleGuess() {
  if (currentGuess.length !== CODE_LENGTH || isGameOver) return;

  const result = judge(secretCode, currentGuess);
  attempts.push({ guess: [...currentGuess], ...result });

  if (result.eat === CODE_LENGTH) {
    isGameOver = true;
    showMessage(`🎉 PERFECT! You guessed it in ${attempts.length} tries!`, "success");
  } else if (attempts.length >= MAX_ATTEMPTS) {
    isGameOver = true;
    const codeHtml = `<div class="flex justify-center gap-2 mt-2">${secretCode.map((c) => getPillHtml(c, "sm")).join("")}</div>`;
    showMessage(`GAME OVER. The answer was:${codeHtml}`, "error");
  } else {
    showMessage(`Vite: ${result.eat} / vite: ${result.bite}`, "info");
  }

  currentGuess = [];
  render();
}

function setupEventListeners() {
  // 色選択ボタン
  document.querySelectorAll(".color-pick-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (isGameOver || currentGuess.length >= CODE_LENGTH) return;
      const color = btn.getAttribute("data-color") as ColorName;
      currentGuess.push(color);
      render();
    });
  });

  // クリアボタン
  document.querySelector("#clear-btn")?.addEventListener("click", () => {
    if (isGameOver) return;
    currentGuess = [];
    render();
  });

  // 送信ボタン
  document.querySelector("#submit-btn")?.addEventListener("click", handleGuess);

  // リセットボタン
  document.querySelector("#reset-btn")?.addEventListener("click", initGame);

  // Enterキーで送信
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && currentGuess.length === CODE_LENGTH && !isGameOver) {
      handleGuess();
    }
  };
  // イベントが重複しないように一度削除してから追加
  document.removeEventListener("keydown", handleKeyDown);
  document.addEventListener("keydown", handleKeyDown);
}

function initGame() {
  secretCode = generateSecretCode();
  currentGuess = [];
  attempts = [];
  isGameOver = false;
  // デバッグ用（正解をコンソールに表示）
  console.log("Secret Code (for debugging):", secretCode);
  render();
  showMessage("Game started! Pick 4 colors.", "info");
}

// ゲーム開始
initGame();
