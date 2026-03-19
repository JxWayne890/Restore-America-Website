/*
 * STORM SHIELD DESIGN — Home Page
 * Full landing page assembling all sections
 * SEO-optimized structure with schema markup (in index.html)
 */
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsBar from "@/components/StatsBar";
import ServicesSection from "@/components/ServicesSection";
import TrustSection from "@/components/TrustSection";
import ReviewsSection from "@/components/ReviewsSection";
import FaqSection from "@/components/FaqSection";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "Roboto, sans-serif" }}>
      <Navbar />
      <HeroSection />
      <StatsBar />
      <ServicesSection />
      <TrustSection />
      <ReviewsSection />
      <FaqSection />
      <CtaBanner />
      <Footer />
    </div>
  );
}

