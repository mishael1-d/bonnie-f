import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, ObjectId } from "mongodb";
type Data = {
    message: string,
    data: any
}

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const client = await MongoClient.connect(
        `mongodb+srv://mish1234:${process.env.DB_PASSWORD}@cluster0.hulygy8.mongodb.net/?retryWrites=true&w=majority`
    );
    const db = client.db("test")
    if (req.method !== "GET") {
        return res.status(413).json({ message: "Method not allowed", data: [] });
    }
    const products = await db.collection("products").find().toArray()
    if (!products) {
        return res.status(404).json({ message: "No product found", data: [] });
    }
    res.status(200).json({
        message: `${products.length} Users found`, data: products,
    });
}