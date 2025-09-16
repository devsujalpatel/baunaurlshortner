import { db } from "@/db/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

interface User {
  firstname: string;
  lastname?: string;
  email: string;
  password: string;
}

export const POST = async (req: NextRequest) => {
  try {
    const body: User = await req.json();
    const { firstname, lastname, email, password } = body;

    if (!firstname || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const [existingUser] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email));

    if (existingUser) {
      return NextResponse.json(
        { message: `User with this email: ${email} already exists` },
        { status: 201 }
      );
    }

    await db.insert(userTable).values({
      firstname,
      lastname,
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
