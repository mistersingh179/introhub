import loadEnvVariables from "@/lib/loadEnvVariables";
import { ApolloTooManyRequestsError } from "@/services/helpers/apollo/ApolloTooManyRequestsError";

export type ApolloEnrichResponseWithLimitInfo = {
  response: PeopleEnrichmentResponse;
  rateLimitInfo?: ApolloRateLimitInfo;
};

export type PeopleEnrichmentApiCall = (
  email: string,
) => Promise<ApolloEnrichResponseWithLimitInfo>;

const peopleEnrichmentApiCall: PeopleEnrichmentApiCall = async (email) => {
  const url = `https://api.apollo.io/v1/people/match`;
  const body: PeopleEnrichmentRequest = {
    email,
  };

  console.log("peopleEnrichmentApiCall: ", process.env.APOLLO_API_KEY, body);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Cache-Control": "no-cache",
      "X-Api-Key": process.env.APOLLO_API_KEY!,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const rateLimitInfo: ApolloRateLimitInfo = {
    "x-24-hour-requests-left": Number(
      res.headers.get("x-24-hour-requests-left"),
    ),
    "x-24-hour-usage": Number(res.headers.get("x-24-hour-usage")),
    "x-hourly-requests-left": Number(res.headers.get("x-hourly-requests-left")),
    "x-hourly-usage": Number(res.headers.get("x-hourly-usage")),
    "x-minute-requests-left": Number(res.headers.get("x-minute-requests-left")),
    "x-minute-usage": Number(res.headers.get("x-minute-usage")),
    "x-rate-limit-24-hour": Number(res.headers.get("x-rate-limit-24-hour")),
    "x-rate-limit-hourly": Number(res.headers.get("x-rate-limit-hourly")),
    "x-rate-limit-minute": Number(res.headers.get("x-rate-limit-minute")),
  };

  console.log("peopleEnrichmentCall: ", email, res.status, rateLimitInfo);
  if (res.status == 429) {
    console.log("peopleEnrichmentCall got rate limited!");
    throw new ApolloTooManyRequestsError("got 429 from apollo", rateLimitInfo);
  } else {
    const data = (await res.json()) as PeopleEnrichmentResponse;
    console.log("peopleEnrichmentCall: ", email, data);
    return { response: data, rateLimitInfo: rateLimitInfo };
  }
};

export default peopleEnrichmentApiCall;

if (require.main === module) {
  (async () => {
    loadEnvVariables();
    const { response, rateLimitInfo } = await peopleEnrichmentApiCall(
      "sandeep@introhub.net",
    );
    console.log(response, rateLimitInfo);
  })();
}
