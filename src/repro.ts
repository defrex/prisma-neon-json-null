import { Pool, neon, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { inspect } from "util";
import ws from "ws";

dotenv.config();

neonConfig.webSocketConstructor = ws;
const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
const neonPrisma = new PrismaClient({ adapter });

const rawPrisma = new PrismaClient();

async function main() {
  const input = {
    isString: "foo",
    isNull: null,
  };

  const rawExample = await rawPrisma.example.create({
    data: { data: input },
  });

  const neonExample = await neonPrisma.example.create({
    data: { data: input },
  });

  console.log(
    inspect(
      {
        rawPrisma: { input: input, output: rawExample.data },
        neonPrisma: { input: input, output: neonExample.data },
      },
      { depth: null }
    )
  );
}

main()
  .then(async () => {
    await rawPrisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await rawPrisma.$disconnect();
    process.exit(1);
  });
