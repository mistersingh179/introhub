import prisma from "@/prismaClient";
import addPersonProfileToPineCone from "@/services/llm/addPersonProfileToPineCone";
import {Contact, Prisma} from "@prisma/client";
import addContactToPineCone from "@/services/llm/addContactToPineCone";

(async () => {

  type ContactWithLlmDescription = Contact & {
    llmDescription: string
  }

  let offset = 0;
  const limit = 100;

  while(true){
    const sql = Prisma.sql`
      select C.*, PP."llmDescription" as llmDescription
      from "Contact" C
               inner join "PersonProfile" PP on C.email = PP.email and PP."llmDescription" is not null
      offset ${offset} limit ${limit};
  `

    const contacts = await prisma.$queryRaw<ContactWithLlmDescription[]>(sql);

    for(const contact of contacts){
      console.log(contact);
      await addContactToPineCone(contact);
    }

    if(contacts.length === 0){
      break;
    }
    offset = offset + limit;
  }


})()