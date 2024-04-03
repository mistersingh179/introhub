import { Contact, Prisma } from "@prisma/client";
import emailLookupApiReponse from "@/services/emailLookupApiReponse";
import prisma from "@/prismaClient";
import PersonProfileCreateInput = Prisma.PersonProfileCreateInput;
import companyLookupApiResponse from "@/services/companyLookupApiResponse";
import slashes from "remove-trailing-slash";
import copyImageUrlToS3 from "@/services/helpers/copyImageUrlToS3";
import md5 from "md5";

export type EnrichContactInput = {
  contact: Contact;
};

type EnrichContact = (input: EnrichContactInput) => Promise<void>;
const enrichContact: EnrichContact = async (input) => {
  const { contact } = input;

  /*
  1. build person profile - email, linkedInUrl, fullName, city, country & state, lastUpdateAt
  2. build person experiences - companyName, companyLinkedInUrl, jobTitle, jobDescription, lastUpdateAt
  3. build company profile - inkedInUrl, website, sizeFrom, sizeTo, size, industry, foundedYear, lastUpdateAt
  4. build company categories - name
   */

  const personProfile = await prisma.personProfile.findFirst({
    where: {
      email: contact.email,
    },
  });
  if (personProfile) {
    console.log("bailing as personProfile already exists for: ", contact.email);
    return;
  }

  const personData = await emailLookupApiReponse(contact.email);
  const experiences = personData.profile?.experiences ?? [];
  const profileUrl = personData.profile?.profile_pic_url ?? null;
  const curExperiences = experiences.filter((exp: any) => exp.ends_at === null);

  console.log("personData: ", personData);
  await prisma.personProfile.create({
    data: {
      email: contact.email,
      linkedInUrl: personData.linkedin_profile_url,
      fullName: personData.profile?.full_name,
      city: personData.profile?.city,
      country: personData.profile?.country,
      state: personData.profile?.state,
      lastUpdatedAt: personData.last_updated ?? undefined,
      personExperiences: {
        create: curExperiences.map((exp: any) => ({
          companyLinkedInUrl: exp.company_linkedin_profile_url,
          companyName: exp.company,
          jobDescription: exp.description,
          jobTitle: exp.title,
        })),
      },
    },
  });

  if(profileUrl){
    await copyImageUrlToS3(profileUrl, md5(contact.email));
  }

  for (const exp of curExperiences) {
    const linkedInUrl = exp.company_linkedin_profile_url;
    const companyProfile = await prisma.companyProfile.findFirst({
      where: {
        linkedInUrl,
      },
    });
    if (companyProfile) {
      console.log("skipping as companyProfile already exists:", companyProfile);
      continue;
    }

    const companyData = await companyLookupApiResponse(linkedInUrl);
    const categories = companyData.categories;
    const companyLogoUrl = companyData.profile_pic_url;

    await prisma.companyProfile.create({
      data: {
        linkedInUrl,
        website: companyData.website,
        sizeFrom: companyData.company_size?.[0],
        sizeTo: companyData.company_size?.[1],
        size: companyData.company_size_on_linkedin,
        industry: companyData.industry,
        foundedYear: companyData.founded_year,
        categories: {
          create: categories.map((c: string) => ({
            category: {
              connectOrCreate: {
                create: {
                  name: c,
                },
                where: {
                  name: c,
                },
              },
            },
          })),
        },
      },
    });

    if(companyLogoUrl && companyData.website){
      await copyImageUrlToS3(companyLogoUrl, md5(companyData.website))
    }else{
      console.log("skipping copyImageUrlToS3 as missing data: ", companyLogoUrl, companyData.website);
    }
  }
};

export default enrichContact;

if (require.main === module) {
  (async () => {
    const contact = await prisma.contact.findFirstOrThrow({
      where: {
        email: "sandeep@brandweaver.ai",
      },
    });
    const ans = await enrichContact({ contact });
    console.log("ans: ", ans);
  })();
}
