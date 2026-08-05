import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <Navbar />
      {children}
    </>
  );
}

export default Layout;
