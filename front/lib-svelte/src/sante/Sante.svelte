<script context="module" lang="ts">
  export type Etat = 'ok' | 'ko';
  type TailleImage = '234' | '588' | 'origine';
  export type SanteGuide = {
    id: string;
    documents: { nom: string; etat: Etat }[];
    images: Record<TailleImage, Etat>;
  };
</script>

<script lang="ts">
  import TableSanteGuides from './TableSanteGuides.svelte';

  const guidesAvecDocumentsManquants: SanteGuide[] = [
    {
      id: 'Transition-post-quantique-protocole-SSHv2',
      documents: [{ nom: 'transition_post_quantique_ssh_v2.pdf', etat: 'ko' }],
      images: { '234': 'ok', '588': 'ko', origine: 'ok' },
    },
    {
      id: 'cyberattaques-et-remediation-preparer-la-remedation',
      documents: [
        { nom: 'preparation_remediation_fr-web.pdf', etat: 'ko' },
        { nom: 'plan_remediation-modele.xlsx', etat: 'ok' },
        { nom: 'plan_remediation-modele.odt', etat: 'ko' },
      ],
      images: { '234': 'ok', '588': 'ok', origine: 'ok' },
    },
  ];

  const guidesOk: SanteGuide[] = [
    {
      id: 'xxx',
      documents: [{ nom: 'xxx.pdf', etat: 'ok' }],
      images: { '234': 'ok', '588': 'ok', origine: 'ok' },
    },
  ];
</script>

<dsfr-container>
  <h2>Santé des guides</h2>

  <h3>Documents/images absents</h3>
  <TableSanteGuides guides={guidesAvecDocumentsManquants}></TableSanteGuides>

  <h3>Ok</h3>
  <TableSanteGuides guides={guidesOk}></TableSanteGuides>
</dsfr-container>

<style lang="scss">
  dsfr-container {
    padding-top: 48px;
    padding-bottom: 48px;
  }
</style>
