import imageDefinition from "../assets/homepage-defintion.jpg";
import Hero from "../components/Hero";
import ImageApplications from "../components/ImageApplications";
import ImageTechniques from "../components/ImageTechniques";
import ImageProcessingShowcase from "../components/ImageProcessingShowcase";
import { motion } from "framer-motion";
import logo from "../assets/virtual-lab-logo.png";

const Home = () => {


  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="text-center relative h-full w-full">
      <Hero />
      <motion.div
        id="siteIdentity"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        className="flex flex-col lg:flex-row items-center my-[5rem] mx-[8rem] gap-10"
      >
        <motion.div
          variants={fadeUp}
          className="flex flex-col text-left gap-4"
        >
          <img src={logo} className="navLogo dark:brightness-100" width={150} alt="Logo" />
          <div>
            <h2
              className="text-[40px] md:text-[56px] font-bold tracking-[-2px]">
              What is the Virtual Lab
            </h2>
            <span
              className="text-[24px] md:text-[36px] tracking-[-1px] font-bold">
              Everything you need to provide great images.
            </span>
          </div>
          <p
            className="text-[16px] md:text-[18px] leading-relaxed">
            The one and only educational platform for learning Image Processing Techniques — manipulation and analysis of
            images using mathematical operations, algorithms, and techniques to:
          </p>
          <ul
            className="text-[16px] md:text-[18px] list-disc pl-5 marker:text-[var(--color-brand-tertiary)]">
            <li>Improve their quality.</li>
            <li>Extract meaningful information.</li>
            <li>Transform them into a different format.</li>
          </ul>
        </motion.div>

        <motion.img
          variants={fadeUp}
          className="rounded-[10px] w-full max-w-[500px] shadow-lg"
          src={imageDefinition}
          alt="Illustration"
          style={{
            backgroundColor: "var(--color-bg-muted)",
          }}
        />
      </motion.div>
      <ImageApplications />
      <ImageTechniques />
      <ImageProcessingShowcase />
    </div>
  );
};

export default Home;
