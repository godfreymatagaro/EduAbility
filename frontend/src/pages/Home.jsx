import Hero from '../components/layout/Hero';
import SearchArea from '../components/features/SearchArea';
import Stats from '../components/layout/Stats';
import Reviews from '../components/layout/Reviews';
import CTA from '../components/layout/CTA';


const Home = () => {
  return (
    <div>
      <Hero />
      <SearchArea />
      <Stats />
      <Reviews />
      <CTA />
    </div>
  );
};

export default Home;