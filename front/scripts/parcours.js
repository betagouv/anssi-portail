document.addEventListener('readystatechange', () => {
  if (document.readyState !== 'complete') return;

  const controleSegmente = document.querySelector('dsfr-segmented');
  const sections = [...document.querySelectorAll('.action')];
  if (!controleSegmente || sections.length === 0) return;

  const selectionneLaSection = (idx, updateHash = false, scroll = false) => {
    const section = sections[idx];
    if (!section) return;
    controleSegmente.value = idx;
    if (scroll) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  let index = 0;

  controleSegmente.addEventListener('valuechanged', (event) => {
    index = event.detail;
    selectionneLaSection(index, true, true);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          index = sections.indexOf(entry.target);
          selectionneLaSection(index);
        }
      });
    },
    { rootMargin: '-20% 0% -80% 0%' }
  );

  sections.forEach((section) => observer.observe(section));
  controleSegmente.value = index;
});
