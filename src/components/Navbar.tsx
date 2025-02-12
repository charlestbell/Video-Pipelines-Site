"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link href={href}>
    <motion.span
      className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.span>
  </Link>
);

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed w-full z-50 bg-black/80 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/vp_logo.jpg"
                alt="Video Pipelines Logo"
                width={50}
                height={50}
                className="rounded-full"
              />
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <NavLink href="/recent-work">Recent Work</NavLink>
              <NavLink href="/stills">Stills</NavLink>
              <NavLink href="/about">About</NavLink>
              <NavLink href="/contact">Contact</NavLink>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
