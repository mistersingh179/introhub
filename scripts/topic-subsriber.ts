import prisma from "../prismaClient";

const { PubSub } = require("@google-cloud/pubsub");

// @ts-ignore
prisma.$on("query", (e) => {});

(async () => {
  console.log("Starting repl!");

  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: "sandeep@introhub.net",
    },
    include: {
      accounts: true,
    },
  });

  console.log("accounts: ", user.accounts.length);
  let account = user.accounts[0];
  console.log(account.scope);

  const pubSubClient = new PubSub({});
  const subscriptionName =
    "projects/introhub-development/subscriptions/introhub-develoment-sub";
  const subscription = pubSubClient.subscription(subscriptionName);

  // Message handler for incoming messages
  const messageHandler = async (message: any) => {
    console.log(`Received message ${message.id}:`);
    console.log(`Data: ${message.data}`);
    console.log(`Attributes: ${JSON.stringify(message.attributes)}`);

    const historyId = JSON.parse(message.data).historyId;
    const emailAddress = JSON.parse(message.data).emailAddress;
    console.log(emailAddress, historyId);

    // download messages from thread

    // "Ack" (acknowledge) the message, so it won't be pulled again
    console.log(
      "going to 'Ack' (acknowledge) the message, so it won't be pulled again",
    );
    message.ack();
  };

  // Listen for new messages until the process is killed
  subscription.on("message", messageHandler);
})();

export {};
