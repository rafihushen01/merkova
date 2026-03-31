import React from "react";
import Nav from "../Nav.jsx";
import Homebannercard from "../Customers/Homebannercard";
import Footer from "../Customers/Footer.jsx";
import Categorycard from "../Customers/Categorycard.jsx";
import Justforu from "../Customers/Justforu.jsx";
import Middlepart from "../Customers/Middlepart.jsx";
import SubNav from "../Customers/SubNav.jsx";


const UserDashboard = () => {
  return (
    <div className="w-full relative">

      {/* ================= FIXED HEADER STACK ================= */}
      <div className="fixed top-0 left-0 w-full z-[100000]">

        {/* SUB NAV — stays visible */}
        <div className="relative  z-[1000000]">
          <SubNav />
        </div>

        {/* MAIN NAV */}
        <div className="absolute top-100 z-[100000]">
          <Nav />
        </div>

      </div>

      {/* ================= PAGE CONTENT ================= */}
      {/* EXACT HEIGHT = SubNav + Nav */}
      <div className="pt-[163.5px]">

        <Homebannercard />

        <div className="mt-20">
          <Middlepart />
        </div>

        <div className="mt-10">
          <Categorycard />
        </div>

        <div className="mt-10">
          <Justforu />
        </div>

        <Footer />
      </div>

    </div>
  );
};

export default UserDashboard;
