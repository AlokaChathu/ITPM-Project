import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import BgImg from "../assets/backgroundImage.png";

function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 scale-110 bg-cover bg-center bg-no-repeat blur-sm"
        style={{ backgroundImage: `url(${BgImg})` }}
        aria-hidden
      />

      <div className="relative z-10 pointer-events-auto">
        <Navbar />
        <Header />
      </div>
    </div>
  );
}

export default Home;
