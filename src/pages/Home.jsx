import imageDefinition from "../assets/homepage-defintion.jpg";
import Hero from "../components/Hero";
import ImageApplications from "../components/ImageApplications";
import ImageTechniques from "../components/ImageTechniques";
import ImageProcessingShowcase from "../components/ImageProcessingShowcase";
import ImageFeatures from "../components/ImageFeatures";
import PageIntro from "../components/PageIntro";
import PageOutro from "../components/PageOutro";

import featureMedicalDarkImg from "../assets/X-Ray-dark.png";
import featureRecognitionDarkImg from "../assets/Image-recognition-dark.png";
import featureEnhancementDarkImg from "../assets/Image-enhancement-dark.png";
import featureSatelliteDarkImg from "../assets/Satellite-Image-Analysis-dark.png";
import featureIsolationDarkImg from "../assets/Isolation_Mode-dark.png";



const Home = () => {

  const features = [
    {
      title: "Medical Image Analysis",
      description: "Used in hospitals and research to detect diseases from X-rays, MRIs, and CT scans. Image processing helps doctors identify issues more accurately and faster.",
      image: featureMedicalDarkImg
    },
    {
      title: "Face Recognition",
      description: "From unlocking your phone to tagging friends on social media — image processing powers facial recognition by identifying key facial features.",
      image: featureRecognitionDarkImg
    },
    {
      title: "Image Enhancement in Photography Apps",
      description: "Ever used filters or improved a blurry photo?That’s image processing at work — enhancing brightness, sharpness, and colors in real time.",
      image: featureEnhancementDarkImg
    },
    {
      title: " Satellite Image Analysis",
      description: "Used to monitor climate change, track deforestation, or detect changes in cities.Image processing makes it easier to analyze huge amounts of satellite data visually.",
      image: featureSatelliteDarkImg
    },
    {
      title: "Reading Text from Images (OCR)",
      description: "Extracting printed or handwritten text from documents, signs, or receipts — a technique called Optical Character Recognition (OCR), powered by image processing.",
      image: featureIsolationDarkImg
    },
  ];

  return (
    <div className="text-center relative h-full w-full">
      <Hero />
      <PageIntro />
      <ImageFeatures />
      <hr className="w-[90%] mx-[auto] featuresDivider" />
      <ImageApplications features={features} />
      <ImageTechniques />
      <hr className="w-[90%] mx-[auto] featuresDivider" />
      <PageOutro />
    </div>
  );
};

export default Home;


