import dynamic from "next/dynamic";

const HeroSection = dynamic(() => import("./components/HeroSection"));
const Footer = dynamic(() => import("./components/Footer"));
const CustomerBenefits = dynamic(() => import("./components/CustomerBenefits"));
const BarberBenefits = dynamic(() => import("./components/BarberBenefits"));
const Testimonials = dynamic(() => import("./components/Testimonials"));
const CategorySelection = dynamic(
  () => import("./components/CategorySelection")
);
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col pt-16">
      <HeroSection />
      <CategorySelection />
      <CustomerBenefits />
      <BarberBenefits />
      <Testimonials />
      <Footer />
    </div>
  );
}
