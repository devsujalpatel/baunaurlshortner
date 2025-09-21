"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { CheckIcon, CopyIcon, LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface Url {
  id: string;
  shortCode: string;
  targetUrl: string;
}

export default function UrlClient() {
  const [urls, setUrls] = useState<Url[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  useEffect(() => {
    async function getUrls() {
      try {
        const response = await axios.get("/api/url/getAllUrl");
        setUrls(response.data.data.urls || []);
      } catch (error) {
        console.error("Failed to fetch URLs", error);
      }
    }
    getUrls();
  }, []);

  async function handleCopy(url: string) {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  }

  return (
    <main className="min-h-screen w-[56rem] py-12">
      <div className="mx-auto max-w-3xl mt-40">
        <h1 className="text-4xl font-bold text-center mb-10">All Urls</h1>

        {urls.length === 0 ? (
          <Card className="p-8 text-center shadow-md">
            <CardTitle className="text-xl text-muted-foreground">
              No URLs yet
            </CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">
              Shorten a link to see it appear here.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {urls.map((url) => {
              const shortUrl = `https://bauna.me/${url.shortCode}`;
              return (
                <Card
                  key={url.id}
                  className="transition hover:shadow-lg border bg-card/60 backdrop-blur-sm"
                >
                  <CardHeader className="flex justify-between items-center -mb-4">
                    <CardTitle className="flex items-center gap-2 text-lg font-medium">
                      <LinkIcon className="size-5 text-primary" />
                      {shortUrl}
                    </CardTitle>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleCopy(shortUrl)}
                      className="ml-2"
                    >
                      {copiedUrl === shortUrl ? (
                        <CheckIcon className="size-5 text-green-500" />
                      ) : (
                        <CopyIcon className="size-5" />
                      )}
                    </Button>
                  </CardHeader>

                  <CardContent className="flex items-center justify-between px-4">
                    <a
                      href={url.targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate ml-4 max-w-[70%] text-sm text-muted-foreground hover:underline"
                    >
                      target: {url.targetUrl}
                    </a>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
