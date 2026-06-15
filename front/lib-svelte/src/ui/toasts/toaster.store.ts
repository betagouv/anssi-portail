import { writable } from 'svelte/store';

export type NiveauMessage = 'info' | 'succes' | 'erreur';

export type BoutonAction = {
  label: string;
  icone: string;
  href: string;
};

export type MessageToast = {
  niveau: NiveauMessage;
  titre: string;
  contenu: string;
  boutonAction?: BoutonAction;
  timeout: number;
  id?: number;
};

type StoreToasterProps = {
  queue: MessageToast[];
};

const { subscribe, update } = writable<StoreToasterProps>({
  queue: [],
});

export const toasterStore = {
  subscribe,
  info: (titre: string, contenu: string, boutonAction?: BoutonAction) => {
    afficheToast(titre, contenu, 'info', boutonAction);
  },
  succes: (titre: string, contenu: string) => {
    afficheToast(titre, contenu, 'succes');
  },
  erreur: (titre: string, contenu: string) => {
    afficheToast(titre, contenu, 'erreur');
  },
  fermeToast: (id?: number) =>
    update((etatActuel) => {
      etatActuel.queue = etatActuel.queue.filter((toast) => toast.id !== id);
      return etatActuel;
    }),
};

const fabriqueToast = (
  titre: string,
  contenu: string,
  niveau: NiveauMessage,
  boutonAction?: BoutonAction,
  timeout = 5000
): MessageToast => {
  return {
    niveau,
    titre,
    contenu,
    timeout,
    boutonAction,
    id: +new Date() + Math.random(),
  };
};

function afficheToast(titre: string, contenu: string, niveau: NiveauMessage, boutonAction?: BoutonAction) {
  const message = fabriqueToast(titre, contenu, niveau, boutonAction);
  setTimeout(() => {
    update((etatActuel) => {
      etatActuel.queue.shift();
      return etatActuel;
    });
  }, message.timeout);
  update((etatActuel) => {
    etatActuel.queue = [...etatActuel.queue, message];
    return etatActuel;
  });
}
