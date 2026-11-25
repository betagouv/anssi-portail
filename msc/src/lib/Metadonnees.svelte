<script lang="ts">
  import { page } from '$app/state';

  let { origine }: { origine: string } = $props();
  const rubrique = $derived(page.url.pathname.split('/')[1]);
  const meta = $derived(page.data.métadonnées?.[page.url.pathname.slice(1)]);
  const seo = $derived(page.data.seo);
  const nom = $derived(seo?.nom ?? meta?.titre ?? 'MesServicesCyber');
  const titre = $derived(seo?.titre ?? nom + ' | MesServicesCyber');
  const description = $derived(seo?.description ?? meta?.description ?? '');
  const canonique = $derived(origine + page.url.pathname);
  const image = $derived(origine + '/assets/images/logo-anssi.png');
  const données = $derived([
    {
      '@type': 'GovernmentOrganization',
      '@id': origine + '/#organization',
      name: 'ANSSI',
      alternateName: "Agence nationale de la sécurité des systèmes d'information",
      url: 'https://cyber.gouv.fr/',
      logo: { '@type': 'ImageObject', url: origine + '/assets/images/logo-anssi.svg' },
      description:
        "Créée en 2009, l'ANSSI est l'autorité nationale en matière de cybersécurité et de cyberdéfense. Son action pour la protection de la Nation se traduit en cinq missions : défendre, connaître, partager, accompagner et réguler.",
      sameAs: [
        'https://fr.wikipedia.org/wiki/Agence_nationale_de_la_s%C3%A9curit%C3%A9_des_syst%C3%A8mes_d%27information',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': origine + '/#website',
      name: 'MesServicesCyber',
      url: origine + '/',
      inLanguage: 'fr',
      publisher: { '@id': origine + '/#organization' },
      description:
        "La plateforme de l'ANSSI pour faciliter l'accès de tous aux services et ressources de cybersécurité.",
    },
    seo?.service
      ? {
          '@type': 'GovernmentService',
          name: nom,
          description: seo.service,
          url: canonique,
          provider: { '@id': origine + '/#organization' },
          serviceType: 'Cybersécurité',
          areaServed: { '@type': 'Country', name: 'France' },
        }
      : {
          '@type': 'WebPage',
          name: nom,
          description,
          url: canonique,
          isPartOf: { '@id': origine + '/#website' },
          inLanguage: 'fr',
        },
    ...(rubrique === 'mentions-legales' || seo?.service
      ? [
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Accueil', item: origine + '/' },
              ...(seo?.service
                ? [{ '@type': 'ListItem', position: 2, name: 'Guides et ressources', item: origine + '/catalogue' }]
                : []),
              { '@type': 'ListItem', position: seo?.service ? 3 : 2, name: nom },
            ],
          },
        ]
      : []),
  ]);
  const jsonLd = $derived(
    JSON.stringify({ '@context': 'https://schema.org', '@graph': données }).replaceAll('<', '\\u003c')
  );
</script>

<svelte:head>
  <title>{titre}</title>
  <link rel="canonical" href={canonique} />
  <meta name="description" content={description} />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="fr_FR" />
  <meta property="og:site_name" content="MesServicesCyber" />
  <meta property="og:title" content={titre} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonique} />
  <meta property="og:image" content={image} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={titre} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
  <!-- eslint-disable-next-line svelte/no-at-html-tags -- JSON sérialisé, chevrons échappés. -->
  {@html '<script type="application/ld+json">' + jsonLd + '</' + 'script>'}
</svelte:head>
