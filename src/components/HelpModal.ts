export function getHelpModalHtml() {
  return `
    <div id="help-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div class="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-black text-slate-100">遊び方</h2>
          <button id="close-help-btn" class="text-slate-500 hover:text-slate-300 transition-colors">
            ✕
          </button>
        </div>
        <div class="space-y-4 text-sm text-slate-400">
          <p>4色の正解コードを当てよう！</p>
          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <span class="text-cyan-400 font-bold">Vite (eat, hit):</span>
              <span>色と位置が両方合っている数</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-slate-300 font-bold">vite (bite, blow):</span>
              <span>色は合っているが位置が違う数</span>
            </div>
          </div>
          
          <div class="pt-2 border-t border-slate-800">
            <h3 class="font-bold text-slate-200 mb-2">例：</h3>
            <ul class="list-disc list-inside space-y-2 text-xs">
              <li><strong>普通の場合:</strong><br>
                正解: [白, 緑, 黄, 赤]<br>
                予想: [白, 赤, 黄, 青]<br>
                結果: <strong>2 Vite, 1 vite</strong> (白と黄が完全一致、赤は色は合っているが位置違い)
              </li>
              <li><strong>重複がある場合:</strong><br>
                正解: [白, 白, 緑, 黄]<br>
                予想: [白, 白, 白, 青]<br>
                結果: <strong>2 Vite, 0 vite</strong> (最初の2つの白がVite。予想の3つ目の白は正解に該当する白が残っていないためカウントされません)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}
