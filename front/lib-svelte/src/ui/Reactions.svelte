<script lang="ts">
  import { Reactions } from '@lab-anssi/ui-kit';
  import axios from 'axios';

  type Props = {
    clé: string;
    cible: string;
    urlDeBase: string;
    réactions: Record<string, number>;
    variant?: 'tertiaire' | 'tertiaire-sans-bordure';
  };
  let { clé, cible, urlDeBase, réactions, variant = 'tertiaire' }: Props = $props();

  let reactions = $derived(
    ['❤️', '🔥', '👍'].map((typeReaction) => ({
      id: typeReaction,
      emoji: typeReaction,
      compteur: réactions[typeReaction] ?? 0,
      actif: localStorage.getItem(`${clé}_${typeReaction}`) === 'true',
    }))
  );

  const metAJourRéactions = () => {
    réactions = reactions.reduce(
      (acc, reaction) => {
        acc[reaction.id] = reaction.compteur;
        return acc;
      },
      {} as Record<string, number>
    );
  };

  const ajouteReaction = async (id: string) => {
    console.log(id);
    reactions = reactions.map((reaction) => ({
      ...reaction,
      compteur: reaction.id === id ? reaction.compteur + 1 : reaction.compteur,
      actif: reaction.id === id ? true : reaction.actif,
    }));
    localStorage.setItem(`${clé}_${id}`, 'true');
    metAJourRéactions();
    const url = `${urlDeBase[-1] === '/' ? urlDeBase.slice(0, -1) : urlDeBase}/${cible}/${id}`;
    await axios.post(url);
  };

  const supprimeReaction = async (id: string) => {
    reactions = reactions.map((reaction) => ({
      ...reaction,
      compteur: reaction.id === id ? reaction.compteur - 1 : reaction.compteur,
      actif: reaction.id === id ? false : reaction.actif,
    }));
    localStorage.removeItem(`${clé}_${id}`);
    metAJourRéactions();
    const url = `${urlDeBase[-1] === '/' ? urlDeBase.slice(0, -1) : urlDeBase}/${cible}/${id}`;
    await axios.delete(url);
  };
</script>

<div class="reactions">
  <Reactions
    tooltipTexte="Ajouter une réaction"
    tooltipId="tooltip-reaction"
    {variant}
    {reactions}
    onajouteReaction={ajouteReaction}
    onsupprimeReaction={supprimeReaction}
  ></Reactions>
</div>

<style lang="scss">
  .reactions {
    padding: 6px;
  }
</style>
