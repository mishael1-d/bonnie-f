// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import mongodb, { MongoClient, WithId } from "mongodb";
import { sendConfirmationEmail } from "@/utils/sendEmailConfirmation";
type Data = {
  message: string;
  userDetails?: any;
  token?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const client = await MongoClient.connect(
    `mongodb+srv://mish1234:${process.env.DB_PASSWORD}@cluster0.hulygy8.mongodb.net/?retryWrites=true&w=majority`
  );
  const db = client.db("test");
  // The code first checks if the HTTP method is not POST, and returns a 413 status code if it is not.
  if (req.method !== "GET") {
    return res.status(413).json({ message: "Method not allowed" });
  }
  //   The email and password are extracted from the request body.
  const query = req.query;
  let email: any = query.email;
  let decodedEmail = email.replace(" ", "+");

  const user = await db.collection("users").findOne({ email: decodedEmail });
  if (user !== null && user.isVerified) {
    res.status(200).json({
      message: "Account has already been verified",
    });
  }
  if (user !== null && user.email === decodedEmail) {
    // const update = { $set: { isVerified: true } };
    // await db.collection("users").updateOne({ email: email }, update);
    const update = { $set: { isVerified: true } };
    await db.collection("users").updateOne({ email: decodedEmail }, update);
    await sendConfirmationEmail(user, "verification");
    res.status(200).json({
      message: "Account verified successfully",
    });
  } else {
    res.status(400).json({
      message: "Account verification failed",
    });
  }

  // If all checks pass, it returns a 200 status code with a success message, a token and the user data.
}
