import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <div class="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-8">
    <div class="space-y-6 text-center">
      <h1 class="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
        Vite+ & Tailwind v4
      </h1>
      
      <p class="text-slate-400 text-lg">
        If you see a gradient title and dark background, Tailwind is working!
      </p>

      <button id="counter" type="button" 
        class="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 transition-colors rounded-xl font-bold shadow-lg shadow-cyan-500/20 active:scale-95">
        Loading...
      </button>
    </div>
  </div>
`

// カウンターロジック（setupCounterをインライン化）
let counter = 0
const btn = document.querySelector<HTMLButtonElement>('#counter')!
const setCounter = (count: number) => {
  counter = count
  btn.innerHTML = `Count is ${counter}`
}
btn.addEventListener('click', () => setCounter(counter + 1))
setCounter(0)