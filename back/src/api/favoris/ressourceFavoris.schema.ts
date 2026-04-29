import z from 'zod';

export const schemaRessourceFavoris = z.strictObject({
  idItemCyber: z
    .string()
    .nonempty("L'idItemCyber est requis")
    .max(256, "L'idItemCyber ne peut pas dépasser 256 caractères"),
});
