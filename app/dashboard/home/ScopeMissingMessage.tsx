import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import * as React from "react";
import RefreshScopesForm from "@/app/dashboard/home/RefreshScopesForm";
import doWeHaveFullScope from "@/services/doWeHaveFullScope";

const ScopeMissingMessage = async () => {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
    include: {
      accounts: true,
    },
  });
  const foundFullScope = doWeHaveFullScope(user.accounts);

  if (!foundFullScope) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-8 w-8" />
        <AlertTitle className={"ml-8"}>Error</AlertTitle>
        <AlertDescription className={"ml-8"}>
          Unable to find Google Permissions. You need to Log-out, and log back
          in while granting permissions.
        </AlertDescription>
      </Alert>
    );
  }
};

export default ScopeMissingMessage;
