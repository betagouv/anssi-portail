<script lang="ts">
  import type { DonnéesObservatoire } from '../passerelles/observatoire';
  import ChiffreCle from './ChiffreCle.svelte';
  import EtatDuChargement from './EtatDuChargement.svelte';
  import Onglet from './Onglet.svelte';
  import SousSection from './SousSection.svelte';

  interface Props {
    données: DonnéesObservatoire['menaceCyber'] | undefined;
    enErreur: boolean;
  }

  let { données, enErreur }: Props = $props();
</script>

<Onglet
  titre="La menace cyber"
  introduction="Les chiffres clés de la cybermenace en 2025, issus du Panorama de l’ANSSI et des demandes d’assistance reçues par Cybermalveillance.gouv.fr. Ils reflètent les signalements reçus et ne sont pas forcément représentatifs de l’ensemble des incidents en France."
>
  {#if données}
    <SousSection
      titre="Signalements reçus par l’ANSSI"
      description="Nombre de signalements reçus et d’incidents avérés en 2025."
    >
      <div class="chiffres-cles">
        <ChiffreCle
          id="evenements-securite"
          titre="Événements de sécurité traités"
          valeur={données.evenementsSecurite.total}
          description="Signalements reçus et traités par l’ANSSI en 2025"
          infobulle="Nombre d’événements de sécurité portés à la connaissance de l’ANSSI et traités par ses équipes en 2025. Ils regroupent des signalements (comportements anormaux pouvant avoir un caractère malveillant) et des incidents (attaques dont l’ANSSI a confirmé la réussite). Tous ne correspondent donc pas à des attaques abouties."
          source={données.evenementsSecurite.source}
          date={données.evenementsSecurite.date}
        />
        <ChiffreCle
          id="incidents-averes"
          titre="Incidents avérés"
          valeur={données.incidents.total}
          description="Événements confirmés comme attaques réussies en 2025"
          infobulle="Parmi les événements traités, ceux où l’attaque a réellement réussi&nbsp;: un acteur malveillant a pu agir sur le système informatique de la victime."
          source={données.incidents.source}
          date={données.incidents.date}
        />
      </div>
    </SousSection>

    <SousSection titre="Tendances de la cybermenace" description="Tendances clés de la cybermenace observées en 2025.">
      <div class="chiffres-cles par-quatre">
        <ChiffreCle
          id="rancongiciel"
          titre="Rançongiciel"
          valeur={données.rançongiciels.total}
          description="Part des TPE, PME et ETI parmi les victimes de rançongiciels en 2025"
          infobulle="Selon l’ANSSI, les rançongiciels restent une menace importante en France&nbsp;: 128 compromissions ont été recensées en 2025. Toutes les organisations peuvent être touchées&nbsp;: près de la moitié des victimes sont des TPE, PME ou ETI, aux côtés des collectivités, des établissements de santé et d’enseignement. Les attaquants chiffrent les systèmes et volent souvent des données pour exiger une rançon. Les accès distants gérés par des prestataires ou sous-traitants peuvent servir de porte d’entrée, avec un risque d’arrêt d’activité."
          source={données.rançongiciels.source}
          date={données.rançongiciels.date}
        />
        <ChiffreCle
          id="fraude-virement"
          titre="Fraude au virement"
          valeur={données.fraudesVirement.total}
          description="Hausse des fraudes au virement constatées en 2025 (faux RIB, faux ordres de virement)"
          infobulle="Les fraudes au virement ont bondi de +170 % en 2025 selon Cybermalveillance.gouv.fr&nbsp;: usurpation d’un fournisseur ou d’un dirigeant, souvent après piratage d’une messagerie, pour détourner un paiement. Les données bancaires ayant fait l’objet de violations récentes et exposées concourent à ce risque. Pour les entreprises, elle est l’une des cybermenaces les plus fréquentes constatées en 2025 (+93 %)."
          source={données.fraudesVirement.source}
          date={données.fraudesVirement.date}
        />
        <ChiffreCle
          id="cyberharcelement"
          titre="Cyberharcèlement"
          valeur={données.cyberharcèlements.total}
          description="Hausse des cas visant les entreprises en 2025 (dénigrement, faux avis, usurpation d’identité)"
          infobulle="Le cyberharcèlement des organisations progresse fortement en 2025 selon Cybermalveillance.gouv.fr, visant autant les dirigeants ou agents que la structure elle-même. Une augmentation de +205 % pour les entreprises a été constatée. Une forte présence en ligne y expose davantage&nbsp;: faux avis, dénigrement organisé, parfois assortis d’une demande de rançon pour leur retrait."
          source={données.cyberharcèlements.source}
          date={données.cyberharcèlements.date}
        />
        <ChiffreCle
          id="vols-donnees"
          titre="Vols de données"
          valeur={données.volsDonnées.total}
          description="Progression des incidents liés à l’exfiltration de données en 2025"
          infobulle="En 2025, l’ANSSI a constaté, sur la base des signalements reçus, une forte progression des incidents liés à l’exfiltration de données (environ 51 %)."
          source={données.volsDonnées.source}
          date={données.volsDonnées.date}
        />
      </div>
    </SousSection>
  {:else}
    <EtatDuChargement {enErreur} />
  {/if}
</Onglet>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .chiffres-cles {
    display: grid;
    gap: 1.5rem;
    margin-top: 1.5rem;

    @include a-partir-de(sm) {
      grid-template-columns: repeat(2, 1fr);
    }

    &.par-quatre {
      @include a-partir-de(lg) {
        grid-template-columns: repeat(4, 1fr);
      }
    }
  }
</style>
