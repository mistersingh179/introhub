import * as React from "react";
import { render } from "@react-email/render";
import { Profiles } from "@/app/dashboard/introductions/list/IntroTable";
import {
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components";
import { buildS3ImageUrl, getS3Url } from "@/lib/url";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import getFirstName from "@/services/getFirstName";
import { userProfileS3DirName } from "@/app/utils/constants";

type IntroOverviewHtmlProps = {
  intro: IntroWithContactFacilitatorAndRequester;
  contactProfiles: Profiles;
  requestProfiles: Profiles;
  facilitatorProfiles: Profiles;
  facilitatorsPendingIntro: IntroWithContactFacilitatorAndRequester | null;
  facilitatorsPendingIntroContactProfiles: Profiles | null;
};

type ProfileLinkBoxProps = {
  profile: Profiles;
  profileImageUrl?: string | null;
};

const ProfileLinkBox = (props: ProfileLinkBoxProps) => {
  const { profile } = props;
  let { profileImageUrl } = props;

  if (!profileImageUrl) {
    profileImageUrl = buildS3ImageUrl(
      "avatar",
      profile.personProfile.email ?? "",
    );
  }

  return (
    <div>
      <div className={"mb-5"}>
        <img
          className={"rounded-full mr-5"}
          src={profileImageUrl}
          alt={"avatar"}
          width="50"
          height="50"
          referrerPolicy={"no-referrer"}
        />
        <img
          className={"rounded-full"}
          src={buildS3ImageUrl("logo", profile.companyProfile.website ?? "")}
          alt={"logo"}
          width="50"
          height="50"
        />
      </div>
      <div>{profile.personProfile.fullName}</div>
      <div>{profile.personExp.jobTitle}</div>
      <div>{profile.personExp.companyName}</div>
      <div>{profile.companyProfile.industry}</div>
    </div>
  );
};

const IntroOverviewHtml = (props: IntroOverviewHtmlProps) => {
  const {
    intro,
    contactProfiles,
    requestProfiles,
    facilitatorProfiles,
    facilitatorsPendingIntro,
    facilitatorsPendingIntroContactProfiles,
  } = props;
  const requesterName = getFirstName(
    requestProfiles.personProfile.fullName,
    "IntroHub User",
  );
  const contactName = getFirstName(contactProfiles.personProfile.fullName);
  return (
    <>
      <Html lang="en" dir="ltr">
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Preview>
          {requesterName} wants to meet {contactName}
        </Preview>
        <Container>
          <Tailwind>
            <div>
              <h2 className={"text-2xl"}>
                {requesterName} wants to meet {contactName}
              </h2>
              <Hr />
              <h4>Your Contact:</h4>
              <ProfileLinkBox profile={contactProfiles} />
              <Hr />
              <h4>The Requester:</h4>
              <ProfileLinkBox
                profile={requestProfiles}
                profileImageUrl={
                  getS3Url(
                    userProfileS3DirName,
                    intro.requester.profileImageName ?? "",
                  ) || intro.requester.image
                }
              />
              <Hr />
              <div className={"text-center mt-5"}>
                <a
                  href={`${process.env.BASE_API_URL}/dashboard/introductions/list?selectedTab=received-and-pending-my-approval&showIntro=${intro.id}`}
                  target={"_blank"}
                  className={"text-current text-xl"}
                >
                  View more here to Approve or Reject
                </a>
              </div>
              <Hr />
              <h4>Message for you:</h4>
              <div className={"leading-normal"}>
                {intro.messageForFacilitator}
              </div>
              <Hr />
              <h4>
                Pre-drafted message for your contact (
                {contactProfiles.personProfile.fullName}):
              </h4>
              <div className={"leading-normal"}>{intro.messageForContact}</div>
              <Hr />
              <h4>Note:</h4>
              {facilitatorsPendingIntro && (
                <div className={"font-semibold"}>
                  Upon approving this intro request you will earn 1 credit which
                  will in turn email out your pending introduction requests.
                </div>
              )}
              {!facilitatorsPendingIntro && (
                <div className={"font-semibold"}>
                  Upon approving this intro request you will earn 1 credit which
                  you can use to get introductions.
                </div>
              )}
              {facilitatorsPendingIntro &&
                facilitatorsPendingIntroContactProfiles && (
                  <>
                    <h4>
                      This is your pending Request which will go out when you
                      get that credit:
                    </h4>
                    <ProfileLinkBox
                      profile={facilitatorsPendingIntroContactProfiles}
                    />
                  </>
                )}
              <Hr />
            </div>
          </Tailwind>
        </Container>
      </Html>
    </>
  );
};

const introOverviewHtml = (
  intro: IntroWithContactFacilitatorAndRequester,
  contactProfiles: Profiles,
  requestProfiles: Profiles,
  facilitatorProfiles: Profiles,
  facilitatorsPendingIntro: IntroWithContactFacilitatorAndRequester | null,
  facilitatorsPendingIntroContactProfiles: Profiles | null,
) => {
  return render(
    <IntroOverviewHtml
      intro={intro}
      contactProfiles={contactProfiles}
      requestProfiles={requestProfiles}
      facilitatorProfiles={facilitatorProfiles}
      facilitatorsPendingIntro={facilitatorsPendingIntro}
      facilitatorsPendingIntroContactProfiles={
        facilitatorsPendingIntroContactProfiles
      }
    />
  )
};

export default introOverviewHtml;
