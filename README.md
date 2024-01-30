This is a reproduction of a Prisma Neon Adapter bug.

When inserting `null` values into a `Json` field, the value is missing when the field is retrieved.

```sh
npm run repro
```
