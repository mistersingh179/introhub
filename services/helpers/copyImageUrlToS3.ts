import {
  PutObjectCommand,
  S3Client,
  HeadObjectCommand,
  NotFound,
} from "@aws-sdk/client-s3";
import fs from "fs";
import prisma from "@/prismaClient";
import getGmailObject from "@/services/helpers/getGmailObject";

type CopyImageUrlToS3 = (
  url: string,
  dirName: string,
  fileName: string,
) => Promise<void>;
const copyImageUrlToS3: CopyImageUrlToS3 = async (url, dirName, fileName) => {
  const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

  console.log("will copy image from: ", url, " to s3: ", dirName, fileName);

  const s3Client = new S3Client({
    region: "us-east-2",
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID!,
      secretAccessKey: AWS_SECRET_ACCESS_KEY!,
    },
  });

  const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME;

  const key = `${dirName}/${fileName}`;
  console.log("key: ", key);

  try {
    const fileAlreadyExists = await s3Client.send(
      new HeadObjectCommand({
        Bucket: bucketName,
        Key: key,
      }),
    );
    if (fileAlreadyExists) {
      console.log("skipping as file already exists: ", key);
      return;
    }
  } catch (err) {
    if (err instanceof NotFound) {
      console.log("file doesn't exist, we are good to go");
    } else {
      throw err;
    }
  }

  const resp = await fetch(url);
  console.log("Headers:");
  console.log(resp.headers);
  const contentType = resp.headers.get("content-type") ?? undefined;
  const arrayBuffer = await resp.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  console.log(buffer);
  console.log(contentType);
  if (contentType?.startsWith("application/xml")) {
    console.log("skipping upload to s3 as image is no longer available");
    return;
  }

  const result = await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  );

  console.log(result);
};

export default copyImageUrlToS3;

if (require.main === module) {
  (async () => {
    try {
      await copyImageUrlToS3(
        "https://introhub-production.s3.us-east-2.amazonaws.com/avatar/fca8b528c5b75b9ba1afb4454a1432d8",
        "test",
        "foo.png",
      );
    } catch (err) {
      console.error(err);
    }
  })();
}
