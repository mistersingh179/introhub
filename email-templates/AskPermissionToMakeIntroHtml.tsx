import * as React from "react";
import { render } from "@react-email/render";
import { Profiles } from "@/app/dashboard/introductions/list/IntroTable";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import getFirstName from "@/services/getFirstName";
import { defaultForwardableBlurb } from "@/app/utils/constants";
import {
  Body,
  Container,
  Html,
  Link,
  Section,
  Text,
} from "@react-email/components";

const { BASE_API_URL, ZROK_BASE_API_URL } = process.env;

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
  const prospectName = getFirstName(contactProfiles.personProfile.fullName);
  const prospectCompanyName = contactProfiles.personExp.companyName ?? "";
  const facilitatorName = getFirstName(intro.facilitator.name);

  let forwardableBlurb =
    intro.requester.forwardableBlurb || defaultForwardableBlurb;
  forwardableBlurb = forwardableBlurb.replaceAll(
    "{facilitator-name}",
    facilitatorName,
  );
  forwardableBlurb = forwardableBlurb.replaceAll(
    "{prospect-name}",
    prospectName,
  );
  forwardableBlurb = forwardableBlurb.replaceAll(
    "{prospect-company-name}",
    prospectCompanyName,
  );

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
              Hi {prospectName},
              <br />
              <br />
              {requesterName} asked me for an introduction to you. Is that OK{" "}
              with you? <br />
            </Text>
            <Text>
              {"Here's"} some context:
            </Text>
            <Text
              style={{
                marginLeft: "20px",
                borderLeft: "2px solid #ccc",
                paddingLeft: "10px",
                color: "#555",
              }}
            >
              {forwardableBlurb}
              {/*Hi {facilitatorName}, I noticed {"you're"} connected to{" "}*/}
              {/*{contactName}. {"I'm"} really impressed by their work at{" "}*/}
              {/*{contactCompanyName}.*/}
              {/*<br />*/}
              {/*<br />*/}
              {/*Can you introduce us? {"I'm"} looking for a 15-minute chat to hear{" "}*/}
              {/*their thoughts.*/}
            </Text>
            <Text>
              {"Here's"} LinkedIn:{" "}
              <Link
                href={`${requesterLinkedInUrl}`}
                style={{ color: "blue", textDecoration: "underline" }}
              >
                {requesterLinkedInUrl}
              </Link>{" "}
            </Text>
            <Text>
              Let me know yes or no and {"I'll"} accordingly handle it.
            </Text>
            - {facilitatorName}
            <br />
            <br />
            p.s. {"I'm"} using an automated system to manage these emails.{" "}
            {/*<br />*/}
            {/*<br />*/}
            {/*<img*/}
            {/*  src={`${process.env.NODE_ENV === "development" ? ZROK_BASE_API_URL : BASE_API_URL}/api/intros/${intro.id}/opened`}*/}
            {/*  alt=""*/}
            {/*></img>*/}
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
