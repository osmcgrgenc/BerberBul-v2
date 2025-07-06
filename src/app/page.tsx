import dynamic from "next/dynamic";

const Header = dynamic(() => import("./components/Header"));
const HeroSection = dynamic(() => import("./components/HeroSection"), {
  loading: () => <p>Yükleniyor...</p>,
});
const CustomerBenefits = dynamic(
  () => import("./components/CustomerBenefits"),
  { loading: () => <p>Yükleniyor...</p> }
);
const BarberBenefits = dynamic(
  () => import("./components/BarberBenefits"),
  { loading: () => <p>Yükleniyor...</p> }
);
const Testimonials = dynamic(() => import("./components/Testimonials"), {
  loading: () => <p>Yükleniyor...</p>,
});
const Footer = dynamic(() => import("./components/Footer"));

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
