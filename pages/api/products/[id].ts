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
  const product = await db.collection("products").findOne({ _id: new ObjectId(id) });
  if (!product) {
    return res.status(404).json({ message: "No product found", data: [] });
  }
  if (req.method === "GET") {
    res.status(200).json({
      message: `product found`,
      data: product,
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
    await db.collection("products").updateOne({ _id: new ObjectId(id) }, update);
    res.status(200).json({
      message: `product updated successfully`,
      data: product,
    });
  }
}
