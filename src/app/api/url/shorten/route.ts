import { shortenBodySchema } from "@/lib/validations/shorten";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { createShorten, getUrlByShortCode } from "@/services/url.services";
import { auth } from "@/lib/auth"; // Better Auth instance

export const POST = async (req: NextRequest) => {
  try {
    const headers = new Headers(req.headers);
    const session = await auth.api.getSession({ headers });

    if (!session) {
      return NextResponse.json(
        { errors: [{ message: "Unauthorized" }] },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await req.json();
    const parsed = await shortenBodySchema.safeParseAsync(body);

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { url, code } = parsed.data;
    const shortCode = code || nanoid(6);

    // Check for existing shortcode
    const existingShortCode = await getUrlByShortCode(shortCode);
    if (existingShortCode) {
      return NextResponse.json(
        {
          errors: [{ field: "shortcode", message: "Shortcode already in use" }],
        },
        { status: 400 }
      );
    }

    // Create new shortened URL
    const result = await createShorten(shortCode, url, userId);

    return NextResponse.json(
      {
        data: {
          message: "Url Created Successfully",
          id: result.id,
          shortcode: shortCode,
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
