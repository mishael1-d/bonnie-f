// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";
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

  //   The email and password are extracted from the request body
  const { email, password } = req.body;

  const user = await db.collection("users").findOne({ email });

  // The code first checks if the HTTP method is not POST, and returns a 413 status code if it is not.
  if (req.method !== "POST") {
    return res.status(413).json({ message: "Method not allowed" });
  }

  // if there's no user with the filled in email address, then the user does not exist
  if (!user) {
    res.status(400).json({
      message: "User does not exist",
    });
  }

  // if the password length is not up to 8 characters, throw an error
  if (password.length < 8) {
    res.status(400).json({
      message: "Password must be 8 characters and above",
    });
  }

  // if all the check passes, update the password and confirm password field
  if (user !== null && user.isVerified && password.length >= 8) {
    const update = {
      $set: { password: password, confirmPassword: password },
    };
    await db.collection("users").updateOne({ email }, update);
    res.status(200).json({
      message: "Password updated successfully",
    });
  } else {
    res.status(400).json({
      message: "Unable to update user password",
    });
  }
}
