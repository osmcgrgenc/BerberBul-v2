import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import CustomerBenefits from "./components/CustomerBenefits";
import BarberBenefits from "./components/BarberBenefits";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HeroSection />
      <CustomerBenefits />
      <BarberBenefits />
      <Testimonials />
      <Footer />
    </div>
  );
}
