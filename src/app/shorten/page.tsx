"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";
import { useState } from "react";
import { Loader2Icon, CopyIcon, CheckIcon } from "lucide-react";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const formSchema = z.object({
  targeturl: z
    .string()
    .min(5, "url must be at least 5 characters")
    .max(255, "Too long"),
  shortcode: z.string().optional(),
});

export default function ShortenUrl() {
  const [isDisabled, setIsDisabled] = useState(false);
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      targeturl: "",
      shortcode: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsDisabled(true);
    try {
      const response = await axios.post("/api/url/shorten", {
        url: values.targeturl,
        code: values.shortcode,
      });
      const data = response.data;

      const generatedUrl = `https://bauna.me/${data.data.shortcode}`;

      setShortUrl(generatedUrl);

      toast.success("✅ Url Created Successfully");
      form.reset();
    } catch (err: unknown) {
      console.log(err);

      if (axios.isAxiosError(err) && err.response?.data?.errors) {
        const errors = err.response.data.errors as {
          field: string;
          message: string;
        }[];

        errors.forEach(({ field, message }) => {
          form.setError(field as keyof z.infer<typeof formSchema>, {
            type: "server",
            message,
          });
        });
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsDisabled(false);
    }
  }

  async function handleCopy() {
    if (!shortUrl) return;
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start px-4 py-12">
      <div className="text-center mb-8 mt-40">
        <h1 className="mb-2 text-3xl md:text-4xl font-bold">
          Create Your Own Short URL
        </h1>
        <p className="text-muted-foreground">
          Paste a long URL and get a short one instantly 🚀
        </p>
      </div>

      {/* Form Section */}
      <section className="w-full max-w-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-card border rounded-xl shadow-sm p-6 space-y-6"
          >
            <FormField
              control={form.control}
              name="targeturl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Url</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shortcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Short Code (optional) </FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="alias" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" disabled={isDisabled}>
              {isDisabled ? (
                <Loader2Icon className="animate-spin size-4 cursor-pointer" />
              ) : (
                "Create Short URL"
              )}
            </Button>
          </form>
        </Form>
      </section>

      {/* Result Section */}
      {shortUrl && (
        <Card className="mt-8 w-full max-w-lg border bg-muted/50">
          <CardContent className="flex items-center justify-between px-4">
            <a
              href={shortUrl}
              target="_blank"
              className="text-primary font-medium text-md lg:text-lg truncate max-w-[75%]"
            >
              {shortUrl}
            </a>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleCopy}
              className="ml-2 cursor-pointer"
            >
              {copied ? (
                <CheckIcon className="size-5 text-green-500" />
              ) : (
                <CopyIcon className="size-5" />
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
