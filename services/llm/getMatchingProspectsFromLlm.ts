import prisma from "@/prismaClient";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

export const matchingProspectsSchema = z.object({
  emails: z
    .array(z.string())
    .describe(
      "list of prospect emails which match the provided description in sorted order of relevance",
    ),
});

export type MatchingProspectsType = z.infer<typeof matchingProspectsSchema>;

const getMatchingProspectsFromLlm = async (
  icpDescription: string,
  emails: string[],
): Promise<string[]> => {
  const personProfiles = await prisma.personProfile.findMany({
    where: {
      email: {
        in: emails,
      },
      llmDescription: {
        not: null
      }
    },
  });
  const prospectsDescription = personProfiles.reduce((acc, cv, ci, arr) => {
    return acc + cv.email + " : " + cv.llmDescription + "\n";
  }, "");

  const model = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0,
  });
  const structuredModel = model.withStructuredOutput(matchingProspectsSchema);

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are an assistant designed to match user-provided descriptions of ideal prospects with a list of potential matches. " +
        "The user's description explains the qualities and attributes they seek in a prospect. " +
        "You will receive a list of potential matches sorted by similarity, with the most relevant listed first. " +
        "Only return the prospects that closely match the description, sorted in order of relevance. " +
        "Do not include any explanation or description. ",
    ],
    [
      "user",
      "Here is my ideal prospect description: {icpDescription} \n\n" +
        "Based on this description, please return only the prospects that match, sorted in most relevant to least relevant:\n\n" +
        "{prospectsDescription}",
    ],
  ]);

  const promptString = (
    await prompt.invoke({
      icpDescription: icpDescription,
      prospectsDescription: prospectsDescription,
    })
  )
    .toChatMessages()
    .map((m) => m.content)
    .join("\n\n");

  console.log(promptString);

  const ans2 = await prompt.pipe(structuredModel).invoke({
    icpDescription: icpDescription,
    prospectsDescription: prospectsDescription,
  });
  console.log("llm passed emails: ", ans2.emails.length);
  console.log(ans2.emails);

  return ans2.emails;
};

export default getMatchingProspectsFromLlm;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@introhub.net",
      },
    });
    user.icpDescription = "is a software developer";

    const emails = (
      await prisma.contact.findMany({
        take: 1000,
      })
    ).map((c) => c.email);

    const ans = await getMatchingProspectsFromLlm(user.icpDescription!, emails);
    console.log(ans);
  })();
}
