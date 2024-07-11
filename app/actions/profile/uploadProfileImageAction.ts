"use server";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import { userProfileS3DirName } from "@/app/utils/constants";

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  NEXT_PUBLIC_BUCKET_NAME: bucketName,
} = process.env;

const s3Client = new S3Client({
  region: "us-east-2",
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID!,
    secretAccessKey: AWS_SECRET_ACCESS_KEY!,
  },
});

export default async function uploadProfileImageAction(
  prevState: String | undefined,
  formData: FormData,
) {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });
  console.log("formData: ", formData);
  const file = formData.get("profileImage") as File;
  console.log(file);
  console.log(file.type);
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const dirName = userProfileS3DirName;
  const fileName = randomUUID();
  const key = `${dirName}/${fileName}`;
  console.log("key: ", key);

  try {
    const result = await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      }),
    );
    console.log(result);
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        profileImageName: fileName,
      },
    });
  } catch (e) {
    if (e instanceof Error) {
      return e.message;
    } else {
      return "Unable to upload Image!";
    }
  }

  revalidatePath("/dashboard/profile");
  redirect("/dashboard/profile");
}
