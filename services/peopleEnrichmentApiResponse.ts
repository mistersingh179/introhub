import prisma from "@/prismaClient";
import peopleEnrichmentApiCall, {
  ApolloEnrichResponseWithLimitInfo,
} from "@/services/helpers/apollo/peopleEnrichmentApiCall";

const peopleEnrichmentApiResponse = async (
  email: string,
  useCache: boolean = true,
): Promise<ApolloEnrichResponseWithLimitInfo> => {
  console.log("got useCache as: ", useCache, " for: ", email);
  if (useCache) {
    const record = await prisma.peopleEnrichmentEndpoint.findFirst({
      where: {
        email: email,
      },
    });
    if (record) {
      console.log("got cache HIT for: ", email);
      return {
        response: record.response as unknown as PeopleEnrichmentResponse,
        rateLimitInfo: undefined,
      };
    }else{
      console.log("cache did not help for: ", email);
    }
  }

  const data = await peopleEnrichmentApiCall(email);
  const { response, rateLimitInfo } = data;
  const newRecord = await prisma.peopleEnrichmentEndpoint.create({
    data: {
      email,
      response: response as Record<string, any>,
    },
  });

  return {
    response: newRecord.response as unknown as PeopleEnrichmentResponse,
    rateLimitInfo: rateLimitInfo,
  };
};

export default peopleEnrichmentApiResponse;

if (require.main === module) {
  (async () => {
    const ans = await peopleEnrichmentApiResponse("egzonmehmedi01@gmail.com");
    console.log("*** ans: ", ans);
  })();
}
