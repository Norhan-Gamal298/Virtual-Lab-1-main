import { useRef } from "react";

import imageDefinition from "../assets/homepage-defintion.jpg";
import Hero from "../components/Hero";
import ImageApplications from "../components/ImageApplications";
import ImageTechniques from "../components/ImageTechniques";
import ImageFeatures from "../components/ImageFeatures";
import PageIntro from "../components/PageIntro";
import PageOutro from "../components/PageOutro";

import featureMedicalDarkImg from "../assets/X-Ray-dark.png";
import featureMedicalLightImg from "../assets/X-Ray-light.png";
import featureRecognitionDarkImg from "../assets/Image-recognition-dark.png";
import featureRecognitionLightImg from "../assets/Image-recognition-light.png";
import featureEnhancementDarkImg from "../assets/Image-enhancement-dark.png";
import featureEnhancementLightImg from "../assets/Image-enhancement-light.png";
import featureSatelliteDarkImg from "../assets/Satellite-Image-Analysis-dark.png";
import featureSatelliteLightImg from "../assets/Satellite-Image-Analysis-light.png";
import featureIsolationDarkImg from "../assets/Isolation_Mode-dark.png";
import featureIsolationLightImg from "../assets/Isolation_Mode-light.png";



const Home = () => {
  const pageIntroRef = useRef(null);
  const scrollToIntro = () => {
    if (pageIntroRef.current) {
      pageIntroRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  const features = [
    {
      title: "Medical Image Analysis",
      description: "Used in hospitals and research to detect diseases from X-rays, MRIs, and CT scans. Image processing helps doctors identify issues more accurately and faster.",
      darkImage: featureMedicalDarkImg,
      lightImg: featureMedicalLightImg,
    },
    {
      title: "Face Recognition",
      description: "From unlocking your phone to tagging friends on social media — image processing powers facial recognition by identifying key facial features.",
      darkImage: featureRecognitionDarkImg,
      lightImg: featureRecognitionLightImg
    },
    {
      title: "Image Enhancement in Photography Apps",
      description: "Ever used filters or improved a blurry photo?That’s image processing at work — enhancing brightness, sharpness, and colors in real time.",
      darkImage: featureEnhancementDarkImg,
      lightImg: featureEnhancementLightImg
    },
    {
      title: " Satellite Image Analysis",
      description: "Used to monitor climate change, track deforestation, or detect changes in cities.Image processing makes it easier to analyze huge amounts of satellite data visually.",
      darkImage: featureSatelliteDarkImg,
      lightImg: featureSatelliteLightImg,
    },
    {
      title: "Reading Text from Images (OCR)",
      description: "Extracting printed or handwritten text from documents, signs, or receipts — a technique called Optical Character Recognition (OCR), powered by image processing.",
      darkImage: featureIsolationDarkImg,
      lightImg: featureIsolationLightImg,
    },
  ];

  return (
    <div className="text-center relative h-full w-full">
      <Hero onLearnMoreClick={scrollToIntro} />
      <PageIntro ref={pageIntroRef} />
      <ImageFeatures />
      <hr className="w-[90%] mx-[auto] featuresDivider" />
      <ImageApplications features={features} />
      <ImageTechniques />
      <hr className="w-[90%] mx-[auto] featuresDivider transition-all duration-300" />
      <PageOutro />
    </div>
  );
};

export default Home;


