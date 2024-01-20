import background from "../../../assets/background.png";
import robot from "../../../assets/Robot.png"
import omanar from "./assets/omanar.jpeg"
import omeslall from "./assets/omeslall.jpeg"
import mrobaii from "./assets/mrobaii.jpeg"

function AboutUs() {
  return (
    <div className="bg-indigo-900 relative overflow-hidden h-screen">
      <img src={background} className="absolute h-full w-full object-cover" />
      <div className="inset-0 bg-black opacity-50 absolute"></div>
      <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center py-32 xl:py-40">
        
        <h1 className="font-extrabold text-5xl text-center text-white leading-tight mt-4">
          About Us
        </h1>
        <div className="flex flex-wrap justify-center mt-10">
          <div className="w-1/3 px-20 mb-10">
            <img src={omanar} className="rounded-full w-[30rem]" alt="Oussama Manar" />
            <h2 className="text-xl text-white mt-5 font-bold text-center">Oussama Manar</h2>
          </div>

          
          <div className="w-1/3 px-20 mb-10">
            <img src={omeslall} className="rounded-full w-[30rem]" alt="Oussama Meslalla" />
            <h2 className="text-xl text-white mt-5 font-bold text-center">Oussama Meslalla</h2>
          </div>

          <div className="w-1/3 px-20 mb-10">
            <img src={mrobaii} className="rounded-full w-[30rem]" alt="Mohamed Robaii" />
            <h2 className="text-xl text-white mt-5 font-bold text-center">Mohamed Robaii</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;

