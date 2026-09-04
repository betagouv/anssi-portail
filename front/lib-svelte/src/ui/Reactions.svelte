<script lang="ts">
  import axios from 'axios';

  type Props = {
    clé: string;
    cible: string;
    urlDeBase: string;
    réactions: Record<string, number>;
    variant?: string;
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

  const ajouteReaction = async (e: CustomEvent) => {
    reactions = reactions.map((reaction) => ({
      ...reaction,
      compteur: reaction.id === e.detail ? reaction.compteur + 1 : reaction.compteur,
      actif: reaction.id === e.detail ? true : reaction.actif,
    }));
    localStorage.setItem(`${clé}_${e.detail}`, 'true');
    metAJourRéactions();
    const url = `${urlDeBase[-1] === '/' ? urlDeBase.slice(0, -1) : urlDeBase}/${cible}/${e.detail}`;
    await axios.post(url);
  };

  const supprimeReaction = async (e: CustomEvent) => {
    reactions = reactions.map((reaction) => ({
      ...reaction,
      compteur: reaction.id === e.detail ? reaction.compteur - 1 : reaction.compteur,
      actif: reaction.id === e.detail ? false : reaction.actif,
    }));
    localStorage.removeItem(`${clé}_${e.detail}`);
    metAJourRéactions();
    const url = `${urlDeBase[-1] === '/' ? urlDeBase.slice(0, -1) : urlDeBase}/${cible}/${e.detail}`;
    await axios.delete(url);
  };
</script>

<lab-anssi-reactions
  tooltip-texte="Ajouter une réaction"
  tooltip-id="tooltip-reaction"
  {variant}
  {reactions}
  onajouteReaction={ajouteReaction}
  onsupprimeReaction={supprimeReaction}
>
</lab-anssi-reactions>

<style lang="scss">
  lab-anssi-reactions {
    padding: 6px;
  }
</style>
