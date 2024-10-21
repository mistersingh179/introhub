import prisma from "../prismaClient";
import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { SystemMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

// @ts-ignore
prisma.$on("query", (e) => {});

(async () => {
  console.log("Starting get-llm-analysis!");

  const intro = await prisma.introduction.findFirstOrThrow({
    include: {
      permissionResponeEmails: true,
    },
  });
  console.log(intro.permissionResponeEmails[2].bodyText);

  const permissionGrantedEnum = z.enum(["yes", "no", "unknown"]);

  const permissionAnalysisSchema = z.object({
    permissionGranted: permissionGrantedEnum.describe(
      "tells us whether the contact has granted us permission to go ahead and make the introduction",
    ),
  });

  type permissionAnalysisType = z.infer<typeof permissionAnalysisSchema>;

  const chatTemplate = ChatPromptTemplate.fromMessages([
    new SystemMessage(
      "You are an expert at reading email threads and understanding what action needs to be taken",
    ),
    HumanMessagePromptTemplate.fromTemplate(
      "I wrote an email seeking permission from a contact " +
        "if they would be okay with me introducing them to a friend. " +
        "They have now replied back. " +
        "Read the email reply below and tell me if would like me to make the introduction or not." +
        "If it is unlcear then you can say that your don't know. \n\n" +
        "Email Body: {emailBody}",
    ),
  ]);

  const model = new ChatOpenAI({ model: "gpt-4o" });
  const structuredModel = model.withStructuredOutput(permissionAnalysisSchema);
  const chain = chatTemplate.pipe(structuredModel);

  const response = await chain.invoke({
    emailBody: intro.permissionResponeEmails![2].bodyText,
  });

  console.log("response: ", response);
})();

export {};
