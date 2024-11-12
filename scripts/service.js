const changeSectionActive = () => {
  const sections = Array.from(document.querySelectorAll('.sommaire ul li'))

  const trouveLesLi = (hash) => sections.filter(li => new URL(li.querySelector('a').href).hash === hash)
  const trouveLeTexte = hash => trouveLesLi(hash)[0].textContent;

  document.querySelector('#section-active').textContent = trouveLeTexte(location.hash) ?? ''
  document.querySelector('details').removeAttribute('open');

  sections.forEach(s => s.classList.remove('actif'))
  trouveLesLi(location.hash).forEach(li => li.classList.add('actif'))
}

window.addEventListener('hashchange', changeSectionActive)
window.addEventListener('DOMContentLoaded', changeSectionActive)

