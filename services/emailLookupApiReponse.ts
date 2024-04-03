import prisma from "@/prismaClient";
import { Prisma } from "@prisma/client";
import emailLookupByProxyUrl from "@/services/helpers/proxycurl/emailLookupApiCall";

const emailLookupApiReponse = async (
  email: string,
): Promise<Record<string, any>> => {
  const record = await prisma.reverseEmailLookupEndpoint.findFirst({
    where: {
      email: email,
    },
  });

  if (record) {
    return record.response as Record<string, any>;
  }
  const data = await emailLookupByProxyUrl(email);
  const newRecord = await prisma.reverseEmailLookupEndpoint.create({
    data: {
      email,
      response: data,
    },
  });

  return newRecord.response as Record<string, any>;
};

export default emailLookupApiReponse;

if (require.main === module) {
  (async () => {
    const ans = await emailLookupApiReponse("sandeep@brandweaver.ai");
    console.log("ans: ", ans.profile.experiences);
  })();
}
