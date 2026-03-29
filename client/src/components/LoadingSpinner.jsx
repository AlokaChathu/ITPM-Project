import { motion as Motion } from "framer-motion";
import BgImg from "../assets/BackgrounMain.jpg";

const LoadingSpinner = () => {
  return (
    <div className="relative min-h-screen flex justify-center items-center">
      <img
        src={BgImg}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover filter "
      />

      <div className="absolute inset-0 bg-black/30" />

      <Motion.div
        className="relative w-16 h-16 border-4 border-t-4 border-t-black border-blue-200 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default LoadingSpinner;
