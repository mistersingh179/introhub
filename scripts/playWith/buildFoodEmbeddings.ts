import {Food, Prisma} from "@prisma/client";
import prisma from "@/prismaClient";
import OpenAI from "openai";
import foodNames from "@/scripts/foodNames";

(async () => {

  // await prisma.food.createMany({
  //   data: foodNames.map((n) => ({
  //     name: n,
  //   })),
  // });
  //
  // return;
  const openai = new OpenAI({
    organization: "org-3I98ggnlotoupwKfLB3qceRi",
    project: "proj_ww7EwIq22WiUKh0NM5eit6re",
    apiKey: process.env.OPENAI_KEY,
  });


  const sql = Prisma.sql`
      select id, name, embedding::text
      from "Food" F
      where F.embedding is null
      limit 500`;

  const foods = await prisma.$queryRaw<Food[]>(sql);
  console.log(foods);

  const result = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: foods.map((f) => f.name),
    dimensions: 1536,
  });
  console.dir(result, { depth: 5 });

  for (let i = 0; i < foods.length; i++) {
    const updateSql = Prisma.sql`update "Food"
                                 set embedding=${result.data[i].embedding}
                                 where name = ${foods[i].name}`;
    console.log(updateSql.text, updateSql.values);
    const updateResult = await prisma.$executeRaw<Food>(updateSql);
    console.log(updateResult);
  }
})();

export {};