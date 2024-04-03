
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
  console.log(fullUrl);

  const res = await fetch(fullUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${process.env.PROXY_CURL_TOKEN}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  console.log(res.status, res.headers.get("X-Proxycurl-Credit-Cost"));
  const data = await res.json();
  console.log("data: ", data);
  if (data.code >= 400) {
    throw new ProxyCurlError(data.description, data);
  }
  return data;
};

export default emailLookupByProxyUrl;

if (require.main === module) {
  (async () => {
    await emailLookupByProxyUrl("sandeep@brandweaver.ai");
  })();
}
