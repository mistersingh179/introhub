import prisma from "@/prismaClient";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { User } from "@prisma/client";
import getPersonJsonObject from "@/services/getPersonJsonObject";

export const areTwoUsersCompetitiveSchema = z.object({
  competitive: z
    .boolean()
    .describe(
      "a boolean field which tells us if the two users are competitive or not",
    ),
  reason: z
    .string()
    .describe(
      "an explanation of why the 2 provided users are are competitive or are not competitive",
    ),
});

export type AreTwoUsersCompetitveType = z.infer<
  typeof areTwoUsersCompetitiveSchema
>;

const areTwoUsersCompetitive = async (
  email1: string,
  email2: string,
): Promise<AreTwoUsersCompetitveType> => {
  const model = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0,
  });
  const structuredModel = model.withStructuredOutput(
    areTwoUsersCompetitiveSchema,
  );

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are an assistant designed to look at users of networking platform and detect if two users are competitive with each other or not." +
        "It is important to know if the users are competitive because then the networking platform will block them from sharing each others contacts." +
        "You will be provided a json object for each user which describes the users role at their company and describes their company. " +
        "Using that information you need to judge if they are competitive with each other. ",
    ],
    ["user", "user1: {user1}\n\n" + "user2: {user2}"],
  ]);

  const pp1 = await prisma.personProfile.findFirstOrThrow({
    where: {
      email: email1,
    },
  });
  const person1 = await getPersonJsonObject(pp1);

  const pp2 = await prisma.personProfile.findFirstOrThrow({
    where: {
      email: email2!,
    },
  });
  const person2 = await getPersonJsonObject(pp2);

  const ans = await prompt.pipe(structuredModel).invoke({
    user1: person1,
    user2: person2,
  });
  console.log("llm gave competitive ans: ", ans);

  return ans;
};

export default areTwoUsersCompetitive;

if (require.main === module) {
  (async () => {
    const persons = await prisma.personProfile.findMany({
      take: 1
    });
    const result = []
    for(const p of persons){
      const ans = await areTwoUsersCompetitive("rod@introhub.net", p.email);
      (ans as (typeof ans & {emails: string[]})).emails = ["rod@introhub.net", p.email];
      result.push(ans);
    }
    console.log(result)

  })();
}
