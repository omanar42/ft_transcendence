import Chat from "./Home/Chat";
import Header from "./Header";
import Chaneels from "./Chaneels/Chaneels";

const Index = () => {
  return (
    <div className="w-[140rem]  max-w-140 -dark rounded-3xl text-white ml-auto mr-auto">
      <Header />
      <Chaneels />
      {/* <Chat /> */}
    </div>
  );
};

export default Index;
