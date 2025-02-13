"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

interface FadeInSectionProps {
  children: React.ReactNode;
  fromLeft?: boolean;
}

const FadeInSection = ({ children, fromLeft = true }: FadeInSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.3, // Trigger when 30% of element is in view
    margin: "0px 0px -200px 0px", // Negative margin to trigger earlier
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
      <FadeInSection fromLeft={true}>
        <div className="md:w-1/2 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-100">
            Hi, I'm C.T. Bell
          </h1>
          <p className="text-gray-300 text-lg">
            With over a decade of experience in filmmaking, I've dedicated my
            career to capturing moments that tell compelling stories.
          </p>
        </div>
        <div className="md:w-1/2">
          <Image
            src="/about1.jpg"
            alt="C.T. Bell at work"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
      </FadeInSection>

      <FadeInSection fromLeft={false}>
        <div className="md:w-1/2 md:order-2 space-y-4">
          <h2 className="text-2xl font-bold text-gray-100">
            Crafting Visual Stories
          </h2>
          <p className="text-gray-300">
            My approach combines technical precision with artistic vision. Each
            project is an opportunity to create something unique that resonates
            with audiences on a deeper level.
          </p>
        </div>
        <div className="md:w-1/2 md:order-1">
          <Image
            src="/about2.jpg"
            alt="Behind the scenes"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
      </FadeInSection>

      <FadeInSection fromLeft={true}>
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-2xl font-bold text-gray-100">Beyond the Lens</h2>
          <p className="text-gray-300">
            When I'm not behind the camera, I'm constantly exploring new
            techniques and technologies to push the boundaries of what's
            possible in visual storytelling.
          </p>
        </div>
        <div className="md:w-1/2">
          <Image
            src="/about3.jpg"
            alt="Creative process"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
      </FadeInSection>
    </div>
  );
}
