import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { PersonProfile } from "@prisma/client";
import { StringOutputParser } from "@langchain/core/output_parsers";
import prisma from "@/prismaClient";

const getPersonDescription = async (
  personProfile: PersonProfile,
): Promise<string | null> => {
  // console.log("llm got permission reply body: ", personJsonObject);

  const personJsonObject = await prisma.personProfile.findFirstOrThrow({
    where: {
      email: personProfile.email,
    },
    select: {
      fullName: true,
      city: true,
      country: true,
      state: true,
      seniority: true,
      headline: true,
      workFunctions: {
        select: {
          workFunction: {
            select: {
              name: true,
            },
          },
        },
      },
      departments: {
        select: {
          department: {
            select: {
              name: true,
            },
          },
        },
      },
      personExperiences: {
        select: {
          companyName: true,
          jobTitle: true,
          jobDescription: true,
          companyProfile: {
            select: {
              size: true,
              industry: true,
              foundedYear: true,
              latestFundingRoundDate: true,
              latestFundingStage: true,
              publiclyTradedExchange: true,
              categories: {
                select: {
                  category: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  console.dir(personJsonObject, { depth: 6 });

  if (personJsonObject.personExperiences.length === 0) {
    console.log("bailing getPersonDescription as no personExperiences found");
    return null;
  } else if (!(personJsonObject.personExperiences ?? [])[0]?.companyProfile) {
    console.log("bailing getPersonDescription as no companyProfile found");
    return null;
  }

  const chatTemplate = ChatPromptTemplate.fromMessages([
    new SystemMessage(
      "You are an AI language model specialized in transforming structured data into coherent, " +
        "natural language sentences. Your goal is to convert JSON data into single sentences that:\n\n" +
        "- Include all key pieces of information from the JSON.\n" +
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
  const chain = chatTemplate.pipe(model).pipe(parser);

  const response = await chain.invoke({
    personJsonObject: personJsonObject,
  });

  console.log("llm gave response: ", response);

  return response;
};

export default getPersonDescription;

if (require.main === module) {
  (async () => {
    const personProfile = await prisma.personProfile.findFirstOrThrow({
      where: {
        email: "stanley.wu@hashkey.com",
      },
    });

    const ans = await getPersonDescription(personProfile);
    console.log("ans: ", ans);
  })();
}
