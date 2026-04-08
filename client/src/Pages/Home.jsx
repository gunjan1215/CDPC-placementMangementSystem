import React from "react";
import Navbar from "../Components/Navbar/Navbar";
import Recruitersrow from '../Components/RecruitersRow/RecruitersRow';
import Features from "../Components/Features/Features";
import PlacementCellInfo from "../Components/PlacementCellInfo/PlacementCellInfo";
import FrontPage from "../Components/FrontPage/FrontPage";
import Footer from "../Components/Footer/Footer";
import PlacementStatistics from "../Components/Charts/PlacementStatistics";

function Home() {
  return (
    <div>
      <Navbar />
      
      {/* 1. Home Section - This is the landing hero area */}
      <div id="home">
        <FrontPage />
      </div>

      {/* 2. Facilities Section */}
      <div id="facilities">
        <Features/>
      </div>

      {/* 3. Recruiters Section */}
      <div id="recruiters">
        <Recruitersrow/>
      </div>

      {/* 4. Announcements Section - Using Statistics as the anchor */}
      <div id="announcements">
        <PlacementStatistics/>
      </div>

      {/* 5. About Section - Matches the 'About' tab in your navbar */}
      <div id="about">
        <PlacementCellInfo/>
      </div>

      {/* 6. Contact Section - Usually linked to the Footer */}
      <div id="contact">
        <Footer/>
      </div>
    </div>
  );
}

export default Home;