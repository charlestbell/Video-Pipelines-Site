"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Roboto } from "next/font/google";
import { useState } from "react";
import { usePathname } from "next/navigation";

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const AnimatedCharacters = ({
  text,
  bold = false,
  delay,
  className,
}: {
  text: string;
  bold?: boolean;
  delay: number;
  className: string;
}) => {
  return (
    <span className={bold ? "font-bold" : ""}>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.2,
            delay: delay + 0.05 * index,
            ease: "easeOut",
          }}
          className={`inline-block ${className || ""}`}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
};

const NavLink = ({
  href,
  children,
  index,
}: {
  href: string;
  children: React.ReactNode;
  index: number;
}) => {
  const pathname = usePathname();
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: 0.8 + index * 0.1,
        ease: "easeOut",
      }}
    >
      <Link href={href}>
        <motion.span
          className={`text-xl text-gray-100 hover:text-gray-300 transition-colors relative ${
            pathname === href
              ? "after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-white after:origin-left after:scale-x-100 after:opacity-100 after:transition-all after:duration-300"
              : "after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-white after:origin-left after:scale-x-0 after:opacity-0 after:transition-all after:duration-300"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {children}
        </motion.span>
      </Link>
    </motion.div>
  );
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Recent Work" },
    { href: "/stills", label: "Stills" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed w-full z-50 bg-[#282C30] bg-opacity-95 backdrop-blur-sm"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-row items-center justify-between h-24">
          <div className="flex flex-row items-center gap-8 w-full justify-between md:justify-start">
            <Link href="/" className="flex-shrink-0">
              <span
                className={`${roboto.className} text-xl md:text-2xl text-gray-100`}
              >
                <AnimatedCharacters
                  delay={0}
                  text="Video Pipelines"
                  bold
                  className=""
                />
                <AnimatedCharacters
                  delay={0.8}
                  text=", LLC"
                  className="text-sm md:text-base"
                />
              </span>
            </Link>

            {/* Desktop menu */}
            <div className="hidden md:flex flex-row items-center gap-8">
              {navItems.map((item, index) => (
                <NavLink key={item.href} href={item.href} index={index}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-100 hover:text-white"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <motion.div
          initial={false}
          animate={{ height: isMenuOpen ? "auto" : 0 }}
          className="md:hidden overflow-hidden"
        >
          <div className="pb-4 space-y-2">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-gray-100 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
