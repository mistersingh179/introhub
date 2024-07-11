import prisma from "@/prismaClient";
import enrichContact from "@/services/enrichContact";
import md5 from "md5";

// const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME;
const cloutFrontDomain = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN;

export const getS3Url = (dirName: string, key?: string): string => {
  return key ? `https://${cloutFrontDomain}/${dirName}/${key}` : ``;
};

export const buildS3ImageUrl = (dirName: string, key: string): string => {
  if (key) {
    // return `https://${bucketName}.s3.amazonaws.com/${dirName}/${md5(key)}`
    return `https://${cloutFrontDomain}/${dirName}/${md5(key)}`;
  } else {
    return ``;
  }
};

type UrlProperties = {
  origin: string;
  originWithPathName: string;
};

export const getUrlProperties = (url: string): UrlProperties => {
  const urlObj = new URL(url);
  const origin = urlObj.origin;
  let originWithPathName = urlObj.origin + urlObj.pathname;
  if (originWithPathName.endsWith("/")) {
    originWithPathName = originWithPathName.slice(0, -1);
  }
  return { origin, originWithPathName };
};

export const getCleanUrl = (
  url: string | null | undefined,
): string | undefined => {
  if (!url) {
    return undefined;
  }
  try {
    const { originWithPathName } = getUrlProperties(url);
    return originWithPathName;
  } catch (err) {
    console.log("got error while cleaning url: ", url);
  }
  return "";
};

if (require.main === module) {
  (async () => {
    const ans = getCleanUrl(null);
    console.log("ans: ", ans);
  })();
}
