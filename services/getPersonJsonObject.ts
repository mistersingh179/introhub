import { PersonProfile } from "@prisma/client";
import prisma from "@/prismaClient";

const getPersonJsonObject = async (
  personProfile: PersonProfile,
): Promise<null | Record<string, any>> => {
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
          companyLinkedInUrl: true,
        },
      },
    },
  });

  (
    personJsonObject as typeof personJsonObject & { jobFunctions: string[] }
  ).jobFunctions = personJsonObject.workFunctions.map(
    (wf) => wf.workFunction.name.split("_").join(" "),
  );
  delete (personJsonObject as Partial<typeof personJsonObject>).workFunctions;

  (
    personJsonObject as typeof personJsonObject & {
      professionalDepartments: string[];
    }
  ).professionalDepartments = personJsonObject.departments.map(
    (d) => d.department.name.split("_").join(" "),
  );
  delete (personJsonObject as Partial<typeof personJsonObject>).departments;

  if (personJsonObject.personExperiences.length === 0) {
    console.log("bailing getPersonDescription as no personExperiences found");
    return null;
  }

  const companies = await prisma.companyProfile.findMany({
    where: {
      linkedInUrl: {
        in: personJsonObject.personExperiences.map(
          (pe) => pe.companyLinkedInUrl,
        ),
      },
    },
    select: {
      size: true,
      industry: true,
      foundedYear: true,
      latestFundingRoundDate: true,
      latestFundingStage: true,
      publiclyTradedExchange: true,
      linkedInUrl: true,
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
  });

  if (companies.length === 0) {
    console.log("bailing getPersonDescription as no companyJsonObject found");
    return null;
  }

  for (const c of companies) {
    (c as typeof c & { marketCategories: string[] }).marketCategories =
      c.categories.map((cat) => cat.category.name);
    delete (c as Partial<typeof c>).categories;
  }

  let companiesHash: Record<string, any> = {};
  companiesHash = [...companies].reduce((acc, cv, ci, arr) => {
    const { linkedInUrl, ...rest } = cv;
    acc[linkedInUrl] = rest;
    return acc;
  }, companiesHash);

  personJsonObject.personExperiences.map((pe) => {
    (pe as typeof pe & { company?: Record<string, any> }).company =
      companiesHash[pe.companyLinkedInUrl];
    delete (pe as Partial<typeof pe>).companyLinkedInUrl;
  });

  (
    personJsonObject as typeof personJsonObject & {
      workExperiences: any;
    }
  ).workExperiences = personJsonObject.personExperiences;
  delete (personJsonObject as Partial<typeof personJsonObject>)
    .personExperiences;

  console.dir(personJsonObject, { depth: 6 });

  return personJsonObject;
};

export default getPersonJsonObject;

if (require.main === module) {
  (async () => {
    const personProfile = await prisma.personProfile.findFirstOrThrow({
      where: {
        // email: "stanley.wu@hashkey.com",
        // email: "nick@achieveintelligence.ai",
        // email: "sandeep@google.com",
        email: "sandeep@introhub.net",
      },
    });

    const ans = await getPersonJsonObject(personProfile);
    console.dir(ans, { depth: 20 });
  })();
}
