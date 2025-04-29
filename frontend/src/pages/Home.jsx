import Hero from '../components/layout/Hero';
import SearchArea from '../components/features/SearchArea';
import Stats from '../components/layout/Stats';
import Reviews from '../components/layout/Reviews';
import CTA from '../components/layout/CTA';
import Footer from '../components/layout/Footer';


const Home = () => {
  return (
    <div>
      <Hero />
      <SearchArea />
      <Stats />
      <Reviews />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;