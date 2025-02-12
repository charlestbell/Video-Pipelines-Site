"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Roboto } from "next/font/google";

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
            duration: 0.5,
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
}) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.5,
      delay: 0.5 + index * 0.1,
      ease: "easeOut",
    }}
  >
    <Link href={href}>
      <motion.span
        className="text-gray-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {children}
      </motion.span>
    </Link>
  </motion.div>
);

export default function Navbar() {
  const navItems = [
    { href: "/recent-work", label: "Recent Work" },
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
      <div className="container mx-auto px-4">
        <div className="flex flex-row items-center gap-8 h-24">
          <Link href="/" className="flex-shrink-0">
            <span className={`${roboto.className} text-2xl text-gray-100`}>
              <AnimatedCharacters
                delay={0}
                text="Video Pipelines"
                bold
                className=""
              />
              <AnimatedCharacters
                delay={0.8}
                text=", LLC"
                className="text-base"
              />
            </span>
          </Link>

          <div className="flex flex-row items-center gap-8">
            {navItems.map((item, index) => (
              <NavLink key={item.href} href={item.href} index={index + 1}>
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
