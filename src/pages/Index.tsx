import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import DirectionsMarquee from '@/components/landing/DirectionsMarquee';
import About from '@/components/landing/About';
import Services from '@/components/landing/Services';
import Process from '@/components/landing/Process';
import Features from '@/components/landing/Features';
import Reviews from '@/components/landing/Reviews';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <DirectionsMarquee />
      <About />
      <Services />
      <Process />
      <Features />
      <Reviews showServiceLinks />
      <DirectionsMarquee />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
