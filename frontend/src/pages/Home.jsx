import AnnouncementBar from "../components/AnnouncementBar";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import HighlightsSection from "../components/HighlightsSection";

function Home() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <Navbar />
      <HeroSection />
      <HighlightsSection />
    </>
  );
}

export default Home;