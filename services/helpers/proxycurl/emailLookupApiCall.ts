import { ProxyCurlError } from "@/services/helpers/proxycurl/ProxyCurlError";

type EmailLookupApiCall = (email: string) => Promise<Record<string, any>>;

const emailLookupByProxyUrl: EmailLookupApiCall = async (email) => {
  const baseUrl = "https://nubela.co/proxycurl";
  const url = `api/linkedin/profile/resolve/email`;

  const params = new URLSearchParams({
    enrich_profile: "enrich",
    lookup_depth: "deep",
    email,
  });

  const fullUrl = `${baseUrl}/${url}?${params}`;

  const res = await fetch(fullUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${process.env.PROXY_CURL_TOKEN}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  console.log(
    "emailLookupByProxyUrl: ",
    email,
    res.status,
    res.headers.get("X-Proxycurl-Credit-Cost"),
  );

  // throwing an error because these requests are fee and we want to retry!
  if ([400, 401, 403, 429, 500, 503].includes(res.status)) {
    throw new ProxyCurlError("error: " + res.status + " email: " + email, {
      email,
      code: res.status,
      cost: res.headers.get("X-Proxycurl-Credit-Cost"),
    });
  }

  let data = {};
  try{
    data = await res.json();
  }catch(err){
    console.log("emailLookupByProxyUrl invalid json: ", email, data);
    data = {};
  }

  console.log("emailLookupByProxyUrl: ", email, data);

  return data;
};

export default emailLookupByProxyUrl;

if (require.main === module) {
  (async () => {
    await emailLookupByProxyUrl("sandeep@brandweaver.ai");
  })();
}
