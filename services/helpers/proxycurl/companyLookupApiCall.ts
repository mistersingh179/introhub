import { ProxyCurlError } from "@/services/helpers/proxycurl/ProxyCurlError";

type CompanyLookupApiCall = (
  linkedInProfileUrl: string,
) => Promise<Record<string, any>>;

const companyLookupByProxyUrl: CompanyLookupApiCall = async (input) => {
  const linkedInProfileUrl = input;

  const baseUrl = "https://nubela.co/proxycurl";
  const url = `api/linkedin/company`;

  const params = new URLSearchParams({
    url: linkedInProfileUrl,
    categories: "include",
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

export default companyLookupByProxyUrl;

if (require.main === module) {
  (async () => {
    await companyLookupByProxyUrl(
      "https://www.linkedin.com/company/new-relic-inc-/",
    );
  })();
}
