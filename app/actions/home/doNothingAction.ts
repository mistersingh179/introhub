"use server";

import sleep from "@/lib/sleep";

export default async function doNothingAction(prevState: any, formData: FormData) {
  console.log("entering doNothingAction");
  await sleep(100);
  console.log("leaving doNothingAction");
}
