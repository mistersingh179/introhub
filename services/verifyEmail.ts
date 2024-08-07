const baseUrl = "https://api-us.zerobounce.net";
const url = `v2/validate`;
const { ZERO_BOUNCE_API_KEY } = process.env;

const verifyEmail = async (email: string): Promise<boolean> => {
  const params = new URLSearchParams({
    email: email,
    ip: "",
    api_key: ZERO_BOUNCE_API_KEY ?? "",
    timeout: "5",
  });

  const fullUrl = `${baseUrl}/${url}?${params}`;
  console.log("zero bounce url: ", fullUrl);

  try {
    const resp = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    console.log("zerobounce api response: ", resp.status);
    const ans: ValidateEmailApiResponse = await resp.json();

    if ("error" in ans) {
      console.error("Error: ", ans);
      return true;
    } else {
      console.log("Email validation successful: ", ans);
      return ans.status === "valid";
    }
  } catch (err) {
    console.log("got error when fetching zero bounce api: ", err);
    return true;
  }
};

export default verifyEmail;

if (require.main === module) {
  (async () => {
    const ans = await verifyEmail("invalid@example.com");
    console.log("ans: ", ans);
  })();
}
