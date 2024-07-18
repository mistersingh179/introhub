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

type IntroducingBothHtmlProps = {
  intro: IntroWithContactFacilitatorAndRequester;
  contactProfiles: Profiles;
  requestProfiles: Profiles;
};

const IntroducingBothHtml = (props: IntroducingBothHtmlProps) => {
  const { intro, contactProfiles, requestProfiles } = props;

  const requesterName = getFirstName(intro.requester.name, "An IntroHub User");
  const contactName = getFirstName(contactProfiles.personProfile.fullName);
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
              margin: "0px",
            }}
          >
            <Text style={{margin: '0px'}}>
              Hi {contactName}, {"I'm"} introducing you to {requesterName}, now{" "}
              {"cc'd"}.
              <br />
              <br />
              {"I'll"} let you two take it from here.
              <br />
              <br />
              Wishing you both a productive discussion!
              <br />
              <br />-{facilitatorName}
            </Text>
          </Container>
        </Body>
      </Html>
    </>
  );
};

const introducingBothHtml = (
  intro: IntroWithContactFacilitatorAndRequester,
  contactProfiles: Profiles,
  requestProfiles: Profiles,
) => {
  return render(
    <IntroducingBothHtml
      intro={intro}
      contactProfiles={contactProfiles}
      requestProfiles={requestProfiles}
    />,
  );
};

export default introducingBothHtml;
