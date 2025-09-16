import { db } from "@/db/db";
import { userTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

interface User {
  username: string;
  email: string;
  password: string;
}

export const POST = async (req: NextRequest) => {
  try {
    const body: User = await req.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    await db.insert(userTable).values({
      username,
      email,
      password,
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
};
