// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";
type Data = {
  message: string;
  data: any;
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
    return res.status(413).json({ message: "Method not allowed", data: [] });
  }

  const users = await db.collection("users").find().toArray();

  if (!users) {
    return res.status(404).json({ message: "No users found", data: [] });
  }
  // If all checks pass, it returns a 200 status code with a success message, a token and the user data.
  res.status(200).json({
    message: `${users.length} Users found`,   data: users,
  });
}
