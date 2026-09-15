import Hero from "@/components/Hero";
import Specialties from "@/components/Specialties";
import About from "@/components/About";
import FeaturedRealisations from "@/components/FeaturedRealisations";
import Testimonials from "@/components/Testimonials";
import ServiceArea from "@/components/ServiceArea";
import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <>
      <Hero />
      <Specialties />
      <About />
      <FeaturedRealisations />
      <Testimonials />
      <ServiceArea />
      <ContactForm />
    </>
  );
}
