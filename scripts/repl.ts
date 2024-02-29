import prisma from "../prismaClient";
import { google } from "googleapis";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log(query);
  // console.log({ timestamp, params, duration, target });
});

const MY_GOOGLE_API_KEY = "AIzaSyCCiO10EMimJzYb5qSbrxtbiCxAwo-131U";

(async () => {
  console.log("Hello World from repl.ts");

  const food = await prisma.food.create({
    data: {
      id: String(1234),
      name: 'gol gappe'
    }
  });
  console.log(food);


  return
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: "sandeep@brandweaver.ai",
    },
  });
  const account = await prisma.account.findFirstOrThrow({
    where: {
      userId: user.id,
      provider: "google",
    },
  });
  const accessToken = account.access_token;
  console.log(
    "accessToken: ",
    accessToken,
    new Date(account.expires_at! * 1000).toString(),
  );
  const gmail = google.gmail({
    version: "v1",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const messagesResponse = await gmail.users.messages.list({
    userId: "me",
    maxResults: 10,
  });
  const messages = messagesResponse.data.messages || [];
  console.log(messages);

  const firstMessageId = messages[0].id || "";

  const msg = await gmail.users.messages.get({
    userId: "me",
    id: firstMessageId,
    format: 'metadata'
  });
  console.log("snippet: ", msg.data.snippet);

  const headers = msg.data.payload!.headers || [];
  const wantedHeaders = headers.filter((val, idx, arr) => {
    const names = ["Date", "Subject", "From", "To", "Message-Id"];
    if (names.includes(val.name || "")) {
      return true;
    }
  });
  console.log(wantedHeaders);
  console.log("***")
  console.log(msg.data.payload!.headers);

  // const labelsResponse = await gmail.users.labels.list({
  //   userId: "me",
  // });
  // console.log(labelsResponse.data);

  const emailLines = [
    "From: sandeep@brandweaver.ai",
    "To: mistersingh179@gmail.com",
    "Content-type: text/html;charset=iso-8859-1",
    "MIME-Version: 1.0",
    "Subject: Hello World",
    "",
    "Does this work man?",
  ];

  const email = emailLines.join("\r\n").trim();
  const base64Email = Buffer.from(email).toString("base64");
  console.log("sending email: ", base64Email);

  // https://www.googleapis.com/auth/userinfo.email
    // https://www.googleapis.com/auth/userinfo.profile openid
    // https://www.googleapis.com/auth/gmail.readonly

  const sendRes = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: base64Email,
    },
  });

  console.log("sendRes: ", sendRes);
})();

export {};
