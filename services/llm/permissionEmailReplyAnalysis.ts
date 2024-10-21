import { z } from "zod";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";

export const permissionGrantedEnum = z.enum(["yes", "no", "unknown"]);

const permissionAnalysisSchema = z.object({
  permissionGranted: permissionGrantedEnum.describe(
    "tells us whether the contact has granted us permission to go ahead and make the introduction",
  ),
});

export type PermissionAnalysisType = z.infer<typeof permissionAnalysisSchema>;

const permissionEmailReplyAnalysis = async (
  body: string,
): Promise<PermissionAnalysisType> => {
  console.log("llm got permission reply body: ", body);

  const chatTemplate = ChatPromptTemplate.fromMessages([
    new SystemMessage(
      "You are an expert at reading email threads and understanding what action needs to be taken",
    ),
    HumanMessagePromptTemplate.fromTemplate(
      "I wrote an email seeking permission from a contact " +
        "if they would be okay with me introducing them to a friend. " +
        "They have now replied back. " +
        "Read the email reply below and tell me if they would like me to make the introduction or not." +
        "If it is unclear then you can say that you don't know. \n\n" +
        "Email Body: {emailBody}",
    ),
  ]);

  const model = new ChatOpenAI({ model: "gpt-4o" });
  const structuredModel = model.withStructuredOutput(permissionAnalysisSchema);
  const chain = chatTemplate.pipe(structuredModel);

  const response = await chain.invoke({
    emailBody: body,
  });

  console.log("llm gave response: ", response);

  return response;
};

export default permissionEmailReplyAnalysis;

if (require.main === module) {
  (async () => {
    const ans = await permissionEmailReplyAnalysis(
      "now come to think of it i am too busy, maybe next month.",
    );
    console.log("ans: ", ans);
  })();
}
