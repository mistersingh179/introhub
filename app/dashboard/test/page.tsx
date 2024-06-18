import MyUrlReplacer from "@/app/dashboard/test/MyUrlReplacer";
import {auth} from "@/auth";
import {Session} from "next-auth";
import prisma from "@/prismaClient";
import MyFiltersForm from "@/app/dashboard/test/MyFiltersForm";
import MyFilteredResults from "@/app/dashboard/test/MyFilteredResults";

const Test = async({searchParams}: {searchParams: any} ) => {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });

  return (<>
    <h1 className={'my-4 text-2xl'}>In Test</h1>
    <h3 className={'my-4 text-xl'}>Hello {user.email}</h3>
    <MyFiltersForm />
    <MyFilteredResults searchParams={searchParams} />
  </>)
}

export default Test;