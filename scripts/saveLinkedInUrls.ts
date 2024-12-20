import creds from "./introhub-276d729d73d8.json";
import {JWT} from "google-auth-library";
import {GoogleSpreadsheet} from "google-spreadsheet";
import prisma from "@/prismaClient";
import manuallyConnectEmailAndPeopleEnrichment from "@/services/manuallyConnectEmailAndPeopleEnrichment";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  // console.log(query, params);
  // console.log({ timestamp, params, duration, target });
});

(async () => {
  console.log("saveLinkedInUrls");

  const SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file",
  ];

  const jwt = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: SCOPES,
  });

  const doc = new GoogleSpreadsheet(
    // "1AfB8HJ498AOMD-n2g6AaNniJZZXQjsh1zj3NKjWoTuQ",
    "1BHwoK80-5b1K4SthSqIRIXgRE08xTqoOhJ-hzZL3xQA",
    jwt,
  );
  await doc.loadInfo(); // loads document properties and worksheets
  console.log(doc.title);

  const sheets = doc.sheetsByIndex;
  for (const sheet of sheets) {
    if (!sheet.title.startsWith("Dec 17 2024 LinkedInURL")) {
      console.log("skipping sheet: ", sheet.title);
      continue;
    }
    console.log("processing sheet: ", sheet.title);

    await sheet.loadHeaderRow();
    console.log(sheet.headerValues);
    const rows = await sheet.getRows();
    for (const row of rows) {
      const email = row.get("email");
      const linkedInUrl = row.get("linkedInUrl");
      // console.log(row.rowNumber, email, linkedInUrl);
      const pp = await prisma.personProfile.findFirst({
        where: {
          email: String(email)
        }
      });
      if(!pp?.linkedInUrl){
        console.log("Missing for: ", email, "we can take: ", linkedInUrl);
        // await manuallyConnectEmailAndPeopleEnrichment(email, linkedInUrl);
      }else{
        // console.log("Found for: ", email, "we got: ", pp.linkedInUrl);
      }
      // try {
      //   await saveRecord(row.get("Users_Email"), row.get("Email"));
      // } catch (err) {
      //   console.log(
      //     "Error saving: ",
      //     row.get("Users_Email"),
      //     row.get("Email"),
      //     (err as Error)?.message,
      //   );
      // }
    }
  }
})()