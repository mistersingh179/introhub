import redisClient from "@/lib/redisClient";
import { randomUUID } from "node:crypto";

type AccquireLock = (key: string, milliSeconds: number) => Promise<boolean>;

const accquireLock: AccquireLock = async (key, milliSeconds) => {
  const value = randomUUID();
  const ans = await redisClient.set(key, value, "PX", milliSeconds, "NX" );
  if(ans === "OK"){
    console.log("got lock", ans, key, value);
    return true;
  }else{
    console.log("unable to get lock", ans, key, value);
    return false;
  }
};

export default accquireLock;
