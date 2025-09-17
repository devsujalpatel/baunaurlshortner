"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import React from "react";
import Image from "next/image";

const menuItems = [
  { name: "Home", href: "/" },
  { name: "Shorten", href: "/shorten" },
  { name: "Pricing", href: "#pricing" },
  { name: "Profile", href: "#profile" },
];

export const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false);

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="bg-background/50 fixed z-20 w-full border-b backdrop-blur-3xl"
      >
        <div className="mx-auto max-w-6xl px-6 transition-all duration-300">
          <div className="relative flex items-center justify-between py-3 lg:py-4">
            {/* Logo (left) */}
            <Link
              href="/"
              aria-label="home"
              className="flex items-center space-x-2"
            >
              <Image src="/logo.png" alt="logo" width={25} height={20} />
              <h1 className="text-xl font-bold">Bauna</h1>
            </Link>

            {/* Desktop Links (right) */}
            <div className="hidden lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-accent-foreground block duration-150"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuState(!menuState)}
              aria-label={menuState ? "Close Menu" : "Open Menu"}
              className="relative z-20 block cursor-pointer p-2.5 lg:hidden"
            >
              {menuState ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </button>

            {/* Mobile Menu */}
            {menuState && (
              <div className="absolute top-full left-0 w-full bg-background border-t shadow-lg p-6 lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                        onClick={() => setMenuState(false)}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
