import * as React from "react";
import { render } from "@react-email/render";
import {
  Body,
  Container,
  Html,
  Link,
  Section,
  Text,
} from "@react-email/components";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import {
  CompanyUrlToProfile,
  EmailToProfile,
} from "@/services/getEmailAndCompanyUrlProfiles";
import getAllProfiles from "@/services/getAllProfiles";
import { formatDistance, lightFormat, subDays } from "date-fns";
import { IntroStatesKey, IntroStatesWithMeaning } from "@/lib/introStates";

const { BASE_API_URL } = process.env;

type ProfileBoxProps = {
  name: string;
  jobTitle: string;
  companyName: string;
  industry: string;
  linkedInUrl: string;
};
const ProfileBox = (props: ProfileBoxProps) => {
  const { name, jobTitle, companyName, industry, linkedInUrl } = props;
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
      }}
    >
      <tbody>
        <tr>
          <td style={{ fontWeight: "bold" }}>{name}</td>
        </tr>
        {jobTitle && (
          <tr>
            <td style={{ color: "#666" }}>{jobTitle}</td>
          </tr>
        )}
        {companyName && (
          <tr>
            <td style={{ color: "#666" }}>{companyName}</td>
          </tr>
        )}
        {industry && (
          <tr>
            <td style={{ color: "#666" }}>{industry}</td>
          </tr>
        )}
        {linkedInUrl && (
          <tr>
            <td style={{ color: "#666" }}>{linkedInUrl}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

type IntroDigestHtmlProps = {
  introsInYourQueue: IntroWithContactFacilitatorAndRequester[];
  introsWeAreMakingForYou: IntroWithContactFacilitatorAndRequester[];
  emailToProfile: EmailToProfile;
  companyUrlToProfile: CompanyUrlToProfile;
};

const IntroDigestHtml = ({
  introsInYourQueue,
  introsWeAreMakingForYou,
  emailToProfile,
  companyUrlToProfile,
}: IntroDigestHtmlProps) => {
  return (
    <Html>
      <Body>
        <Container
          style={{
            width: "600px",
            maxWidth: "600px",
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            lineHeight: "1.6",
            padding: "20px",
            margin: "0",
          }}
        >
          <h1>Intro Digest</h1>
          <Text>
            Here is a summary of recent introductions involving you. This
            includes introductions we are making for you and introductions
            pending your approval for others.
          </Text>

          {/* Intros We Are Making For You */}
          <Section>
            <h2>Introductions We Are Making for You</h2>
            {introsWeAreMakingForYou.length > 0 ? (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginBottom: "15px",
                }}
              >
                <tbody>
                  {introsWeAreMakingForYou.map((introduction, index) => {
                    const {
                      contactProfiles,
                      requestProfiles,
                      facilitatorProfiles,
                    } = getAllProfiles(
                      introduction,
                      emailToProfile,
                      companyUrlToProfile,
                    );

                    return (
                      <tr key={index}>
                        <td valign={"top"}>
                          <table
                            style={{
                              borderBottom: "1px solid #ddd",
                              paddingBottom: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            <thead>
                              <tr>
                                <th
                                  style={{
                                    width: "50%",
                                    textAlign: "left",
                                    verticalAlign: "top",
                                    fontSize: "18px",
                                  }}
                                >
                                  Prospect
                                </th>
                                <th
                                  style={{
                                    width: "50%",
                                    textAlign: "left",
                                    verticalAlign: "top",
                                    fontSize: "18px",
                                  }}
                                >
                                  Facilitator
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td valign={"top"}>
                                  <ProfileBox
                                    name={
                                      contactProfiles.personProfile?.fullName ||
                                      ""
                                    }
                                    jobTitle={
                                      contactProfiles.personExp?.jobTitle || ""
                                    }
                                    companyName={
                                      contactProfiles.personExp?.companyName ||
                                      ""
                                    }
                                    industry={
                                      contactProfiles.companyProfile
                                        ?.industry || ""
                                    }
                                    linkedInUrl={
                                      contactProfiles.personProfile
                                        ?.linkedInUrl || ""
                                    }
                                  />
                                </td>
                                <td valign={"top"}>
                                  <ProfileBox
                                    name={
                                      facilitatorProfiles.personProfile
                                        ?.fullName ||
                                      introduction.facilitator.name ||
                                      ""
                                    }
                                    jobTitle={
                                      facilitatorProfiles.personExp?.jobTitle ||
                                      ""
                                    }
                                    companyName={
                                      facilitatorProfiles.personExp
                                        ?.companyName || ""
                                    }
                                    industry={
                                      facilitatorProfiles.companyProfile
                                        ?.industry || ""
                                    }
                                    linkedInUrl={
                                      facilitatorProfiles.personProfile
                                        ?.linkedInUrl || ""
                                    }
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td colSpan={2}>
                                  Status:{" "}
                                  {
                                    IntroStatesWithMeaning[
                                      introduction.status as IntroStatesKey
                                    ]
                                  }
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <Text>No recent introductions found.</Text>
            )}

            <h2>Introductions Pending Your Approval</h2>
            {introsInYourQueue.length > 0 ? (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginBottom: "15px",
                }}
              >
                <tbody>
                  {introsInYourQueue.map((introduction, index) => {
                    const {
                      contactProfiles,
                      requestProfiles,
                      facilitatorProfiles,
                    } = getAllProfiles(
                      introduction,
                      emailToProfile,
                      companyUrlToProfile,
                    );

                    return (
                      <tr key={index}>
                        <td>
                          <table
                            style={{
                              borderBottom: "1px solid #ddd",
                              paddingBottom: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            <thead>
                              <tr>
                                <th
                                  style={{
                                    width: "50%",
                                    textAlign: "left",
                                    verticalAlign: "top",
                                    fontSize: "18px",
                                  }}
                                >
                                  Prospect
                                </th>
                                <th
                                  style={{
                                    width: "50%",
                                    textAlign: "left",
                                    verticalAlign: "top",
                                    fontSize: "18px",
                                  }}
                                >
                                  Requester
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td valign={"top"}>
                                  <ProfileBox
                                    name={
                                      contactProfiles.personProfile?.fullName ||
                                      ""
                                    }
                                    jobTitle={
                                      contactProfiles.personExp?.jobTitle || ""
                                    }
                                    companyName={
                                      contactProfiles.personExp?.companyName ||
                                      ""
                                    }
                                    industry={
                                      contactProfiles.companyProfile
                                        ?.industry || ""
                                    }
                                    linkedInUrl={
                                      contactProfiles.personProfile
                                        ?.linkedInUrl || ""
                                    }
                                  />
                                </td>
                                <td valign={"top"}>
                                  <ProfileBox
                                    name={
                                      requestProfiles.personProfile?.fullName ||
                                      introduction.requester.name ||
                                      ""
                                    }
                                    jobTitle={
                                      requestProfiles.personExp?.jobTitle || ""
                                    }
                                    companyName={
                                      requestProfiles.personExp?.companyName ||
                                      ""
                                    }
                                    industry={
                                      requestProfiles.companyProfile
                                        ?.industry || ""
                                    }
                                    linkedInUrl={
                                      requestProfiles.personProfile
                                        ?.linkedInUrl || ""
                                    }
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td colSpan={2}>
                                  Created At:{" "}
                                  {lightFormat(introduction.createdAt, "MM/dd")}
                                  , Hold Ends:{" "}
                                  {formatDistance(
                                    introduction.createdAt,
                                    subDays(new Date(), 7),
                                    {
                                      addSuffix: true,
                                    },
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <Text>No pending introductions in your queue.</Text>
            )}
          </Section>

          {/* Call to Action */}
          <Section>
            <Text>
              To manage introductions pending your approval, visit the dashboard
              by clicking the link below:
            </Text>
            <Link href={`${BASE_API_URL}/dashboard/introductions/pendingQueue`}>
              Manage your Pending Introductions Queue
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const introDigestHtml = (
  introsInYourQueue: IntroWithContactFacilitatorAndRequester[],
  introsWeAreMakingForYou: IntroWithContactFacilitatorAndRequester[],
  emailToProfile: EmailToProfile,
  companyUrlToProfile: CompanyUrlToProfile,
) => {
  return render(
    <IntroDigestHtml
      introsInYourQueue={introsInYourQueue}
      introsWeAreMakingForYou={introsWeAreMakingForYou}
      emailToProfile={emailToProfile}
      companyUrlToProfile={companyUrlToProfile}
    />,
  );
};

export default introDigestHtml;
