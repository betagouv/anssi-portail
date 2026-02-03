<script lang="ts">
  import ActionParcoursAvecItems from './ActionParcoursAvecItems.svelte';

  const actions = [
    { id: 'comprendre', titre: 'Comprendre', explication: 'Se familiariser avec la menace cyber.' },
    {
      id: 'se-declarer',
      titre: 'Se déclarer',
      explication: 'Vérifiez si votre entité est concernée et procédez à son enregistrement auprès de l\'ANSSI.',
    },
    {
      id: 'reduire-risques',
      titre: 'Réduire les risques',
      explication: 'Mettez en place des mesures de sécurité adaptées.',
    },
    { id: 'se-preparer', titre: 'Se préparer', explication: 'Signalez à l’ANSSI vos incidents de sécurité.' },
    {
      id: 'declarer-incident',
      titre: 'Déclarer un incident',
      explication: 'Signalez à l’ANSSI vos incidents de sécurité.',
    },
  ];
</script>


<dsfr-container class="sommaire">
  <div class="controle-segmente">
    {#each actions as action, index ( action.id) }
      <a
        href="#{action.id}"
        class="bouton-segmente"
        class:actif={index===0}
      >{ action.titre }</a
      >
    {/each}
  </div>
</dsfr-container>

{#each actions as action, index (action.id)}
  <ActionParcoursAvecItems
    id={action.id}
    titre={action.titre}
    explication={action.explication}
    items={[]}
    fondAlternatif={index % 2 === 1}
  ></ActionParcoursAvecItems>
{/each}


<style lang="scss">
  .sommaire {
    padding-bottom: 16px;
    overflow: auto;
  }
</style>