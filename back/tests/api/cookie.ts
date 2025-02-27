const enObjet = (cookie: string) =>
  cookie.split('; ').reduce((acc: Record<string, any>, v) => {
    const [cle, valeur] = v.split('=');
    try {
      acc[cle] = JSON.parse(decodeURIComponent(valeur).slice(2));
    } catch (error) {
      acc[cle] = valeur;
    }
    return acc;
  }, {});

export { enObjet };
