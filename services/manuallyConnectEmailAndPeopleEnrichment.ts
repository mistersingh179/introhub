import prisma from "@/prismaClient";
import peopleEnrichmentByLinkedinUrlApiCall from "@/services/helpers/apollo/peopleEnrichmentByLinkedinUrlApiCall";
import enrichContactUsingApollo from "@/services/enrichContactUsingApollo";
import isUserMissingPersonalInfo from "@/services/isUserMissingPersonalInfo";
import setupCompetitorsOnUser from "@/services/setupCompetitorsOnUser";

type ManuallyConnectEmailAndPeopleEnrichment = (
  email: string,
  linkedUrl: string,
) => Promise<PeopleEnrichmentResponse | undefined>;

const manuallyConnectEmailAndPeopleEnrichment: ManuallyConnectEmailAndPeopleEnrichment =
  async (email: string, linkedInUrl: string) => {
    console.log("will connect email: ", email, " to profile: ", linkedInUrl);

    const existingPeopleEnrichment =
      await prisma.peopleEnrichmentEndpoint.findFirst({
        where: { email },
      });
    console.log("exist PeopleEnrichment: ", existingPeopleEnrichment?.response);

    const result = await peopleEnrichmentByLinkedinUrlApiCall(linkedInUrl);
    const { response, rateLimitInfo } = result;

    await prisma.peopleEnrichmentEndpoint.upsert({
      where: { email },
      create: {
        email: email,
        response: response as Record<string, any>,
      },
      update: {
        email: email,
        response: response as Record<string, any>,
      },
    });

    const existingPeronProfile = await prisma.personProfile.findFirst({
      where: {
        email,
      },
    });

    console.log("existing person profile: ", existingPeronProfile);

    if (existingPeronProfile) {
      await prisma.personProfile.delete({
        where: {
          email,
        },
      });
    }

    const enrichmentResult = await enrichContactUsingApollo(email);

    const user = await prisma.user.findFirst({
      where: { email: email },
    });
    if (user) {
      await isUserMissingPersonalInfo(user);
      await setupCompetitorsOnUser(user);
    }
    
    return enrichmentResult?.response;
  };
export default manuallyConnectEmailAndPeopleEnrichment;

if (require.main === module) {
  (async () => {
    const ans = await manuallyConnectEmailAndPeopleEnrichment(
      "mistersingh179@gmail.com",
      "http://www.linkedin.com/in/sandeeparneja",
    );
    console.log("ans: ", ans);
  })();
}
