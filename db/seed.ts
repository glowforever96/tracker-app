import { categoriesTable } from "./schema";
import { drizzle } from "drizzle-orm/neon-http";
import dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL!);

const categoriesSeedData: (typeof categoriesTable.$inferInsert)[] = [
  {
    name: "급여",
    type: "수입",
  },
  {
    name: "임대 수익",
    type: "수입",
  },
  {
    name: "사업 수익",
    type: "수입",
  },
  {
    name: "투자 수익",
    type: "수입",
  },
  {
    name: "기타",
    type: "수입",
  },
  {
    name: "주거",
    type: "지출",
  },
  {
    name: "교통",
    type: "지출",
  },
  {
    name: "식비 및 생활",
    type: "지출",
  },
  {
    name: "건강",
    type: "지출",
  },
  {
    name: "여가 및 오락",
    type: "지출",
  },
  {
    name: "기타",
    type: "지출",
  },
];

async function main() {
  await db.insert(categoriesTable).values(categoriesSeedData);
}
main();
