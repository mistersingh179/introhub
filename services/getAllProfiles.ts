import {IntroWithContactFacilitatorAndRequester} from "@/app/dashboard/introductions/list/page";
import {CompanyUrlToProfile, EmailToProfile} from "@/services/getEmailAndCompanyUrlProfiles";
import getProfiles from "@/services/getProfiles";

const getAllProfiles = (
  introduction: IntroWithContactFacilitatorAndRequester,
  emailToProfile: EmailToProfile,
  companyUrlToProfile: CompanyUrlToProfile,
) => {
  const contactProfiles = getProfiles(
    introduction.contact.email,
    emailToProfile,
    companyUrlToProfile,
  );
  const requestProfiles = getProfiles(
    introduction.requester.email!,
    emailToProfile,
    companyUrlToProfile,
  );
  const facilitatorProfiles = getProfiles(
    introduction.facilitator.email!,
    emailToProfile,
    companyUrlToProfile,
  );
  return { contactProfiles, requestProfiles, facilitatorProfiles };
};

export default getAllProfiles;