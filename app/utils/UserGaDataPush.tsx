import Script from "next/script";
import * as React from "react";
import { User } from "@prisma/client";

type UserGaDataPushProps = {
  user: User;
  pageTitle: string;
};

export default function UserGaDataPush(props: UserGaDataPushProps) {
  const { user, pageTitle } = props;
  return (
    <>
      <Script id="ga-dataLayer" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          dataLayer.push({
            event: 'Pageview',
            pageTitle: "${pageTitle}", 
            userId: "${user.id}",
            userName: "${user.name}",
            userEmail: "${user.email}",
            userCreatedAt: "${user.createdAt}",
            agreedToAutoProspecting: ${user.agreedToAutoProspecting},
            unableToAutoProspect: ${user.unableToAutoProspect},
            missingPersonalInfo: ${user.missingPersonalInfo},
            forwardableBlurb: ${JSON.stringify(user.forwardableBlurb)},
            tokenIssue: ${user.tokenIssue},
            icpDescription: "${user.icpDescription}"
          });
        `}
      </Script>
    </>
  );
}
