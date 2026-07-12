// theme toggle + signature reveal
const root = document.documentElement
const stored = localStorage.getItem('theme')
if (stored) root.dataset.theme = stored
else if (window.matchMedia('(prefers-color-scheme: light)').matches) root.dataset.theme = 'light'

document.getElementById('theme').addEventListener('click', () => {
  const next = root.dataset.theme === 'light' ? 'dark' : 'light'
  root.dataset.theme = next
  localStorage.setItem('theme', next)
})

const card = document.querySelector('.reveal-card')
const btn = document.getElementById('reveal-btn')
const badge = document.getElementById('lens-badge')
const toggle = () => {
  const on = card.classList.toggle('revealed')
  btn.textContent = on ? 'Re-seal' : 'Reveal values'
  badge.textContent = on ? 'decrypted' : 'reveal'
}
btn.addEventListener('click', toggle)

// auto-reveal once in view (respects reduced-motion by just skipping the delay)
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
new IntersectionObserver(
  (entries, obs) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        setTimeout(toggle, reduce ? 0 : 650)
        obs.disconnect()
      }
    }
  },
  { threshold: 0.5 },
).observe(card)
