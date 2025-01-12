import React from "react";
import CloseIcon from "../../assets/SideCloseIcon.svg";
import NewProjectIcon from "../../assets/SideNewProjectIcon.svg";
import OpenProjectIcon from "../../assets/SideOpenProjectIcon.svg";
import SaveIcon from "../../assets/SideSaveIcon.svg";
import SaveAsIcon from "../../assets/SideSaveAsIcon.svg";
import ExportIcon from "../../assets/SideExportIcon.svg";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    {
      icon: (
        <img
          src={NewProjectIcon}
          alt="새로운 프로젝트"
          width="20"
          height="20"
        />
      ),
      text: "새로운 프로젝트",
    },
    {
      icon: (
        <img
          src={OpenProjectIcon}
          alt="기존 프로젝트 열기"
          width="20"
          height="20"
        />
      ),
      text: "기존 프로젝트 열기",
    },
    {
      icon: <img src={SaveIcon} alt="저장하기" width="20" height="20" />,
      text: "저장하기",
    },
    {
      icon: (
        <img src={SaveAsIcon} alt="다른 이름으로 저장" width="20" height="20" />
      ),
      text: "다른 이름으로 저장",
    },
    {
      icon: <img src={ExportIcon} alt="내보내기" width="20" height="20" />,
      text: "내보내기",
    },
  ];

  return (
    <div>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 p-2 rounded-md hover:bg-gray-100"
          >
            <img src={CloseIcon} alt="닫기" width="24" height="24" />
          </button>

          <div className="mt-12">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                {item.icon}
                <span>{item.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
