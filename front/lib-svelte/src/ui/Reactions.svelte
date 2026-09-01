<script lang="ts">
  import axios from 'axios';

  type Props = {
    clé: string;
    urlDePost: string;
    réactions: Record<string, number>;
    variant?: string;
  };
  let { clé, urlDePost, réactions = $bindable(), variant = 'tertiaire' }: Props = $props();

  let reactions = $state(
    ['❤️', '👍', '🔥'].map((typeReaction) => ({
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
    await axios.post(urlDePost, {
      type: e.detail,
      action: 'ajout',
    });
  };

  const supprimeReaction = async (e: CustomEvent) => {
    reactions = reactions.map((reaction) => ({
      ...reaction,
      compteur: reaction.id === e.detail ? reaction.compteur - 1 : reaction.compteur,
      actif: reaction.id === e.detail ? false : reaction.actif,
    }));
    localStorage.removeItem(`${clé}_${e.detail}`);
    metAJourRéactions();
    await axios.post(urlDePost, {
      type: e.detail,
      action: 'retrait',
    });
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
