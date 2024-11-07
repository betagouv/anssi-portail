const changeSectionActive = () => {
  const sections = Array.from(document.querySelector('details ul').children)

  const trouveLeLi = (hash) => sections.find(li => new URL(li.querySelector('a').href).hash === hash)
  const trouveLeTexte = hash => trouveLeLi(hash).textContent;

  document.querySelector('#section-active').textContent = trouveLeTexte(location.hash) ?? ''
  document.querySelector('details').removeAttribute('open');

  sections.forEach(s => s.classList.remove('actif'))
  trouveLeLi(location.hash).classList.add('actif')
}

window.addEventListener('hashchange', changeSectionActive)
window.addEventListener('DOMContentLoaded', changeSectionActive)

