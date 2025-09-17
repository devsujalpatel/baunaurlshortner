import { shortenBodySchema } from "@/lib/validations/shorten";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { createShorten, getUrlByShortCode } from "@/services/url.services";
import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  id: string;
}


export const POST = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { errors: [{ field: "token", message: "Missing token" }] },
        { status: 401 }
      );
    }

    let decoded: DecodedToken;

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as DecodedToken;
    } catch {
      return NextResponse.json(
        { errors: [{ field: "token", message: "Invalid token" }] },
        { status: 401 }
      );
    }

    const userId = decoded.id;

    // ✅ safer parsing
    const body = await req.json();
    const parsed = await shortenBodySchema.safeParseAsync(body);

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { url, code } = parsed.data;
    const shortCode = code ?? nanoid(6);

    const existingShortCode = await getUrlByShortCode(shortCode);
    if (existingShortCode) {
      return NextResponse.json(
        {
          errors: [{ field: "shortcode", message: "Shortcode already in use" }],
        },
        { status: 400 }
      );
    }

    const result = await createShorten(shortCode, url, userId);

    return NextResponse.json(
      {
        data: {
          message: "Url Created Successfully",
          id: result.id,
          shortcode: result.shortCode,
          targetUrl: result.targetUrl,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create Url" },
      { status: 500 }
    );
  }
};
