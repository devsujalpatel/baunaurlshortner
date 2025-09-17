import { db } from "@/db/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { signupSchema } from "@/lib/validations/auth";
import { hashPasswordWithSalt } from "@/utils/hash";

interface User {
  firstname: string;
  lastname?: string;
  email: string;
  password: string;
}

export const POST = async (req: NextRequest) => {
  try {
    const body: User = await req.json();

    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { firstname, lastname, email, password } = parsed.data;

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

    const { salt, hashedPassword } = hashPasswordWithSalt(password);

    await db.insert(userTable).values({
      firstname,
      lastname,
      email,
      salt,
      password: hashedPassword,
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
