import { NextRequest, NextResponse } from "next/server";
import MediumQueue from "@/bull/queues/mediumQueue";

const doAuthCheck = (request: NextRequest): undefined | NextResponse => {
  const providedAuthToken = request.headers.get("Authorization");
  console.log("providedAuthToken: ", providedAuthToken);

  if (providedAuthToken !== `Bearer ${process.env.INTERNAL_API_SECRET}`) {
    return new NextResponse("No Access", { status: 401 });
  }
};

type OptionsType = {
  params: { id: string };
};

export async function POST(request: NextRequest, { params }: OptionsType) {
  const authCheckResult = doAuthCheck(request);
  if (authCheckResult) return authCheckResult;

  const userId = params.id;
  console.log("going to onboard user: ", params.id);

  const jobObj = await MediumQueue.add("onBoardUser", { userId });
  const { name, id } = jobObj;

  const result = { message: "thanks!", name, id, userId };
  console.log(result);

  return NextResponse.json(result);
}
