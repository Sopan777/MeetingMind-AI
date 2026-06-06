import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import IntegrationsSection from "@/components/landing/IntegrationsSection";
import PricingSection from "@/components/landing/PricingSection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden">
      <Navbar />
      <HeroSection />

      {/* Divider gradient */}
      <div className="mx-auto max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <FeaturesSection />

      <div className="mx-auto max-w-4xl h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />

      <IntegrationsSection />

      <div className="mx-auto max-w-4xl h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <PricingSection />

      {/* CTA Section before footer */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Ready to Transform Your{" "}
            <span className="gradient-text">Meetings</span>?
          </h2>
          <p className="text-dark-300 text-lg mb-8 max-w-lg mx-auto">
            Join thousands of teams already using MeetingMind AI to turn
            conversations into results.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#"
              className="group relative px-8 py-4 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
              <span className="relative">Start Free Trial →</span>
            </a>
            <a
              href="#"
              className="px-8 py-4 rounded-xl font-semibold glass border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300"
            >
              Schedule a Demo
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
