<script lang="ts">
  import { mailOuvert } from './hameconnage.store';
</script>

<div class="mail-ouvert">
  <div class="entete-mail">
    <h2 class="fr-h6">
      Anomalie critique détectée sur votre compteur professionnel - Intervention à programmer sous 24h
    </h2>
    <p class="texte-mention-xs">
      {Intl.DateTimeFormat('fr-FR').format(new Date())}
      {$mailOuvert?.heuresMinutesRéception}
    </p>
    <div class="mail-info">
      <p>de&nbsp;:</p>
      <p><strong>{$mailOuvert?.expediteur.nom}</strong>&nbsp;&lt;{$mailOuvert?.expediteur.mail}&gt;</p>
    </div>
    <div class="mail-info">
      <p>à&nbsp;:</p>
      <p>{$mailOuvert?.destinataire}</p>
    </div>
  </div>
</div>

<style lang="scss">
  .mail-ouvert {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 0.16);
    display: flex;
    flex-direction: column;
    font-family: Roboto, serif;
    .entete-mail {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 0.5rem;
      padding: 1rem;
      overflow: hidden;

      h2 {
        margin: 0;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-clamp: 2;
      }
      p {
        margin: 0;
        text-align: start;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .mail-info {
        display: grid;
        grid-template-columns: 4rem 1fr;
        width: 100%;
      }
    }
  }
</style>
