import { db } from "@/db/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { loginSchema } from "@/lib/validations/auth";
import { hashPasswordWithSalt } from "@/utils/hash";

interface User {
  email: string;
  password: string;
}

export const POST = async (req: NextRequest) => {
  try {
    const body: User = await req.json();

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const [existingUser] = await db
      .select({
        id: userTable.id,
        password: userTable.password,
        salt: userTable.salt,
      })
      .from(userTable)
      .where(eq(userTable.email, email));

    if (!existingUser) {
      return NextResponse.json(
        {
          errors: [{ field: "email", message: "User not found" }],
        },
        { status: 404 }
      );
    }

    const { hashedPassword } = hashPasswordWithSalt(
      password,
      existingUser.salt
    );

    if (hashedPassword !== existingUser.password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: existingUser.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    const response = NextResponse.json(
      {
        message: "User Login Successfully",
        user: { id: existingUser.id, email },
      },

      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to Login user" },
      { status: 500 }
    );
  }
};
