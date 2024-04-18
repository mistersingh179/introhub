import { PersonExperience } from "@prisma/client";
import getEmailAndCompanyUrlProfiles, {
  CompanyUrlToProfile,
  EmailToProfile,
} from "@/services/getEmailAndCompanyUrlProfiles";
import { distance } from "fastest-levenshtein";

const getClosestPersonExp = (
  email: string,
  emailToProfile: EmailToProfile,
  companyUrlToProfile: CompanyUrlToProfile,
): PersonExperience | {} => {
  const personProfile = emailToProfile[email];

  if (!personProfile?.personExperiences) return {};

  const emailDomainName = email.match(/@(.*)/)?.[0]!;

  const bestPe = personProfile.personExperiences.reduce<PersonExperience>(
    (pe, cv) => {
      const exisitngWebsite =
        companyUrlToProfile[pe?.companyLinkedInUrl]?.website ?? "";
      const newWebsite =
        companyUrlToProfile[cv?.companyLinkedInUrl]?.website ?? "";

      const existingDistance = distance(emailDomainName, exisitngWebsite);
      const newDistance = distance(emailDomainName, newWebsite);
      if (newDistance < existingDistance) {
        return cv;
      } else {
        return pe;
      }
    },
    personProfile.personExperiences[0],
  );

  return bestPe;
};

export default getClosestPersonExp;

if (require.main === module) {
  (async () => {
    const email = "rod@introhub.net";
    const { emailToProfile, companyUrlToProfile } =
      await getEmailAndCompanyUrlProfiles([email]);
    const ans = getClosestPersonExp(email, emailToProfile, companyUrlToProfile);
    console.log("getClosestPersonExp: ", ans);
  })();
}
