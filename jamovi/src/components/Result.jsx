import { Card, CardBody, CardHeader, Button } from "@chakra-ui/react";

const Result = () => {
  return (
    <div className="p-4 w-full h-full">
      <Card className="h-full">
        <CardHeader className="w-full flex">
          <h1 className="w-1/2">결과</h1>
          <div className="w-1/2 flex justify-end space-x-4  ">
            <Button variant={"solid"}>export</Button>
            <Button variant={"solid"}>new project</Button>
            <Button variant={"solid"}>logout</Button>
          </div>
        </CardHeader>
        <hr className="mx-5" />
        <CardBody>body</CardBody>
      </Card>
    </div>
  );
};

export default Result;
