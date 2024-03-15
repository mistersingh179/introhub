import { config } from "dotenv";

let initialized = false;

const init = () => {
  if(!initialized){
    initialized = true;
    console.log("in loadEnvVariables");

    let envFile = '.env';
    if(process.env.NODE_ENV === "production"){
      envFile = '.env.production'
    }

    console.log("using envFile: ", envFile);

    const result = config({ debug: true, path: envFile, override: true });
    if (result.error) {
      console.log("UNABLE to parse .ENV file!!!", { err: result.error });
    }
  }
}


export default init