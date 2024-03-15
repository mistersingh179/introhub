import { config } from "dotenv";

let initialized = false;

const init = () => {
  if(!initialized){
    initialized = true;
    console.log("in loadEnvVariables");

    if(process.env.NEXT_RUNTIME === "edge"){
      console.log("skipping loading of env as in EDGE environment");
      return;
    }

    let envFile = '.env';
    if(process.env.NODE_ENV === "production"){
      envFile = '.env.production'
    }

    const result = config({ debug: true, path: envFile, override: true });
    if (result.error) {
      console.log("UNABLE to parse .ENV file!!!", { err: result.error });
    }
  }
}


export default init