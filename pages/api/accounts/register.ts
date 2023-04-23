// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
// import { UsersData } from "../../../users";
import jwt from "jsonwebtoken";
import mongodb, { MongoClient } from "mongodb";
import { sendConfirmationEmail } from "@/utils/sendEmailConfirmation";

type Data = {
  message: string;
  userDetails?: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    phoneNumber2?: string;
    state: string;
    city: string;
    userId: any;
    isVerified: boolean;
    userRole: string;
  };
  token?: string;
  errors?: FieldErrors;
};
interface FieldErrors {
  email?: string;
  firstName?: string;
  lastName?: string;
  confirmPassword?: string;
  phoneNumber?: string;
  state?: string;
  city?: string;
  password?: string;
}
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
  //   The input fields are extracted from the request body.
  const {
    email,
    password,
    firstName,
    lastName,
    confirmPassword,
    phoneNumber,
    phoneNumber2,
    state,
    city,
  } = req.body;

  interface ErrorResponse {
    errors: FieldErrors;
  }

  let errors: FieldErrors = {};

  switch (true) {
    // If there is no email or if the email input is empty, then throw an error
    case !email || email.trim() === "":
      errors.email = "Email Field is Required";
      break;
    // If there is no first name or if the first name input is empty, then throw an error
    case !firstName || firstName.trim() === "":
      errors.firstName = "First Name Field is Required";
      break;
    // If there is no last name or if the last name input is empty, then throw an error
    case !lastName || lastName.trim() === "":
      errors.lastName = "Last Name Field is Required";
      break;
    // If there is no confirm password or if the confirm password input is empty, then throw an error
    case !confirmPassword || confirmPassword.trim() === "":
      errors.confirmPassword = "Confirm Password Field is Required";
      break;
    // If there is no password or if the password input is empty, then throw an error
    case password !== confirmPassword:
      errors.confirmPassword = "Passwords do not match";
      break;
    // If there is no phone number or if the phone number input is empty, then throw an error
    case !phoneNumber || phoneNumber.trim() === "":
      errors.phoneNumber = "Phone Number 1 Field is Required";
      break;
    // If there is no state or if the state input is empty, then throw an error
    case !state || state.trim() === "":
      errors.state = "State Field is Required";
      break;
    // If there is no city or if the city input is empty, then throw an error
    case !city || city.trim() === "":
      errors.city = "City Field is Required";
      break;
    // If the length of the password is less than 8 characters throw an error
    case password.length < 8:
      errors.password = "Password must be 8 characters and above";
      break;
    default:
      // handle success case here
      break;
  }

  // Get all users and find the user which matches with the email in the input field
  const user = await db.collection("users").findOne({ email: email });
  console.log(email);
  // If the user is present, throw an error that the user already exists
  if (user) {
    return res
      .status(400)
      .json({ message: "User with this email already exists" });
  }
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      errors,
      message: "Unable to create user",
    });
  }

  // handle success case here
  const token = jwt.sign({ email }, KEY);
  // If all checks pass, it creates our user in our DB.
  let usersData = {
    token,
    email,
    password,
    firstName,
    lastName,
    confirmPassword,
    phoneNumber,
    phoneNumber2,
    state,
    city,
    isVerified: false,
    userRole: "customer",
  };

  // regsiter the user inside the db
  const result = await db.collection("users").insertOne(usersData);

  // create a token for the user and assign it to the user's email

  // If all checks pass, it returns a 200 status code with a messasge to the user's email address, a token and the user data.
  await sendConfirmationEmail(usersData, "confirmation");
  res.status(201).json({
    message: "User created successful",
    token,
    userDetails: {
      userId: result.insertedId,
      email,
      password,
      firstName,
      lastName,
      confirmPassword,
      phoneNumber,
      phoneNumber2,
      state,
      city,
      isVerified: false,
      userRole: "customer",
    },
  });
}
