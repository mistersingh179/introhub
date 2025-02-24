// import prisma from "../prismaClient";
// import { GoogleSpreadsheet } from "google-spreadsheet";
// import { JWT } from "google-auth-library";
// import creds from "./introhub-276d729d73d8.json";
// import getProspectsBasedOnFilters, {
//   SelectedFilterValues,
// } from "../services/getProspectsBasedOnFilters";
//
// // @ts-ignore
// prisma.$on("query", (e) => {
//   const { timestamp, query, params, duration, target } = e;
//   console.log(query, params);
//   // console.log({ timestamp, params, duration, target });
// });
//
// // const saveRecord = async (userEmail: string, contactEmail: string) => {
// //   const user = await prisma.user.findFirstOrThrow({
// //     where: {
// //       email: userEmail,
// //     },
// //   });
// //   const filters: SelectedFilterValues = {
// //     selectedEmail: contactEmail,
// //   };
// //   const { prospects, filteredRecordsCount } = await getProspectsBasedOnFilters(
// //     filters,
// //     {
// //       currentPage: 1,
// //       itemsPerPage: 1,
// //       recordsToSkip: 0,
// //     },
// //     user,
// //   );
// //   const prospect = prospects[0];
// //
// //   if (user && prospect) {
// //     await prisma.wantedContact.create({
// //       data: {
// //         userId: user.id,
// //         contactId: prospect.id,
// //       },
// //     });
// //   }
// // };
//
// (async () => {
//   const SCOPES = [
//     "https://www.googleapis.com/auth/spreadsheets",
//     "https://www.googleapis.com/auth/drive.file",
//   ];
//
//   const jwt = new JWT({
//     email: creds.client_email,
//     key: creds.private_key,
//     scopes: SCOPES,
//   });
//
//   const doc = new GoogleSpreadsheet(
//     "1yB8SjUU59QqhWMgpTFPRBVEeIIUvUhksWeALewejSHk",
//     jwt,
//   );
//   await doc.loadInfo(); // loads document properties and worksheets
//   console.log(doc.title);
//   const sheets = doc.sheetsByIndex;
//   for (const sheet of sheets) {
//     if (!sheet.title.startsWith("Sheet1")) {
//       console.log("skipping sheet: ", sheet.title);
//       continue;
//     }
//     console.log("processing sheet: ", sheet.title);
//     await sheet.loadHeaderRow();
//     console.log(sheet.headerValues);
//     const rows = await sheet.getRows();
//     for (const row of rows) {
//       console.log(
//         row.rowNumber,
//         row.get("R"),
//         row.get("F"),
//         row.get("C"),
//         row.get("ROD_NOTE"),
//       );
//       if (row.get("ROD_NOTE") === "KILL") {
//         const ans = await prisma.introduction.findMany({
//           where: {
//             requester: {
//               name: row.get("R"),
//             },
//             facilitator: {
//               name: row.get("F"),
//             },
//             contact: {
//               email: row.get("C"),
//             },
//             status: 'pending approval'
//           },
//         });
//         console.log(ans);
//       }
//       // try {
//       //   await saveRecord(row.get("Users_Email"), row.get("Email"));
//       // } catch (err) {
//       //   console.log(
//       //     "Error saving: ",
//       //     row.get("Users_Email"),
//       //     row.get("Email"),
//       //     (err as Error)?.message,
//       //   );
//       // }
//     }
//   }
// })();
//
// export {};
