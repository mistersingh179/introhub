import redisClient from "@/lib/redisClient";

(async () => {
  console.log(redisClient);
  console.log("foo: ", process.env.NODE_ENV, process.env.REDIS_URL, process.env.DATABASE_URL);
})();