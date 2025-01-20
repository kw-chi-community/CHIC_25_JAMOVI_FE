import React, { useEffect } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import DataTable from "./DataTable";

const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [placement, setPlacement] = React.useState("right");

  useEffect(() => {
    onOpen();
    const handleMouseMove = (event) => {
      if (window.innerWidth - event.clientX <= 10) {
        onOpen();
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [onOpen]);

  return (
    <div className="w-full min-h-screen flex bg-gray-50">
      <div className="w-1/2 min-h-full p-5">
        <DataTable />
      </div>
      <Drawer placement={placement} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <Sidebar />
        </DrawerContent>
      </Drawer>
      <div></div>
    </div>
  );
};

export default Home;
