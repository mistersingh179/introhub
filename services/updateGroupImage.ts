import { Group } from "@prisma/client";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import prisma from "@/prismaClient";
import fs from "fs";

const updateGroupImage = async (
  group: Group,
  imageFileBuffer: Buffer,
  imageFileContentType: string,
) => {
  const s3Client = new S3Client({
    region: "us-east-2",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
  // const arrayBuffer = await image.arrayBuffer();
  // const buffer = Buffer.from(arrayBuffer);
  const dirName = "group-images";
  const fileName = `image-${Date.now()}`;
  const key = `${dirName}/${fileName}`;
  const result = await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME!,
      Key: key,
      Body: imageFileBuffer,
      ContentType: imageFileContentType,
    }),
  );
  console.log("put object result: ", result);
  if (group.imageName) {
    console.log("deleteing old image: ", group.imageName);
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME!,
        Key: group.imageName,
      }),
    );
  }

  await prisma.group.update({
    where: {
      id: group.id,
    },
    data: {
      imageName: key,
    },
  });
  console.log("*** key: ", key);
  const url = `https://${process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN}/${key}`;
  console.log(url);
};

export default updateGroupImage;

if (require.main === module) {
  (async () => {
    const group = await prisma.group.findFirstOrThrow();
    const networkingImageFileBuffer = fs.readFileSync(
      "app/auth/signIn/networking.png",
    );
    console.log(networkingImageFileBuffer);
    await updateGroupImage(group, networkingImageFileBuffer, "image/png");
  })();
}
