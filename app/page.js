import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Assortment from "@/components/Assortment";
import Benefits from "@/components/Benefits";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";
import AiAssistant from "@/components/AiAssistant";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Assortment />
        <Benefits />
        <Reviews />
        <Faq />
        <LeadForm />
      </main>
      <Footer />
      <AiAssistant />
    </>
  );
}
