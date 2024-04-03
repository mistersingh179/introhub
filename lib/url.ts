import prisma from "@/prismaClient";
import enrichContact from "@/services/enrichContact";
import md5 from "md5";

export const buildS3ImageUrl = (key:string): string => {
  if(key){
    return `https://introhub.s3.amazonaws.com/${md5(key)}`
  }else{
    return ``
  }
}

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
