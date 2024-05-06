import prisma from "@/prismaClient";
import { Prisma, ReverseEmailLookupEndpoint } from "@prisma/client";
import processRateLimitedRequest from "@/services/processRateLimitedRequest";
import emailLookupByProxyUrl from "@/services/helpers/proxycurl/emailLookupApiCall";
import JsonValue = Prisma.JsonValue;
import companyLookupByProxyUrl from "@/services/helpers/proxycurl/companyLookupApiCall";

const companyLookupApiResponse = async (
  linkedInProfileUrl: string,
): Promise<Record<string, any>> => {
  console.log("checking cache for ", linkedInProfileUrl);
  const record = await prisma.companyProfileEndpoint.findFirst({
    where: {
      url: linkedInProfileUrl,
    },
  });

  if (record) {
    console.log("got cache HIT for: ", linkedInProfileUrl);
    return record.response as Record<string, any>;
  }

  const data = await companyLookupByProxyUrl(linkedInProfileUrl);
  const newRecord = await prisma.companyProfileEndpoint.create({
    data: {
      url: linkedInProfileUrl,
      response: data,
    },
  });

  return newRecord.response as Record<string, any>;
};

export default companyLookupApiResponse;

if (require.main === module) {
  (async () => {
    const ans = await companyLookupApiResponse(
      "https://www.linkedin.com/company/intercom/",
    );
    console.log("ans: ", ans);
  })();
}
