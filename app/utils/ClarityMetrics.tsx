"use client";

import { User } from "@prisma/client";
import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    clarity: (command: string, value?: string) => void;
  }
}

type ClarityMetricsProps = {
  user: User;
};
const ClarityMetrics = (props: ClarityMetricsProps) => {
  const { user } = props;
  useEffect(() => {
    if (window?.clarity && user?.email) {
      try{
        window.clarity("identify", user.email);
      }catch(err){
        console.error('error reporting to clarity: ', err);
      }
    }
  }, [user, user.email]);
  return <></>;
};

export default ClarityMetrics;
