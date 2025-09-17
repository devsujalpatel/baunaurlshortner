import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HeroSection() {
  return (
    <>
      <main className="overflow-x-hidden">
        <section>
          <div className="pb-24 pt-12 md:pb-32 lg:pb-56 lg:pt-44">
            <div className="relative mx-auto flex max-w-6xl flex-col px-6 lg:block">
              <div className="mx-auto max-w-xl text-center lg:ml-0 lg:w-1/2 lg:text-left ">
                <h1 className="mt-8 max-w-3xl text-balance text-5xl font-medium md:text-6xl lg:mt-16 lg:text-7xl">
                  Make Your Own Short{" "}
                  <span className="text-pretty text-3xl lg:text-5xl mr-4 md:text-4xl">
                    (Bauna)
                  </span>
                  Url
                </h1>
                <p className="mt-8 max-w-2xl text-pretty text-lg">
                  Create your unique URL and share it with the world, Get
                  started now by clicking get started button.
                </p>

                <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                  <Button asChild size="lg" className="px-5 text-base shodow-lg shadow-blue-200">
                    <Link href="/shorten">
                      <span className="text-nowrap">Get Started</span>
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                className="-z-10  order-first ml-auto h-56 w-full object-cover invert sm:h-96 lg:absolute lg:inset-0 lg:-right-20 lg:-top-96 lg:order-last lg:h-max lg:w-2/3 lg:object-contain dark:mix-blend-lighten dark:invert-0"
                src="/hero-image.jpg"
                alt="Abstract Object"
                height="4000"
                width="3000"
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
