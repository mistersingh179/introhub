import prisma from "@/prismaClient";
import { Prisma } from "@prisma/client";
import emailLookupByProxyUrl from "@/services/helpers/proxycurl/emailLookupApiCall";

const emailLookupApiReponse = async (
  email: string,
  useCache: boolean = true,
): Promise<Record<string, any>> => {
  console.log("got useCache as: ", useCache, " for: ", email);
  if (useCache) {
    console.log("checking cache for ", email);
    const record = await prisma.reverseEmailLookupEndpoint.findFirst({
      where: {
        email: email,
      },
    });

    if (record) {
      console.log("got cache HIT for: ", email);
      return record.response as Record<string, any>;
    }
  }

  console.log("cache did not help for: ", email);

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
    const ans = await emailLookupApiReponse("sandeep@abcxyzabcxyz.com");
    console.log("*** ans: ", ans);
  })();
}
