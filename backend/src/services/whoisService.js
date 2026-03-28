import axios from "axios";

export const getDomainAge = async (domain) => {
  try {
    const res = await axios.get(
      `https://www.whoisxmlapi.com/whoisserver/WhoisService`,
      {
        params: {
          apiKey: process.env.WHOIS_API_KEY,
          domainName: domain,
          outputFormat: "JSON",
        },
      }
    );

    const createdDate =
      res.data.WhoisRecord?.createdDate ||
      res.data.WhoisRecord?.registryData?.createdDate;

    if (!createdDate) return null;

    const created = new Date(createdDate);
    const now = new Date();

    const ageInDays = (now - created) / (1000 * 60 * 60 * 24);

    return ageInDays;
  } catch (err) {
    console.log("WHOIS error:", err.message);
    return null;
  }
};