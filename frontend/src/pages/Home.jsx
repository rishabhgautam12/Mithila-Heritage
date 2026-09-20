import Hero from "../components/sections/Hero";
import BrandStory from "../components/sections/BrandStory";
import Experiences from "../components/sections/Experiences";
import RoomsPreview from "../components/sections/RoomsPreview";
import DiningPreview from "../components/sections/DiningPreview";
import RelaxSection from "../components/sections/RelaxSection";
import BanquetPreview from "../components/sections/BanquetPreview";
import ConferencePreview from "../components/sections/ConferencePreview";
import WhyUs from "../components/sections/WhyUs";
import GalleryPreview from "../components/sections/GalleryPreview";
import TestimonialsShowcase from "../components/sections/TestimonialsShowcase";
import CTABanner from "../components/sections/CTABanner";
import MithilaBorder from "../components/ui/MithilaBorder";

export default function Home() {
  return (
    <>
      <Hero />
      <MithilaBorder />
      <BrandStory />
      <Experiences />
      <RoomsPreview />
      <DiningPreview />
      <RelaxSection />
      <BanquetPreview />
      <ConferencePreview />
      <MithilaBorder />
      <WhyUs />
      <MithilaBorder flip />
      <GalleryPreview />
      <TestimonialsShowcase />
      <CTABanner />
    </>
  );
}