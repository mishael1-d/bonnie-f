// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import mongodb, { MongoClient, WithId } from "mongodb";
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
  const KEY = "knvfnfnighirtjighinvnnfdnvnfdvfonvnfvni";
  // The code first checks if the HTTP method is not POST, and returns a 413 status code if it is not.
  if (req.method !== "POST") {
    return res.status(413).json({ message: "Method not allowed" });
  }
  //   The email and password are extracted from the request body.
  const { email, password } = req.body;

  //   The code checks if the email field is empty or not present, and returns a 400 status code with an error message if it is.
  if (!email || email.trim() === "") {
    return res.status(400).json({ message: "Email Field is Required" });
  }

  //   The code checks if the user with the given email exists in the database. If not, it returns a 404 status code with an error message.
  const user = await db.collection("users").findOne({ email: email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  //   The code checks if the password field is empty or not present, and returns a 400 status code with an error message if it is.
  if (!password || password.trim() === "") {
    return res.status(400).json({ message: "Password Field is Required" });
  }

  //   The code compares the password provided by the user with the password stored in the database. If they do not match, it returns a 400 status code with an error message.
  if (user.password !== password) {
    return res.status(400).json({ message: "Password is incorrect" });
  }

  //  The code checks if the user has already verified his/her email address, if it hasn't been verified, the user is unable to login
  if (!user.isVerified) {
    res.status(400).json({ message: "Your account is not verified" });
  }

  // If all checks pass, it returns a 200 status code with a success message, a token and the user data.
  res.status(200).json({
    message: "Login successful",
    token: jwt.sign({ email }, KEY),
    userDetails: user,
  });
}
