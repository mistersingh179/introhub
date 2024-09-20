import prisma from "@/prismaClient";
import FoodTable from "@/app/food/FoodTable";
import type { Food } from "@prisma/client";
import { Prisma } from "@prisma/client";
import OpenAI from "openai";
import Search from "@/components/Search";

const openai = new OpenAI({
  organization: "org-3I98ggnlotoupwKfLB3qceRi",
  project: "proj_ww7EwIq22WiUKh0NM5eit6re",
  apiKey: process.env.OPENAI_KEY,
});

export type FoodWithCosine = Food & { cosine_similiarity?: string };

export default async function Food({
  searchParams,
}: {
  searchParams: {
    page?: string;
    query?: string;
  };
}) {
  const { page, query } = searchParams;
  console.log("got query: ", query, page);

  const currentPage = Number(searchParams?.page) || 1;
  const itemsPerPage = 10;
  const recordsToSkip = (currentPage - 1) * itemsPerPage;

  const {
    data: [{ embedding }],
  } = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query ?? "",
    dimensions: 1536,
  });
  console.log("got termEmbeddings: ", embedding);

  const sql = Prisma.sql`
      select id,
             name,
             1 - (embedding <=> ${embedding}::vector) as cosine_similiarity,
             "createdAt",
             "updatedAt"
      from "Food"
      order by cosine_similiarity DESC
      offset ${recordsToSkip} limit ${itemsPerPage};
  `;
  const foods = await prisma.$queryRaw<FoodWithCosine[]>(sql);
  // const foods: Food[] = await prisma.food.findMany({
  //   take: 25,
  // });
  return (
    <div className={"flex flex-col gap-4 m-8"}>
      <h1 className={"text-2xl"}>Food</h1>
      <Search placeholder={"search query goes here"} />
      <FoodTable foods={foods} />
    </div>
  );
}
