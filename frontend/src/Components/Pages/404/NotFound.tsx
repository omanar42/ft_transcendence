import background from "../../../assets/background.png";
import robot from "../../../assets/Robot.png"
function NotFound() {
  return (
    <div className="bg-indigo-900 relative overflow-hidden h-screen ">
      <img src={background} className="absolute h-full w-full object-cover" />
      <div className="inset-0 bg-black opacity-25 absolute"></div>
      <div className="container mx-auto px-6 md:px-12 relative z-10 flex items-center py-32 xl:py-40">
        
        <div className="w-full font-mono flex flex-col items-center relative z-10">
          <h1 className="font-extrabold text-5xl text-center text-white leading-tight mt-4">
             You are all alone here
          </h1>
          <p className="font-extrabold text-[15rem] my-44 text-white animate-bounce">
             404 
          </p>
          <img className="absolute h-[40rem] right-[40rem] top-[30rem]" src={robot} />
        </div>
      </div>
    </div>
  );
}

export default NotFound;
