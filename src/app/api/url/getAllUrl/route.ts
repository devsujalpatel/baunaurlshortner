import { NextRequest, NextResponse } from "next/server";
import { getAllUrlByUserId } from "@/services/url.services";
import { auth } from "@/lib/auth";

export const GET = async (req: NextRequest) => {
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
    // Check for existing shortcode
    const urls = await getAllUrlByUserId(userId);
    if (!urls) {
      return NextResponse.json(
        {
          errors: [
            {
              message: "No Urls Found",
            },
          ],
        },
        { status: 404 }
      );
    }

    // Create new shortened URL

    return NextResponse.json(
      {
        data: {
          urls,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create Url" },
      { status: 500 }
    );
  }
};
