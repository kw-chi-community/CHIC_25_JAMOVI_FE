import { Card, Button } from "@chakra-ui/react";

const SelectProject = () => {
  return (
    <>
      <div className="flex">
        <Card className="w-1/2 min-h-[80vh] m-auto mt-[10vh] p-5">
          <h1>프로젝트 목록</h1>
          <hr className="my-5" />
          <Button className="w-1/4" variant="solid">
            새 프로젝트 만들기
          </Button>
          <ul>
            <li>${name}</li>
          </ul>
        </Card>
      </div>
    </>
  );
};

export default SelectProject;
