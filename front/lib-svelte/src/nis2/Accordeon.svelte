<script lang="ts">
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
</script>

<div class="accordeons">
  <dsfr-accordion
    title-markup-level={3}
    label="18 secteurs d'activités concernés"
  >
    <p>
      Plusieurs milliers d'entités réparties sur 18 secteurs d'activité seront
      concernés. Pour l'essentiel, ces entités seront des moyennes et grandes
      entreprises ainsi que des collectivités territoriales et des
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
      Deux types d’entités relevant des secteurs précités sont concernées par la
      directive NIS2, définies, selon leur degré de criticité, leur taille et
      leur chiffre d'affaires (pour les entreprises)&nbsp;:
    </p>
    <ul>
      <li>
        <strong>Les entités essentielles</strong>, si elles emploient au moins
        250 personnes ou ont un chiffre d'affaires annuel supérieur à 50
        millions d'euros et un bilan annuel supérieur à 43 millions
        d'euros&nbsp;;
      </li>
      <li>
        <strong>Les entités importantes</strong>, si elles ne sont pas entités
        essentielles et emploient au moins 50 personnes ou ont un chiffre
        d’affaires et un bilan annuel supérieur à 10 millions d'euros.
      </li>
    </ul>
    <p>
      La directive NIS2 prévoit des exceptions pour plusieurs types d'entité,
      dont les prestataires de services de confiance, les fournisseurs de
      services DNS, les registres de noms de domaine de premier niveau, les
      fournisseurs de réseaux de communications électroniques publiques, les
      fournisseurs de services de communications électroniques accessibles au
      public et l'administration publique. <dsfr-link
        label="En savoir plus"
        href="https://aide.monespacenis2.cyber.gouv.fr/fr/"
        blank
      ></dsfr-link>
    </p>
  </dsfr-accordion>

  <dsfr-accordion title-markup-level={3} label="3 obligations majeures">
    <h6>L'enregistrement auprès de l'autorité nationale compétente</h6>
    <p>
      Une fois qu’une entité a évalué qu’elle entrait dans le périmètre de la
      directive NIS&nbsp;2, celle-ci doit s'enregistrer en France auprès de
      l’Agence nationale de la sécurité des systèmes d’information (ANSSI).
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
      place des mesures juridiques, techniques et organisationnelles visant à
      gérer les risques qui menacent la sécurité de leurs réseaux et de leurs
      systèmes d'information. <dsfr-link
        label="En savoir plus"
        href="https://aide.monespacenis2.cyber.gouv.fr/fr/"
        blank
      ></dsfr-link>
    </p>
    <p>
      En raison de la nature transfrontalière de leurs services, certaines
      entités du secteur des infrastructures numériques, de gestion des services
      des technologies de l'information et de la communication (TIC) et des
      fournisseurs numériques font l'objet d'un règlement d'exécution spécifique
      de la Commission européenne (<dsfr-link
        label="accessible en français ici"
        href="https://eur-lex.europa.eu/legal-content/FR/TXT/PDF/?uri=OJ:L_202402690"
        blank
      ></dsfr-link>). Par conséquent, elles ne sont pas soumises au socle de
      mesures de sécurité NIS&nbsp;2 définies pour les entités établies en
      France.
      <dsfr-link
        label="En savoir plus"
        href="https://aide.monespacenis2.cyber.gouv.fr/fr/"
        blank
      ></dsfr-link>
    </p>
    <dsfr-button
      label="Découvrir les solutions pour m'aider"
      kind="secondary"
      markup="a"
      href="/directive-nis2#solutions&comprendre"
    ></dsfr-button>
    <h6>La déclaration d’incidents</h6>
    <p>
      Les entités concernées par NIS2 devront, par ailleurs, signaler à l’ANSSI
      leurs incidents de sécurité ayant un impact important et fournir des
      rapports concernant l'évolution de la situation.
    </p>
    <dsfr-button
      label="Déclarer un incident"
      kind="secondary"
      markup="a"
      href="https://club.ssi.gouv.fr/#/declarations"
      target="_blank"
      has-icon
      icon-place="right"
      icon="external-link-line"
    ></dsfr-button>
    <p>
      Conformément à la directive NIS&nbsp;2, des actions de supervision seront
      assurées pour vérifier le respect par les entités de leurs obligations. En
      cas de non-respect de ces dernières, les entités s'exposeront à des
      sanctions. La directive prévoit la capacité d'imposer, entre autres, des
      sanctions financières aux entités régulées. Ces sanctions, qui doivent
      être proportionnées au(x) manquement(s), pourront aller jusqu'à un
      pourcentage du chiffre d'affaires mondial des entités (2&nbsp;% pour les
      EE et 1,4&nbsp;% pour les EI).
    </p>
  </dsfr-accordion>
</div>

<style lang="scss">
  .accordeons {
    display: flex;
    flex-direction: column;
    margin: 2rem 0;

    dsfr-button {
      margin-bottom: 2rem;

      + p {
        margin-top: 0;
      }
    }
  }
</style>
