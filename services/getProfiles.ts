import {
  CompanyUrlToProfile,
  EmailToProfile,
} from "@/services/getEmailAndCompanyUrlProfiles";
import getClosestPersonExp from "@/services/helpers/getClosestPersonExp";
import { PersonExperience } from "@prisma/client";
import { Profiles } from "@/app/dashboard/introductions/list/IntroTable";

const getProfiles = (
  email: string,
  emailToProfile: EmailToProfile,
  companyUrlToProfile: CompanyUrlToProfile,
): Profiles => {
  const personProfile = emailToProfile[email];
  const personExp = (getClosestPersonExp(
    email,
    emailToProfile,
    companyUrlToProfile,
  ) ?? {}) as PersonExperience;

  // personProfile?.personExperiences?.[0] ?? {};

  const companyProfile =
    companyUrlToProfile[personExp.companyLinkedInUrl] || {};
  return { personProfile, personExp, companyProfile };
};

export default getProfiles;
