import { db } from "@/db/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface User {
  email: string;
  password: string;
}

export const POST = async (req: NextRequest) => {
  try {
    const body: User = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const [existingUser] = await db
      .select({
        id: userTable.id,
        password: userTable.password,
      })
      .from(userTable)
      .where(eq(userTable.email, email));

    if (!existingUser) {
      return NextResponse.json(
        { error: `User with this email: ${email} not found` },
        { status: 404 }
      );
    }

    if (password !== existingUser.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: existingUser.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    const response = NextResponse.json(
      { message: "User Login Successfully" },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hr
      path: "/",
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
};
