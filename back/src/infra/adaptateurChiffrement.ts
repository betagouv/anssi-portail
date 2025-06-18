// Cet adapteur n'est plus utilisé actuellement mais le sera très très bientôt. Nous le gardons pour éviter d'avoir
// à le réecrire et à le réimporter.
export interface AdaptateurChiffrement {
  nom: 'adaptateurChiffrement';
}

export const fabriqueAdaptateurChiffrement = (): AdaptateurChiffrement => {
  return {
    nom: 'adaptateurChiffrement',
  };
};
