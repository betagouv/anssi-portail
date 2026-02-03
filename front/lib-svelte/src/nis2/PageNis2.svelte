<script lang="ts">
  import { onMount } from 'svelte';
  import FilAriane from '../ui/FilAriane.svelte';
  import Heros from '../ui/Heros.svelte';

  let estBureau = false;
  onMount(() => {
    const mql = window.matchMedia('(min-width: 992px)');
    mql.addEventListener('change', (e: MediaQueryListEvent) => {
      estBureau = e.matches;
    });
    estBureau = mql.matches;
  });

  const tags = [
    { label: 'Administrations publiques', icon: 'bank-line' },
    { label: 'Eaux potables', icon: 'drop-line' },
    { label: 'Eaux non potables', icon: 'blur-off-line' },
    { label: 'Énergies', icon: 'flashlight-line' },
    { label: 'Espace', icon: 'contrast-line' },
    {
      label:
        "Gestion des services Technologies de l'information et de la Communication (interentreprises)",
      icon: 'chat-settings-line',
    },
    {
      label: 'Infrastructures des marchés financiers',
      icon: 'line-chart-line',
    },
    { label: 'Infrastructures numériques', icon: 'mac-line' },
    { label: 'Santé', icon: 'heart-pulse-line' },
    { label: 'Secteur bancaire', icon: 'bank-card-line' },
    { label: 'Transport', icon: 'bus-line' },
  ];
  const autreTags = [
    {
      label: 'Fabrication, production et distribution de produits chimiques',
      icon: 'paint-line',
    },
    { label: 'Fournisseurs numériques', icon: 'macbook-line' },
    { label: 'Gestion des déchets', icon: 'recycle-line' },
    { label: 'Industries manufacturières', icon: 'settings-5-line' },
    {
      label:
        'Production, transformation et distribution de denrées alimentaires',
      icon: 'restaurant-line',
    },
    {
      label: 'Recherche',
      icon: 'microscope-line',
    },
    { label: 'Services postaux et d’expédition', icon: 'mail-send-line' },
  ];

  const etapesMarelle = [
    {
      titre: 'Savoir si votre entité est concernée',
      description:
        'Réalisez un test en ligne pour déterminer si votre entité est régulée par la directive NIS 2 et à quelle catégorie elle appartient.',
      lien: {
        href: '#',
        texte: 'Débuter le test',
        target: '_self',
      },
      illustration: {
        lien: '/assets/images/personne-reflechissant-devant-un-ecran.svg',
        alt: '',
      },
    },

    {
      titre: "Enregistrer votre entité auprès de l'ANSSI",
      description:
        'Accédez dès à présent au service de pré-enregistrement en ligne.',
      lien: {
        href: '#',
        texte: 'Se déclarer',
        target: '_self',
      },
      illustration: {
        lien: '/assets/images/homme-remplissant-ecran-login.svg',
        alt: '',
      },
    },
    {
      titre: 'Agir pour réduire les risques cyber',
      description:
        'Mettez en oeuvre les exigences de sécurité issues de la directive pour réduire vos risques cyber et signalez à l’ANSSI vos incidents de sécurité. ',
      lien: {
        href: '#',
        texte: "Découvrir les solutions pour m'aider",
        target: '_self',
      },
      illustration: {
        lien: '/assets/images/index-touchant-ecran-demandant-empreinte-digitale.svg',
        alt: '',
      },
    },
  ];
</script>

<Heros
  format="heros"
  theme="sombre"
  cacheTags={true}
  titre="Directive NIS 2"
  description="Préparez-vous et renforcez dès à présent le niveau de cybersécurité de votre organisation."
  cacheActions={false}
  illustrationSource="/assets/images/nis2.svg"
  illustrationAlt="NIS2"
  cacheIllustration={!estBureau}
>
  {#snippet filAriane()}
    <FilAriane fondSombre={true} feuille="Directive NIS 2" />
  {/snippet}
  {#snippet actions()}
    <dsfr-button
      label="Pré-enregistrer mon entité"
      markup="a"
      href="https://club.ssi.gouv.fr/#/nis2/introduction"
      target="_blank"
      has-icon
      icon-place="right"
      icon="external-link-line"
      centered
    ></dsfr-button>
  {/snippet}
</Heros>

<dsfr-container>
  <div class="introduction">
    <h2>Qu’est-ce que NIS&nbsp;2&nbsp;?</h2>
    <p>
      Entrée en vigueur en octobre 2024, la directive NIS&nbsp;2 (sécurité des
      réseaux et des systèmes d'Information) vise à renforcer le niveau de
      cybersécurité des tissus économique et administratif des pays membres de
      l'UE.
    </p>
    <p>
      La transposition de la directive NIS&nbsp;2 en France est en cours. En
      attendant la publication de l’ensemble des textes de transposition, et
      compte tenu de la menace actuelle, les futures entités essentielles et
      importantes sont invitées à s’engager dès à présent dans une démarche
      visant à renforcer leur niveau de sécurité.
    </p>

    <div class="accordeons">
      <dsfr-accordion
        title-markup-level={3}
        label="18 secteurs d'activités concernés"
      >
        <p>
          Plusieurs milliers d'entités réparties sur 18 secteurs d'activité
          seront concernés. Pour l'essentiel, ces entités seront des moyennes et
          grandes entreprises ainsi que des collectivités territoriales et des
          administrations.
        </p>

        <h4>Secteurs hautement critiques</h4>
        <dsfr-tags-group size="md" group-markup="ul" has-icon="true" {tags}
        ></dsfr-tags-group>

        <h4>Autres secteurs critiques</h4>
        <dsfr-tags-group
          size="md"
          group-markup="ul"
          has-icon="true"
          tags={autreTags}
        ></dsfr-tags-group>
      </dsfr-accordion>

      <dsfr-accordion
        title-markup-level={3}
        label="2 typologies d’entités : Essentielles (EE) et Importantes (EI)"
      >
        <p>
          Deux types d’entités relevant des secteurs précités sont concernées
          par la directive NIS2, définies, selon leur degré de criticité, leur
          taille et leur chiffre d'affaires (pour les entreprises) :
        </p>
        <ul>
          <li>
            <strong>Les entités essentielles</strong>, si elles emploient au
            moins 250 personnes ou ont un chiffre d'affaires annuel supérieur à
            50 millions d'euros et un bilan annuel supérieur à 43 millions
            d'euros&nbsp;;
          </li>
          <li>
            <strong>Les entités importantes</strong>, si elles ne sont pas
            entités essentielles et emploient au moins 50 personnes ou ont un
            chiffre d’affaires et un bilan annuel supérieur à 10 millions
            d'euros.
          </li>
        </ul>
        <p>
          La directive NIS2 prévoit des exceptions pour plusieurs types
          d'entité, dont les prestataires de services de confiance, les
          fournisseurs de services DNS, les registres de noms de domaine de
          premier niveau, les fournisseurs de réseaux de communications
          électroniques publiques, les fournisseurs de services de
          communications électroniques accessibles au public et l'administration
          publique. <dsfr-link label="En savoir plus" href="#"></dsfr-link>
        </p>
      </dsfr-accordion>

      <dsfr-accordion title-markup-level={3} label="3 obligations majeures">
        <h6>L'enregistrement auprès de l'autorité nationale compétente</h6>
        <p>
          Une fois qu’une entité a évalué qu’elle entrait dans le périmètre de
          la directive NIS&nbsp;2, celle-ci doit s'enregistrer en France auprès
          de l’Agence nationale de la sécurité des systèmes d’information
          (ANSSI).
        </p>
        <dsfr-button
          label="Pré-enregistrer mon entité"
          markup="a"
          href="https://club.ssi.gouv.fr/#/nis2/introduction"
          target="_blank"
          has-icon
          icon-place="right"
          icon="external-link-line"
        ></dsfr-button>
        <h6>La gestion des risques cyber</h6>
        <p>
          Les entités concernées par la directive NIS2 sont tenues de mettre en
          place des mesures juridiques, techniques et organisationnelles visant
          à gérer les risques qui menacent la sécurité de leurs réseaux et de
          leurs systèmes d'information. <dsfr-link
            label="En savoir plus"
            href="#"
          ></dsfr-link>
        </p>
        <h6>La gestion des risques cyber</h6>
        <p>
          Les entités concernées par la directive NIS2 sont tenues de mettre en
          place des mesures juridiques, techniques et organisationnelles visant
          à gérer les risques qui menacent la sécurité de leurs réseaux et de
          leurs systèmes d'information. <dsfr-link
            label="En savoir plus"
            href="#"
          ></dsfr-link>
        </p>
        <p>
          En raison de la nature transfrontalière de leurs services, certaines
          entités du secteur des infrastructures numériques, de gestion des
          services des technologies de l'information et de la communication
          (TIC) et des fournisseurs numériques font l'objet d'un règlement
          d'exécution spécifique de la Commission européenne (<dsfr-link
            label="accessible en français ici"
            href="https://eur-lex.europa.eu/legal-content/FR/TXT/PDF/?uri=OJ:L_202402690"
          ></dsfr-link>). Par conséquent, elles ne sont pas soumises au socle de
          mesures de sécurité NIS&nbsp;2 définies pour les entités établies en
          France.
          <dsfr-link label="En savoir plus" href="#"></dsfr-link>
        </p>
        <dsfr-button
          label="Découvrir les solutions pour m'aider"
          kind="secondary"
          markup="a"
          href="#"
        ></dsfr-button>
        <h6>La déclaration d’incidents</h6>
        <p>
          Les entités concernées par NIS2 devront, par ailleurs, signaler à
          l’ANSSI leurs incidents de sécurité ayant un impact important et
          fournir des rapports concernant l'évolution de la situation.
        </p>
        <dsfr-button
          label="Déclarer un incident"
          kind="secondary"
          markup="a"
          href="#"
          target="_blank"
          has-icon
          icon-place="right"
          icon="external-link-line"
        ></dsfr-button>
        <p>
          Conformément à la directive NIS&nbsp;2, des actions de supervision
          seront assurées pour vérifier le respect par les entités de leurs
          obligations. En cas de non-respect de ces dernières, les entités
          s'exposeront à des sanctions. La directive prévoit la capacité
          d'imposer, entre autres, des sanctions financières aux entités
          régulées. Ces sanctions, qui doivent être proportionnées au(x)
          manquement(s), pourront aller jusqu'à un pourcentage du chiffre
          d'affaires mondial des entités (2% pour les EE et 1,4% pour les EI).
        </p>
      </dsfr-accordion>
    </div>
  </div>
</dsfr-container>

<dsfr-container class="marelle">
  <lab-anssi-marelle
    titre="NIS&nbsp;2&nbsp;: Comment se lancer&nbsp;?"
    etapesmarelle={etapesMarelle}
  ></lab-anssi-marelle>
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille' as *;
  .introduction {
    justify-self: center;
    @include a-partir-de(lg) {
      max-width: taille-pour-colonnes(8);
    }
    .accordeons {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin: 2rem 0;

      dsfr-button {
        margin-bottom: 2rem;

        + p {
          margin-top: 0;
        }
      }
    }
  }

  .marelle {
    padding-block: 72px;
    background: #f6f6f6;

    lab-anssi-marelle {
      justify-self: center;
      @include a-partir-de(lg) {
        max-width: taille-pour-colonnes(10);
      }
    }
  }
</style>
