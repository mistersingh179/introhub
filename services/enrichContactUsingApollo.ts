import prisma from "@/prismaClient";
import peopleEnrichmentApiResponse from "@/services/peopleEnrichmentApiResponse";
import copyImageUrlToS3 from "@/services/helpers/copyImageUrlToS3";
import md5 from "md5";
import { Prisma } from "@prisma/client";
import { ApolloEnrichResponseWithLimitInfo } from "@/services/helpers/apollo/peopleEnrichmentApiCall";
import OpenAiQueue from "@/bull/queues/openAiQueue";
import PersonProfileCreateInput = Prisma.PersonProfileCreateInput;

const enrichContactUsingApollo = async (
  email: string,
): Promise<ApolloEnrichResponseWithLimitInfo | null> => {
  console.log("In enrichContactUsingApollo with: ", email);
  const personProfile = await prisma.personProfile.findFirst({
    where: {
      email,
    },
  });
  console.log("existing personProfile: ", personProfile);

  if (personProfile?.linkedInUrl) {
    console.log(
      "bailing as personProfile with data already exists for: ",
      email,
    );
    return null;
  }

  const apolloEnrichResponseWithLimitInfo =
    await peopleEnrichmentApiResponse(email);
  const { response, rateLimitInfo } = apolloEnrichResponseWithLimitInfo;
  const { person } = response;
  const { organization } = person;
  if (!person?.linkedin_url || !person?.organization?.linkedin_url) {
    console.log("bailing as we did not get enough data from apollo either");
    return apolloEnrichResponseWithLimitInfo;
  }

  const data: PersonProfileCreateInput = {
    email: email,
    linkedInUrl: person.linkedin_url,
    fullName: person.name,
    city: person.city,
    country: person.country,
    state: person.state,
    seniority: person.seniority,
    isLikelyToEngage: person.is_likely_to_engage,
    headline: person.headline,

    personExperiences: {
      create: [
        {
          companyLinkedInUrl: organization.linkedin_url,
          companyName: organization.name,
          jobDescription: organization.short_description,
          jobTitle: person.title.replaceAll("|", ""),
        },
      ],
    },

    workFunctions: {
      create: person["functions"].map((wf: string) => ({
        workFunction: {
          connectOrCreate: {
            create: {
              name: wf,
            },
            where: {
              name: wf,
            },
          },
        },
      })),
    },

    departments: {
      create: person.departments.map((d: string) => ({
        department: {
          connectOrCreate: {
            create: {
              name: d,
            },
            where: {
              name: d,
            },
          },
        },
      })),
    },
  };

  await prisma.personProfile.upsert({
    where: {
      email,
    },
    create: data,
    update: data,
  });

  if (person.photo_url) {
    await copyImageUrlToS3(person.photo_url, "avatar", `${md5(email)}`);
  }

  const companyProfile = await prisma.companyProfile.findFirst({
    where: {
      linkedInUrl: organization.linkedin_url,
    },
  });

  if (!companyProfile) {
    await prisma.companyProfile.create({
      data: {
        linkedInUrl: organization.linkedin_url,
        website: organization.website_url,
        size: organization.estimated_num_employees,
        industry: organization.industry,
        foundedYear: organization.founded_year,
        latestFundingStage: organization.latest_funding_stage,
        latestFundingRoundDate: organization.latest_funding_round_date,
        publiclyTradedExchange: organization.publicly_traded_exchange,

        categories: {
          create: organization.keywords.map((k: string) => ({
            category: {
              connectOrCreate: {
                create: {
                  name: k,
                },
                where: {
                  name: k,
                },
              },
            },
          })),
        },
      },
    });

    if (organization.logo_url && organization.website_url) {
      await copyImageUrlToS3(
        organization.logo_url,
        "logo",
        `${md5(organization.website_url)}`,
      );
    } else {
      console.log(
        "skipping copyImageUrlToS3 as missing data: ",
        organization.logo_url,
        organization.website_url,
      );
    }
  }

  const pp = await prisma.personProfile.findFirst({ where: { email } });
  if (pp) {
    const jobObj = await OpenAiQueue.add(
      "addLlmDescriptionOnPersonProfile",
      pp,
    );
    const { name, id } = jobObj;
    console.log("scheduled addLlmDescriptionOnPersonProfile job: ", pp);
  }

  return apolloEnrichResponseWithLimitInfo;
};

export default enrichContactUsingApollo;

if (require.main === module) {
  (async () => {
    const ans = await enrichContactUsingApollo("sandeep@introhub.net");
    console.log(ans);
  })();
}
