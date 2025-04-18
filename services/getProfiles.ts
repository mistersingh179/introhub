import {
  CompanyUrlToProfile,
  EmailToProfile,
} from "@/services/getEmailAndCompanyUrlProfiles";
import getClosestPersonExp from "@/services/helpers/getClosestPersonExp";
import { PersonExperience, PersonProfile } from "@prisma/client";
import { Profiles } from "@/app/dashboard/introductions/list/IntroTable";

// Helper function to get the most up-to-date value, preferring user-edited data
function getLatestValue<T>(userEdited: T | null | undefined, original: T | null | undefined): T | null {
  return (userEdited !== null && userEdited !== undefined) ? userEdited : (original ?? null);
}

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

  // Apply user-edited fields on top of existing data if they exist
  let enhancedProfile = personProfile;
  if (personProfile) {
    enhancedProfile = {
      ...personProfile,
      fullName: getLatestValue(personProfile.userEditedFullName, personProfile.fullName),
      linkedInUrl: getLatestValue(personProfile.userEditedLinkedInUrl, personProfile.linkedInUrl),
      headline: getLatestValue(personProfile.userEditedHeadline, personProfile.headline),
      city: getLatestValue(personProfile.userEditedCity, personProfile.city),
      country: getLatestValue(personProfile.userEditedCountry, personProfile.country),
      state: getLatestValue(personProfile.userEditedState, personProfile.state),
      seniority: getLatestValue(personProfile.userEditedSeniority, personProfile.seniority),
    };
  }

  // Apply user-edited fields on top of experience data if they exist
  const enhancedExperience = {
    ...personExp,
    companyName: getLatestValue(personExp.userEditedCompanyName, personExp.companyName),
    companyLinkedInUrl: getLatestValue(personExp.userEditedCompanyLinkedInUrl, personExp.companyLinkedInUrl),
    jobTitle: getLatestValue(personExp.userEditedJobTitle, personExp.jobTitle),
    jobDescription: getLatestValue(personExp.userEditedJobDescription, personExp.jobDescription),
  };

  // Handle possible null/undefined companyLinkedInUrl
  const companyLinkedInUrl = enhancedExperience.companyLinkedInUrl || "";
  const companyProfile = companyUrlToProfile[companyLinkedInUrl] || {};
  
  return { 
    personProfile: enhancedProfile, 
    personExp: enhancedExperience as PersonExperience, 
    companyProfile 
  };
};

export default getProfiles;
