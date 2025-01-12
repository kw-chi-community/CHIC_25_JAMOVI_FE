import menu from "../../assets/HomeMenuIcon.svg";

const Header = () => {
  return (
    <div className="min-h-[3rem] flex items-center px-3 bg-white border border-b-gray">
      <div className="w-[3rem]">
        <button
          onClick={() => {
            console.log("버튼을클릭함");
          }}
        >
          <img src={menu} alt="menu icon"></img>
        </button>
      </div>

      <div className="w-full flex grid-cols-3 gap-5">
        <button
          className="py-1 px-2 rounded-xl text-sm font-medium text-black hover:bg-gray-100"
          onClick={() => {
            console.log("버튼을클릭함");
          }}
        >
          데이터
        </button>
        <button
          className="py-1 px-2 rounded-xl text-sm font-medium text-black hover:bg-gray-100"
          onClick={() => {
            console.log("버튼을클릭함");
          }}
        >
          분석
        </button>
        <button
          className="py-1 px-2 rounded-xl text-sm font-medium text-black hover:bg-gray-100"
          onClick={() => {
            console.log("버튼을클릭함");
          }}
        >
          해석
        </button>
      </div>
    </div>
  );
};

export default Header;
