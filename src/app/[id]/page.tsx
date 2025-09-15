import { redirect } from "next/navigation";

// same store (replace with DB in production)
// const urlStore =

export default function ShortUrlPage({ params }: { params: { id: string } }) {
  const shortId = "git";

  if (shortId !== params.id) {
    return <p>Short URL not found</p>;
  }

  const url = "https://github.com/devsujalpatel";

  if (!url) {
    return <p>Short URL not found</p>;
  }

  redirect(url);
}
