import prisma from "@/prismaClient";
import peopleEnrichmentApiCall from "@/services/helpers/apollo/peopleEnrichmentApiCall";

const peopleEnrichmentApiResponse = async (
  email: string,
  useCache: boolean = true,
): Promise<PeopleEnrichmentResponse> => {
  console.log("got useCache as: ", useCache, " for: ", email);
  if (useCache) {
    const record = await prisma.peopleEnrichmentEndpoint.findFirst({
      where: {
        email: email,
      },
    });
    if (record) {
      console.log("got cache HIT for: ", email);
      return record.response as unknown as PeopleEnrichmentResponse;
    }
  }
  console.log("cache did not help for: ", email);

  const data = await peopleEnrichmentApiCall(email);
  const newRecord = await prisma.peopleEnrichmentEndpoint.create({
    data: {
      email,
      response: data as Record<string, any>,
    },
  });

  return newRecord.response as unknown as PeopleEnrichmentResponse;
};

export default peopleEnrichmentApiResponse;

if (require.main === module) {
  (async () => {
    const ans = await peopleEnrichmentApiResponse("sandeep@introhub.net");
    console.log("*** ans: ", ans);
  })();
}
