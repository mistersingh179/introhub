import * as React from "react";
import { render } from "@react-email/render";
import { Profiles } from "@/app/dashboard/introductions/list/IntroTable";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import getFirstName from "@/services/getFirstName";
import { Body, Container, Html, Text } from "@react-email/components";

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

  const contactLlmDescription = contactProfiles.personProfile.llmDescription;
  const requesterLlmDescription = requestProfiles.personProfile.llmDescription;

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
            <Text style={{ margin: "0px" }}>
              Hi {contactName},<br />
              <br />
              {"I'd"} like to introduce you to {requesterName}, who is now{" "}
              {"cc'd"} on this email. <br />
              <br />
              Wishing you both a productive discussion! <br />
              <br />
              -{facilitatorName}
            </Text>
            {contactLlmDescription && (
              <Text>
                ---------------------------- <br />
                <br />About {contactName}:<br />
                {contactLlmDescription}
              </Text>
            )}
            {requesterLlmDescription && (
              <Text>
                ---------------------------- <br />
                <br />About {requesterName}:<br />
                {requesterLlmDescription}
              </Text>
            )}
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
