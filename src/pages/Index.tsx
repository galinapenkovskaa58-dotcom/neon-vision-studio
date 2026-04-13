import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Portfolio from '@/components/landing/Portfolio';
import Styles from '@/components/landing/Styles';
import Tariffs from '@/components/landing/Tariffs';
import Reviews from '@/components/landing/Reviews';
import BookingForm from '@/components/landing/BookingForm';
import Footer from '@/components/landing/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Portfolio />
      <Styles />
      <Tariffs />
      <Reviews />
      <BookingForm />
      <Footer />
    </div>
  );
};

export default Index;
