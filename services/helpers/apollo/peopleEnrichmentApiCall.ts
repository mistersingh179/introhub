import emailLookupByProxyUrl from "@/services/helpers/proxycurl/emailLookupApiCall";
import loadEnvVariables from "@/lib/loadEnvVariables";

type PeopleEnrichmentApiCall = (
  email: string,
) => Promise<PeopleEnrichmentResponse>;

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

  const status = res.status;
  const dLeft = res.headers.get("x-24-hour-requests-left");
  const hLeft = res.headers.get("x-hourly-requests-left");
  const mLeft = res.headers.get("x-minute-requests-left");

  console.log("peopleEnrichmentCall: ", email, status, dLeft, hLeft, mLeft);

  const data = await res.json();
  console.log("peopleEnrichmentCall: ", email, data);
  return data;
};

export default peopleEnrichmentApiCall;

if (require.main === module) {
  (async () => {
    loadEnvVariables();
    const ans = await peopleEnrichmentApiCall("sandeep@introhub.net");
  })();
}
