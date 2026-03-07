/* eslint-disable import/order */
"use client";

import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "@inertiajs/react";

const Header = () => {
  return (
    <section className="px-4 mt-3 top-1 sticky z-50">
      <div className="bg-white lg:px-12 px-4 py-4 rounded-md">
        <nav className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
              className="max-h-8"
              alt="Cabinet"
            />
          </Link>

          {/* Desktop Navigation + Button */}
          <div className="hidden lg:flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/" className={navigationMenuTriggerStyle()}>
                    Accueil
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/" className={navigationMenuTriggerStyle()}>
                    Services
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link
                    href="/"
                    className={navigationMenuTriggerStyle()}
                  >
                    Articles
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link
                    href="/"
                    className={navigationMenuTriggerStyle()}
                  >
                    Événements
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link href="/">
              <Button>Contact</Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon">
                <MenuIcon className="h-4 w-4" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="max-h-screen overflow-auto">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" className="flex items-center gap-2">
                    <img
                      src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
                      className="max-h-8"
                      alt="Cabinet"
                    />
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col p-4">
                <div className="flex flex-col gap-6">
                  <Link href="/" className="font-medium">
                    Accueil
                  </Link>

                  <Link href="/" className="font-medium">
                    Services
                  </Link>
                  
                  <Link href="/" className="font-medium">
                    Articles
                  </Link>

                  <Link href="/" className="font-medium">
                    Événements
                  </Link>
                </div>

                <div className="mt-6 flex flex-col gap-4">
                  <Link href="/">
                    <Button className="w-full">Contact</Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>

        </nav>
      </div>
    </section>
  );
};

export default Header;