"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

interface ContentSection {
  title: string;
  text: string;
  image: string;
  imageAlt: string;
}

const aboutContent: ContentSection[] = [
  {
    title: "Hi, I'm C.T. Bell",
    text: "With over a decade of experience in filmmaking, I've dedicated my career to capturing moments that tell compelling stories.",
    image: "/about1.jpg",
    imageAlt: "C.T. Bell at work",
  },
  {
    title: "Crafting Visual Stories",
    text: "My approach combines technical precision with artistic vision. Each project is an opportunity to create something unique that resonates with audiences on a deeper level.",
    image: "/about2.jpg",
    imageAlt: "Behind the scenes",
  },
  {
    title: "Beyond the Lens",
    text: "When I'm not behind the camera, I'm constantly exploring new techniques and technologies to push the boundaries of what's possible in visual storytelling.",
    image: "/about3.jpg",
    imageAlt: "Creative process",
  },
];

interface ContentBlockProps {
  content: ContentSection;
  fromLeft: boolean;
}

const ContentBlock = ({ content, fromLeft }: ContentBlockProps) => {
  const textContent = (
    <div className="w-full md:w-1/2 px-4 flex flex-col justify-center">
      <div className="space-y-4">
        <h2
          className={`${
            content.title.includes("Hi,") ? "text-4xl md:text-5xl" : "text-2xl"
          } font-bold text-gray-100`}
        >
          {content.title}
        </h2>
        <p
          className={`text-gray-300 ${
            content.title.includes("Hi,") ? "text-lg" : ""
          }`}
        >
          {content.text}
        </p>
      </div>
    </div>
  );

  const imageContent = (
    <div className="w-full md:w-1/2 px-4">
      <div className="relative w-full aspect-square">
        <Image
          src={content.image}
          alt={content.imageAlt}
          fill
          className="rounded-lg shadow-lg object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={content.title.includes("Hi,")}
          onError={(e) => {
            console.error(`Error loading image: ${content.image}`);
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row w-full">
      {fromLeft ? (
        <>
          {textContent}
          {imageContent}
        </>
      ) : (
        <>
          {imageContent}
          {textContent}
        </>
      )}
    </div>
  );
};

interface FadeInSectionProps {
  children: React.ReactNode;
  fromLeft?: boolean;
}

const FadeInSection = ({ children, fromLeft = true }: FadeInSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.3,
    margin: "0px 0px -200px 0px",
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: fromLeft ? -100 : 100 }}
      animate={
        isInView
          ? { opacity: 1, x: 0 }
          : { opacity: 0, x: fromLeft ? -100 : 100 }
      }
      transition={{ duration: 1, ease: "easeOut" }}
      className="flex flex-col md:flex-row items-center gap-8 py-16 min-h-[50vh]"
    >
      {children}
    </motion.div>
  );
};

export default function About() {
  return (
    <div className="min-h-screen pt-32 px-4 max-w-6xl mx-auto">
      {aboutContent.map((content, index) => (
        <FadeInSection key={content.title} fromLeft={index % 2 === 0}>
          <ContentBlock content={content} fromLeft={index % 2 === 0} />
        </FadeInSection>
      ))}
    </div>
  );
}
