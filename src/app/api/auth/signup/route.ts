import { db } from "@/db/db";
import { userTable } from "@/models/url-schema";
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
        {
          errors: [{ field: "email", message: "Email is taken" }],
        },
        { status: 400 }
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
      { errors: [{ field: "form", message: "Failed to create user" }] },
      { status: 500 }
    );
  }
};
