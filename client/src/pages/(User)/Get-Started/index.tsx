import { Features } from "@/components/features";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import Hero from "@/components/hero";
import CtaSection from "@/components/section";
import DownloadApp from "@/components/download-app";
import GetInTouch from "@/components/get-in-touch";
import LanguageSelection from "@/components/language-section";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useAnimation } from "framer-motion";
import "./index.css";
import "flag-icons/css/flag-icons.min.css";
import { useEffect } from "react";

const item = {
  hidden: {
    opacity: 0,
    y: 50,
    transition: { ease: [0.78, 0.14, 0.15, 0.86] },
  },
  show: {
    opacity: 1,
    y: 0,
    transition: { ease: [0.78, 0.14, 0.15, 0.86], duration: 0.6 },
  },
};
const GetStarted = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("show");
    }
  }, [controls, inView]);
  return (
    <motion.div
      ref={ref}
      variants={item}
      initial="hidden"
      animate={controls}
      style={{ width: "100%" }}
    >
      <div className="min-h-screen bg-white overflow-y-auto h-screen z-50">
        <Header />
        <main>
          <LanguageSelection />
          <Hero />
          <Features />
          <CtaSection />
          <DownloadApp />
          <GetInTouch />
        </main>
        <Footer />
      </div>
    </motion.div>
  );
};

export default GetStarted;
