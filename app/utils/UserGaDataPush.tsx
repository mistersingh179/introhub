import Script from "next/script";
import * as React from "react";
import { User } from "@prisma/client";
import crypto from 'crypto';

type UserGaDataPushProps = {
  user: User;
  pageTitle: string;
};

export default function UserGaDataPush(props: UserGaDataPushProps) {
  const { user, pageTitle } = props;
  const secretKey = process.env.INTERCOM_WEB_IDENTITY!; // IMPORTANT: your web Identity Verification secret key - keep it safe!
  const userIdentifier = user.id.toString(); // IMPORTANT: a UUID to identify your user
  const hash = crypto.createHmac('sha256', secretKey).update(userIdentifier).digest('hex');
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
            icpDescription: "${user.icpDescription}",
            user_hash: "${hash}"
          });
        `}
      </Script>
    </>
  );
}
