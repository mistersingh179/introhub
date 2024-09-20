import prisma from "../prismaClient";
import OpenAI from "openai";
import * as tf from "@tensorflow/tfjs";
import {Contact, Food, Prisma} from "@prisma/client";

// @ts-ignore
prisma.$on("query", (e) => {
});

(async () => {
  console.log("Starting comparison!");

  const openai = new OpenAI({
    organization: "org-3I98ggnlotoupwKfLB3qceRi",
    project: "proj_ww7EwIq22WiUKh0NM5eit6re",
    apiKey: process.env.OPENAI_KEY,
  });

  // const userText = "pasta";
  // const userText = "I want to eat indian food";
  // const userText = "I want to eat indian food which has rice in it";
  const userText = "I want to eat food which does not have rice in it";
  // const userText = "I want to eat indian food which does not have rice in it";
  // const userText = "I want to eat food which has goat and rice in it";
  // const userText = JSON.stringify({
  //   country: "indian",
  //   spicy: "yes",
  //   gravy: "yes",
  //   includes_rice: 'no',
  //   has_dairy: 'no,'
  // });

  const userTextResult = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: userText,
    dimensions: 1536,
  });
  // console.dir(userTextResult, { depth: 5 });
  const userTextVector = userTextResult.data[0].embedding;
  tf.tensor(userTextVector).print();

  const nearestFoodSql = Prisma.sql`
      SELECT name, substring(embedding::text from 1 for 10),
             1 - (embedding <=> ${userTextVector}::vector) as cosine_similiarity
      FROM "Food"
      ORDER BY cosine_similiarity DESC
      LIMIT 5;`

  console.log(nearestFoodSql.text, nearestFoodSql.values);

  const foods = await prisma.$queryRaw<Food[]>(nearestFoodSql);
  console.table(foods);

  console.log(await prisma.food.count())
})();

export {};
