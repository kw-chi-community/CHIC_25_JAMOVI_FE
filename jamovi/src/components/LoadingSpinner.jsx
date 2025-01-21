import React from "react";
import { Spinner, Text, VStack } from "@chakra-ui/react";

const LoadingSpinner = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <VStack colorPalette="teal">
        <Spinner color="colorPalette.600" />
        <Text color="colorPalette.600">불러오는 중...</Text>
      </VStack>
    </div>
  );
};

export default LoadingSpinner;
