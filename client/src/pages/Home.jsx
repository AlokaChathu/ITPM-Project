import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import BgImg from "../assets/Background1.jpg";

function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat  scale-110"
        style={{ backgroundImage: `url(${BgImg})` }}
      />

      <div className="absolute inset-0 0" />

      <div className="relative z-10">
        <Navbar />
        <Header />
      </div>

    </div>
  );
}

export default Home;
