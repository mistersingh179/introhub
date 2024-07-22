import * as React from "react";
import { render } from "@react-email/render";
import { Profiles } from "@/app/dashboard/introductions/list/IntroTable";
import { buildS3ImageUrl, getS3Url } from "@/lib/url";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import getFirstName from "@/services/getFirstName";
import { userProfileS3DirName } from "@/app/utils/constants";
import {
  Html,
  Body,
  Container,
  Text,
  Link,
  Section,
} from "@react-email/components";

const { BASE_API_URL } = process.env;

type AskPermissionToMakeIntroHtmlProps = {
  intro: IntroWithContactFacilitatorAndRequester;
  contactProfiles: Profiles;
  requestProfiles: Profiles;
};

const AskPermissionToMakeIntroHtml = (
  props: AskPermissionToMakeIntroHtmlProps,
) => {
  const { intro, contactProfiles, requestProfiles } = props;
  const requesterName = getFirstName(
    requestProfiles.personProfile.fullName,
    "An IntroHub User",
  );
  const requesterLinkedInUrl = requestProfiles.personProfile.linkedInUrl;
  const contactName = getFirstName(contactProfiles.personProfile.fullName);
  const contactCompanyName = contactProfiles.personExp.companyName;
  const facilitatorName = getFirstName(intro.facilitator.name);

  return (
    <>
      <Html>
        <Body>
          <Container
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: "14px",
              lineHeight: "1.6",
              textAlign: "left",
              padding: "0 10px",
              margin: "0px",
            }}
          >
            <Text>
              Hi {contactName},
              <br />
              <br />
              <Link
                href={`${requesterLinkedInUrl}`}
                style={{ color: "blue", textDecoration: "underline" }}
              >
                {requesterName}
              </Link>{" "}
              reached out to me asking for an introduction to you. Before I make
              the intro I wanted to check-in with you and confirm that you are
              okay with me introducing you.
            </Text>
            <Text
              style={{
                marginLeft: "20px",
                borderLeft: "2px solid #ccc",
                paddingLeft: "10px",
                color: "#555",
              }}
            >
              Hi {facilitatorName}, I noticed {"you're"} connected to{" "}
              {contactName}. {"I'm"} really impressed by their work at{" "}
              {contactCompanyName}.
              <br />
              <br />
              Can you introduce us? {"I'm"} looking for a 15-minute chat to hear{" "}
              their thoughts.
            </Text>
            <Text>
              Please click below to let me know if you are okay with me
              introducing you and I will act accordingly.
            </Text>
            <Section>
              <Link
                href={`${BASE_API_URL}/api/intros/${intro.id}/approve?approvalKey=${intro.approvalKey}`}
                style={{ color: "blue", textDecoration: "underline" }}
              >
                Sure, make the intro
              </Link>
              <br />
              <Link
                href={`${BASE_API_URL}/api/intros/${intro.id}/reject?approvalKey=${intro.approvalKey}`}
                style={{ color: "blue", textDecoration: "underline" }}
              >
                No, don{"'"}t make the intro
              </Link>
            </Section>
            <br />- {facilitatorName}
            <br />
            <br />
            p.s. {"I'm"} using{" "}
            <Link
              href={`https://introhub.net`}
              style={{ color: "blue", textDecoration: "underline" }}
            >
              introhub
            </Link>{" "}
            to help manage introductions i make.
          </Container>
        </Body>
      </Html>
    </>
  );
};

const askPermissionToMakeIntroHtml = (
  intro: IntroWithContactFacilitatorAndRequester,
  contactProfiles: Profiles,
  requestProfiles: Profiles,
) => {
  return render(
    <AskPermissionToMakeIntroHtml
      intro={intro}
      contactProfiles={contactProfiles}
      requestProfiles={requestProfiles}
    />,
  );
};

export default askPermissionToMakeIntroHtml;
