## Pour créer une nouvelle migration
À la racine :

```shell
$ node --env-file=.env --import tsx ./node_modules/knex/bin/cli.js migrate:make <nom-de-la-migration> --knexfile back/knexfile.ts
```
en remplaçant <nom-de-la-migration> par le nom de la migration

