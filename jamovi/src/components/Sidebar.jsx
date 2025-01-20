import { DrawerBody, DrawerHeader, Button, Tooltip } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <DrawerHeader borderBottomWidth="1px">광데이터</DrawerHeader>
      <DrawerBody>
        <div className="flex flex-col items-start gap-2">
          <Tooltip
            hasArrow
            bg="gray.300"
            color="black"
            label="현재 프로젝트를 저장하고 새로운 프로젝트를 시작합니다."
          >
            <Button colorScheme="teal" variant="ghost">
              프로젝트 새로 만들기
            </Button>
          </Tooltip>
          <Tooltip
            hasArrow
            bg="gray.300"
            color="black"
            label="로그아웃한 뒤 홈으로 돌아갑니다."
          >
            <Button
              colorScheme="teal"
              variant="ghost"
              onClick={handleNavigateToLogin}
            >
              로그아웃
            </Button>
          </Tooltip>
        </div>
      </DrawerBody>
    </>
  );
};

export default Sidebar;
