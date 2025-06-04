import UsersModel from "@/app/utils/userModel/usersModel";
import bcrypt from "bcryptjs";
import dbConnect from "../../../../../lib/mongoose";

export async function POST(req) {
  await dbConnect();
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return new Response(JSON.stringify({ error: "All fields are required" }), {
      status: 400,
    });
  }

  const existingUser = await UsersModel.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ error: "User already exists" }), {
      status: 400,
    });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = await UsersModel.create({ name, email, password: hashedPassword });

  return new Response(
    JSON.stringify({ message: "User registered successfully" }),
    { status: 201 }
  );
}