import redisClient from "@/lib/redisClient";
import prisma from "@/prismaClient";
import getGmailObject from "@/services/helpers/getGmailObject";

/* 
  This will allow up to 25 requests in a second, regardless of where they are in the second mark.
  An issue is that it will allow 25 rwquests at the 49.99 second mark and then another 25 on 50.01 mark.
  This when looked from a sliding window perspective is too many requests in a 1-second timeframe.
  */

type ProcessRateLimitedRequest = (
  accountId: string,
  quotaUnits: number,
) => Promise<boolean>;

const quotaUnitsLimitPerUserPerSecond = 250;

const processRateLimitedRequest: ProcessRateLimitedRequest = async (
  accountId,
  quotaUnits,
) => {
  const timeInSeconds = Math.floor(Date.now() / 1000);
  const key = `googleapi:account:${accountId}:${timeInSeconds}`;
  const result = await redisClient
    .multi()
    .incrby(key, quotaUnits)
    .expire(key, 60) // keeping keys around for 60 seconds for debugging
    .exec();
  if (
    result &&
    result.length == 2 &&
    result[0][0] === null &&
    result[1][0] == null
  ) {
    console.log("successfully ran redis incr for rate limiting: ", key);
    const quotaUsed = result[0][1];
    console.log(`new count:`, quotaUsed);
    if (Number(quotaUsed) <= quotaUnitsLimitPerUserPerSecond) {
      console.log("*** got lock. quota count now now: ", quotaUsed);
      return true;
    } else {
      console.log("*** unable to get lock. count is now: ", quotaUsed);
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
        const goodToGo = await processRateLimitedRequest("abc", 50);
        console.log(goodToGo);
      });
  })();
}
