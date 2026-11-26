<script lang="ts">
  import { DsfrBadge, DsfrCard } from '@lab-anssi/ui-kit';

  import { enPropriétéWebC } from '@plateforme/webComponent';
  import Lien from '@ui/Lien.svelte';
  import MotEnExergue from '@ui/MotEnExergue.svelte';

  const tagsParcoursAllégé = [
    { label: '12 mesures', id: '12-mesures', icon: 'arrow-right-line', 'has-icon': true },
    {
      label: 'Conçu pour les non-spécialistes',
      id: 'conçu-pour-les-non-spécialistes',
      icon: 'check-line',
      'has-icon': true,
    },
  ];
  const tagsParcoursComplet = [
    { label: '58 mesures', id: '58-mesures', icon: 'arrow-right-line', 'has-icon': true },
    { label: '6 modules', id: '6-modules', icon: 'layout-grid-line', 'has-icon': true },
    {
      label: 'Basé sur ReCyF',
      id: 'base-sur recyf',
      icon: 'check-line',
      'has-icon': true,
    },
  ];
  const pageSource = 'espace-connecté-encart-présentation-parcours';
</script>

<div class="presentation-parcours">
  <div class="encart-presentation-parcours allégé">
    <dsfr-tags-group tags={enPropriétéWebC(tagsParcoursAllégé)} hasIcon></dsfr-tags-group>
    <h2>Votre cyber&shy;sécurité <MotEnExergue motif="cercle">décolle</MotEnExergue> en 12 mesures 🚀</h2>
    <p class="texte-standard-md">
      Commencez à renforcer votre cybersécurité et à vous protéger des cyberattaques avec ces 12 mesures pensées pour
      les non-spécialistes et applicables en quelques minutes.
    </p>

    <div class="test">
      <DsfrCard
        title="Évitez de tout perdre en cas de cyberattaque 😩"
        hasDescription
        description="Sauvegarder régulièrement les données, vérifier et mettre à l’abri ses sauvegardes"
        size="sm"
        hasBadge
        noLink
        variations="no-border"
        hasButtons
      >
        <div slot="badgesgroup">
          <DsfrBadge accent="yellow-moutarde" label="action recommandée pour démarrer" type="accent" size="sm" />
        </div>
        <div slot="buttonsgroup" class="action">
          <Lien
            apparence="bouton"
            libelle="Passez à l'action"
            href="/mesures/CONTINU.1?pageSource=${pageSource}-allégé"
            etire
          />
        </div>
      </DsfrCard>
    </div>
    <Lien
      libelle="Accédez aux 12 mesures"
      icone="arrow-right-line"
      iconeADroite
      href={`/modules/1?pageSource=${pageSource}-allégé`}
    />
  </div>

  <div class="encart-presentation-parcours complet">
    <dsfr-tags-group tags={enPropriétéWebC(tagsParcoursComplet)} hasIcon></dsfr-tags-group>
    <h2>
      Votre organisation <MotEnExergue motif="vague" couleur="bourgeon">agit&nbsp;déjà</MotEnExergue> pour sa cyber&shy;sécurité&#8239;?
      🛡️
    </h2>
    <p class="texte-standard-md">
      Protégez votre organisation contre les 5 risques cyber les plus courants&nbsp;: perte de maîtrise, exposition,
      failles exploitées, usurpation d'identité, crise subie.
    </p>

    <DsfrCard
      title="Prendre son Cyberdépart"
      hasDescription
      description="Le socle de départ de la sécurisation d'une organisation&nbsp;: les mesures les plus accessibles et les plus rentables, peu coûteuses et rapides à déployer, à mettre en place avant toute protection avancée."
      size="sm"
      hasBadge
      noLink
      variations="no-border"
      hasButtons
    >
      <div slot="badgesgroup">
        <DsfrBadge accent="green-bourgeon" label="premier module recommandé" type="accent" size="sm" />
      </div>
      <div slot="buttonsgroup" class="action">
        <Lien
          apparence="bouton"
          libelle="Accéder aux mesures"
          href="/modules/1?pageSource=${pageSource}-complet"
          etire
          type="secondaire"
        />
      </div>
    </DsfrCard>
    <Lien
      libelle="Accédez aux 6 modules"
      icone="arrow-right-line"
      iconeADroite
      href={`/parcours-complet?pageSource=${pageSource}-complet`}
    />
  </div>
</div>

<style lang="scss">
  @use '../../../../assets/styles/responsive' as *;
  .presentation-parcours {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @include a-partir-de(md) {
      flex-direction: row;
    }

    @include a-partir-de(lg) {
      gap: 1.5rem;
    }

    .encart-presentation-parcours {
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
      gap: 1.5rem;

      @include a-partir-de(md) {
        width: 50%;
        padding: 2rem;
      }
      &.allégé {
        background: var(--pink-macaron-850-200);
      }
      &.complet {
        background: var(--brown-cafe-creme-925-125);
      }

      .test {
        margin-bottom: auto;
      }

      h2 {
        margin-block-end: 1rem;
        --mot-en-exergue-hauteur-vague: 0.5em;
      }

      h2,
      p {
        margin: 0;
      }
      .action {
        display: flex;
        flex-direction: column;
        @include a-partir-de(md) {
          display: block;
        }
      }
    }
  }
</style>
