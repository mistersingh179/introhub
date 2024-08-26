import loadEnvVariables from "@/lib/loadEnvVariables";
import { ApolloTooManyRequestsError } from "@/services/helpers/apollo/ApolloTooManyRequestsError";

export type ApolloEnrichResponseWithLimitInfo = {
  response: PeopleEnrichmentResponse;
  rateLimitInfo?: ApolloRateLimitInfo;
};

export type PeopleEnrichmentByLinkedinUrlApiCall = (
  linkedInUrl: string,
) => Promise<ApolloEnrichResponseWithLimitInfo>;

const peopleEnrichmentByLinkedinUrlApiCall: PeopleEnrichmentByLinkedinUrlApiCall =
  async (linkedInUrl) => {

    const url = `https://api.apollo.io/v1/people/match`;
    const body: PeopleEnrichmentRequest = {
      linkedin_url: linkedInUrl,
    };

    // console.log("peopleEnrichmentByLinkedinUrlApiCall: ", process.env.APOLLO_API_KEY, body);

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
      "x-hourly-requests-left": Number(
        res.headers.get("x-hourly-requests-left"),
      ),
      "x-hourly-usage": Number(res.headers.get("x-hourly-usage")),
      "x-minute-requests-left": Number(
        res.headers.get("x-minute-requests-left"),
      ),
      "x-minute-usage": Number(res.headers.get("x-minute-usage")),
      "x-rate-limit-24-hour": Number(res.headers.get("x-rate-limit-24-hour")),
      "x-rate-limit-hourly": Number(res.headers.get("x-rate-limit-hourly")),
      "x-rate-limit-minute": Number(res.headers.get("x-rate-limit-minute")),
    };

    console.log(
      "peopleEnrichmentByLinkedinUrlApiCall: ",
      new Date(),
      linkedInUrl,
      res.status,
      rateLimitInfo,
    );
    if (res.status == 429) {
      console.log("peopleEnrichmentByLinkedinUrlApiCall got rate limited!");
      throw new ApolloTooManyRequestsError(
        "got 429 from apollo",
        rateLimitInfo,
      );
    } else {
      const data = (await res.json()) as PeopleEnrichmentResponse;
      console.log("peopleEnrichmentByLinkedinUrlApiCall: ", linkedInUrl, data);
      return { response: data, rateLimitInfo: rateLimitInfo };
    }
  };

export default peopleEnrichmentByLinkedinUrlApiCall;

if (require.main === module) {
  (async () => {
    loadEnvVariables();
    const { response, rateLimitInfo } =
      await peopleEnrichmentByLinkedinUrlApiCall(
        "https://www.linkedin.com/in/sandeeparneja",
      );
    console.log(response, rateLimitInfo);
  })();
}
