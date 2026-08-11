import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout({ children }) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default Layout;
