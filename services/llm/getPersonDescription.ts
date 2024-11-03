import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { PersonProfile } from "@prisma/client";
import { StringOutputParser } from "@langchain/core/output_parsers";
import prisma from "@/prismaClient";
import getPersonJsonObject from "@/services/getPersonJsonObject";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";

const getPersonDescription = async (
  personProfile: PersonProfile,
): Promise<string | null> => {
  // console.log("llm got permission reply body: ", personJsonObject);

  const personJsonObject = await getPersonJsonObject(personProfile);
  console.dir(personJsonObject, { depth: 10 });

  const chatTemplate = ChatPromptTemplate.fromMessages([
    new SystemMessage(
      "You are an AI language model specialized in transforming structured data into coherent, " +
        "natural language sentences. Your goal is to convert JSON data into single sentences that:\n\n" +
        "- Include all key pieces of information from the JSON.\n" +
        "- Ensure that key details (e.g., job title, skills, department, categories and company information) are explicitly included, avoiding abbreviations unless widely known.\n" +
        "- Clearly demonstrate the relationships between different data points.\n" +
        "- Use natural, grammatically correct language.\n" +
        "- Are optimized for capturing semantic meaning for embedding purposes.\n" +
        "- Are concise and focus on semantic richness rather than verbosity.\n\n" +
        "When provided with JSON data, generate such a sentence without adding any extra information or commentary.",
    ),
    HumanMessagePromptTemplate.fromTemplate("JSON: {personJsonObject}"),
  ]);

  const model = new ChatOpenAI({ model: "gpt-4o", temperature: 0 });
  const parser = new StringOutputParser();
  const chain1 = chatTemplate.pipe(model).pipe(parser);

  const chatTemplateSecondPass = ChatPromptTemplate.fromMessages([
    new SystemMessage(
      "You are an AI language model refining a natural language sentence for vector-based search. The goal is to ensure " +
        "that the description is complete, relevant, and optimized for semantic embedding. Starting with the initial sentence, " +
        "compare it to the JSON attributes and make sure:\n\n" +
        "- Ensure all key attributes, including job title, department, skills, location, and industry, are fully represented to maximize search relevance.\n" +
        "- The language is concise, precise, and optimized for capturing meaning for embedding.\n" +
        "- Highlight unique career details or notable experiences, if present, to increase relevance in matching results.\n" +
        "- Any important details such as skills, role specifics, or achievements that enhance relevance are included.\n\n" +
        "Provide only the refined description text as output without any introductory phrases or labels.",
    ),
    HumanMessagePromptTemplate.fromTemplate(
      "JSON: {personJsonObject}\n\nInitial Description: {initialText}",
    ),
  ]);

  const chain2 = chatTemplateSecondPass.pipe(model).pipe(parser);

  const chain = RunnableSequence.from<{
    personJsonObject: Record<string, any>;
  }>([
    {
      personJsonObject: (input) => input.personJsonObject,
      initialText: chain1,
    },
    new RunnablePassthrough({
      func: (input: any) => {
        console.log("initialText: ", input.initialText);
      },
    }),
    chain2,
    new RunnablePassthrough({
      func: (input: any) => {
        console.log("secondText: ", input);
      },
    }),
  ]);

  const ans = await chain.invoke({
    personJsonObject: personJsonObject!,
  });

  console.log("ans: ", ans);

  return ans;
};

export default getPersonDescription;

if (require.main === module) {
  (async () => {
    const personProfile = await prisma.personProfile.findFirstOrThrow({
      where: {
        // email: "stanley.wu@hashkey.com",
        // email: "sam@google.com",
        // email: "bryan@defer.run",
        email: "mistersingh179@gmail.com",
      },
    });

    const ans = await getPersonDescription(personProfile);
    // console.log(ans);
  })();
}
