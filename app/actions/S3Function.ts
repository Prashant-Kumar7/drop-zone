"use server"

import { NEXT_AUTH_CONFIG } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { S3Client, PutObjectCommand, S3, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import csv from 'csv-parser';
import { Readable } from "stream";
import prisma from "@/db";
import { s3Client } from "@/lib/S3Client";

interface UserDataTypes { 
  name : string
  email : string
  userId : string
}

export async function getSignedURL(id : string) {
  console.log(id)

    const session = await getServerSession(NEXT_AUTH_CONFIG)

    if(!session){
        return { failure : "Not authenticated"}
    }

    const putObjectCommand = new PutObjectCommand({
        Bucket : process.env.AWS_S3_BUCKET_NAME,
        Key : id
    })

    const signedUrl = await getSignedUrl(s3Client , putObjectCommand , {expiresIn : 60})

    return {success : {url : signedUrl} }
}

export const getPublicUrl = (key : string) => {
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

// export async function getParsedData(id : string){
//   console.log(id)
//     const session = await getServerSession(NEXT_AUTH_CONFIG)
//     const params = {Bucket : process.env.AWS_S3_BUCKET_NAME , Key : id}
//     const command = new GetObjectCommand(params)
//     const { Body } = await s3Client.send(command);

//     if (!Body) {
//       return;
//     }

//     let stream;

//     // Convert Blob or ReadableStream to AsyncIterable
//     if (Body instanceof Readable) {
//       stream = Body; // It's already a readable stream in Node.js
//     } else if (Body instanceof ReadableStream) {
//       stream = Readable.from(readableStreamToAsyncIterable(Body)); // Convert ReadableStream to Node.js stream
//     } else {
//       return;
//     }

//     // Create an array to store parsed CSV data
//     const results : any[] = [];

//     const userData : UserDataTypes[] = []
//     // Stream the CSV data and parse it using csv-parser
//     stream
//       .pipe(csv())
//       .on('data', (data) => results.push(data)) // Push each row to results array
//       .on('end', () => {
//         results.map((items : any)=>{
//             const Obj = { name : items.Name , email : items.Email , userId : session.user.id}
//             userData.push(Obj)
//         })

//         console.log(userData)
//         createData(userData)
//       })
//       .on('error', (err) => {
//         console.error(err);
//         return
//     });
// }


export async function deleteFile(id:string) {
  const params = {Bucket : process.env.AWS_S3_BUCKET_NAME , Key : id}
  const command = new DeleteObjectCommand(params)

  try {
    const data = await s3Client.send(command);
    console.log("file deleted successfully : ", data)
  } catch (error) {
    console.error(error)
  }

}

function readableStreamToAsyncIterable(Body: ReadableStream<any> & import("@smithy/types").SdkStreamMixin): Iterable<any> | AsyncIterable<any> {
    throw new Error("Function not implemented.");
}

