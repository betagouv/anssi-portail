<script lang="ts">
  import DemandeDiagnosticSimplifiee from '../demande-aide-mon-aide-cyber/DemandeDiagnosticSimplifiee.svelte';
  import Lien from '../ui/Lien.svelte';
  import AccordeonNis2 from './AccordeonNis2.svelte';
  import Marelle from './Marelle.svelte';
  import Alternatives from '../ui/Alternatives.svelte';
  import { afficheParcoursSecurisation } from '$plateforme/environnement';
  import EncartPromotionParcoursComplet from '../parcours-securisation/EncartPromotionParcoursComplet.svelte';
  import TagProgrammeGratuit from '../parcours-securisation/TagProgrammeGratuit.svelte';

  const retourEnHautDePage = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
</script>

<dsfr-container id="presentation">
  <div class="introduction">
    <h2>Qu’est-ce que NIS&nbsp;2&nbsp;?</h2>
    <p>
      Entrée en vigueur en octobre 2024, la directive NIS&nbsp;2 (sécurité des réseaux et des systèmes d'Information)
      vise à renforcer le niveau de cybersécurité des tissus économique et administratif des pays membres de l'UE.
    </p>
    <p>
      La transposition de la directive NIS&nbsp;2 en France est en cours. En attendant la publication de l’ensemble des
      textes de transposition, et compte tenu de la menace actuelle, les futures entités essentielles et importantes
      sont invitées à s’engager dès à présent dans une démarche visant à renforcer leur niveau de sécurité.
    </p>

    <AccordeonNis2 />

    <div class="lien-nis2">
      <Lien href="/nis2#exigences" libelle="Consulter les exigences applicables à NIS 2" surClic={retourEnHautDePage} />
    </div>
  </div>
</dsfr-container>

<dsfr-container class="marelle">
  <Marelle />
</dsfr-container>

<Alternatives affichageAlternatif={afficheParcoursSecurisation}>
  {#snippet défaut()}
    <dsfr-container class="diagnostic">
      <DemandeDiagnosticSimplifiee
        origine="nis2"
        titre="Commencez à agir pour protéger votre organisation des cyberattaques"
      />
    </dsfr-container>
  {/snippet}
  {#snippet alternatif()}
    <div class="contenu-encart-parcours-securisation">
      <EncartPromotionParcoursComplet
        titre="6 modules pour vous protéger contre les risques les plus courants"
        description="Un programme d'accompagnement gratuit, pensé pour les PME/ETI et les organisations concernées par la directive NIS 2."
        orientation="droite"
      >
        {#snippet tags()}
          <TagProgrammeGratuit />
        {/snippet}
      </EncartPromotionParcoursComplet>
    </div>
  {/snippet}
</Alternatives>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille' as *;

  .introduction {
    margin-inline: auto;
    @include a-partir-de(lg) {
      max-width: taille-pour-colonnes(8);
    }
  }

  .marelle {
    background-color: #f6f6f6;
  }

  .contenu-encart-parcours-securisation {
    margin-top: 48px;
    padding: 96px 0;
    background-color: var(--background-default-grey, white);
  }

  .diagnostic {
    padding: 4.5rem 0;
  }

  .lien-nis2 {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 32px 0 72px;
  }
</style>
