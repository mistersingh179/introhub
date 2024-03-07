import redisClient from "@/lib/redisClient";
import prisma from "@/prismaClient";
import getGmailObject from "@/services/helpers/getGmailObject";

/* 
  This will allow up to 25 requests in a second, regardless of where they are in the second mark.
  An issue is that it will allow 25 rwquests at the 49.99 second mark and then another 25 on 50.01 mark.
  This when looked from a sliding window perspective is too many requests in a 1-second timeframe.
  */

type ProcessRateLimitedRequest = (keySuffix: string) => Promise<boolean>;

const processRateLimitedRequest: ProcessRateLimitedRequest = async (
  keySuffix,
) => {
  const allowedNumber = 25;
  const timeInSeconds = Math.floor(Date.now() / 1000);
  const key = `${keySuffix}:${timeInSeconds}`;
  const result = await redisClient.multi().incr(key).expire(key, 10).exec();
  if (
    result &&
    result.length == 2 &&
    result[0][0] === null &&
    result[1][0] == null
  ) {
    console.log("successfully ran redis incr for rate limiting: ", key);
    const newCount = result[0][1];
    console.log(`new count:`, newCount);
    if (Number(newCount) < allowedNumber) {
      return true;
    } else {
      return false;
    }
  } else {
    throw new Error("unable to check rate limit");
  }
};

export default processRateLimitedRequest;

if (require.main === module) {
  (async () => {
    Array(5)
      .fill(0)
      .map(async (x) => {
        const goodToGo = await processRateLimitedRequest("abc");
        console.log(goodToGo);
      });
  })();
}
