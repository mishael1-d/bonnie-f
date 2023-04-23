// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, ObjectId } from "mongodb";
type Data = {
  message: string;
  data: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id }: any = req.query;
  let authToken = (req.headers.authorization)
  let splitToken = authToken?.split("Bearer").join("")
  console.log(splitToken);
  //   let id: any = query.id;
  const {
    email,
    first_name,
    last_name,
    phoneNumber1,
    phoneNumber2,
    state,
    city,
  } = req.body;
  const client = await MongoClient.connect(
    `mongodb+srv://mish1234:${process.env.DB_PASSWORD}@cluster0.hulygy8.mongodb.net/?retryWrites=true&w=majority`
  );
  const db = client.db("test");
  const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
  if (!user) {
    return res.status(404).json({ message: "No user found", data: [] });
  }
  // if(splitToken === user.)
  if (req.method === "GET") {
    res.status(200).json({
      message: `User found`,
      data: user,
    });
  }
  if (req.method === "PATCH") {
    const update = {
      $set: {
        email,
        first_name,
        last_name,
        phoneNumber1,
        phoneNumber2,
        state,
        city,
      },
    };
    await db.collection("users").updateOne({ _id: new ObjectId(id) }, update);
    res.status(200).json({
      message: `User updated successfully`,
      data: user,
    });
  }
}
