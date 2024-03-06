import Redis from "ioredis";
import { config } from "dotenv";

const result = config({ debug: true });
if (result.error) {
  console.log("UNABLE to parse .ENV file!!!", { err: result.error });
}

const REDIS_URL = String(process.env.REDIS_URL) ?? "";

console.log("at boot up got REDIS_URL: ", REDIS_URL);

export const redisClient = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  retryStrategy: function (times: number) {
    return Math.max(Math.min(Math.exp(times), 20000), 1000);
  },
});

// this prevents node warning which comes from many workers adding listeners to the same redis connection
redisClient.setMaxListeners(100);

export default redisClient;
