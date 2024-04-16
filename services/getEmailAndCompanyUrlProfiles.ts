import {
  Category,
  CompanyProfile,
  CompanyProfileCategory,
  Contact,
  PersonExperience,
  PersonProfile,
} from "@prisma/client";
import getContactStats from "@/services/getContactStats";
import prisma from "@/prismaClient";

export type PersonProfileWithExp = PersonProfile & {
  personExperiences: PersonExperience[];
};
export type CompanyProfileWithCategories = CompanyProfile & {
  categories: (CompanyProfileCategory & { category: Category })[];
};

export type EmailToProfile = Record<string, PersonProfileWithExp>;
export type CompanyUrlToProfile = Record<string, CompanyProfileWithCategories>;

// todo - rename as it no longer takes emails but contacts
const getEmailAndCompanyUrlProfiles = async (
  emails: string[],
): Promise<{
  companyUrlToProfile: CompanyUrlToProfile;
  emailToProfile: EmailToProfile;
}> => {
  console.log("In getContactsMetaData: ", emails.length);
  console.log(emails);
  const personProfiles: PersonProfileWithExp[] =
    await prisma.personProfile.findMany({
      where: {
        email: {
          in: emails,
        },
      },
      include: {
        personExperiences: {
          take: 1,
        },
      },
    });
  const emailToProfile = personProfiles.reduce<EmailToProfile>((acc, pp) => {
    acc[pp.email] = pp;
    return acc;
  }, {});
  console.log(emailToProfile);
  const companyLinkedInUrls = personProfiles
    .map((pp) => pp.personExperiences[0]?.companyLinkedInUrl)
    .filter((x) => x);
  console.log(companyLinkedInUrls);
  const companyProfiles: CompanyProfileWithCategories[] =
    await prisma.companyProfile.findMany({
      where: {
        linkedInUrl: {
          in: companyLinkedInUrls,
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
  const companyUrlToProfile = companyProfiles.reduce<CompanyUrlToProfile>(
    (acc, cp) => {
      acc[cp.linkedInUrl] = cp;
      return acc;
    },
    {},
  );
  console.log("companyUrlToProfile: ", companyUrlToProfile);
  return { companyUrlToProfile, emailToProfile };
};

export default getEmailAndCompanyUrlProfiles;

if (require.main === module) {
  (async () => {
    const contacts = await prisma.contact.findMany({
      take: 15,
    });
    const metaData = await getEmailAndCompanyUrlProfiles(contacts.map((c) => c.email));
    console.log("getContactsMetaData: ", metaData);
  })();
}
