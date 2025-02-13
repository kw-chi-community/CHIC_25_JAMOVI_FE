// src/components/SelectProject.jsx
import React, { useEffect } from "react";
import { Card, Button, Spinner, Text, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useProj from "../hooks/useProj"; // useProj 훅 임포트

const SelectProject = () => {
  const { projects, isLoading, error, fetchProjects } = useProj();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (error) {
      toast({
        title: "오류",
        description: error,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  const handleCreateProject = () => {
    navigate("/create-project");
  };

  const handleSelectProject = (projectId) => {
    navigate(`/home?id=${projectId}`);
  };

  return (
    <div className="flex justify-center items-center p-4 w-full">
      <Card className="w-full max-w-2xl min-h-[80vh] m-auto mt-[10vh] p-5 shadow-lg">
        <h1 className="text-2xl font-bold mb-4">프로젝트 목록</h1>
        <hr className="my-5" />

        {isLoading && (
          <div className="flex justify-center items-center my-4">
            <Spinner size="lg" />
            <Text className="ml-2">프로젝트를 불러오는 중...</Text>
          </div>
        )}

        {/* 프로젝트 목록 표시 */}
        {!isLoading && !error && (
          <>
            {projects.length === 0 ? (
              <Text className="text-center text-gray-500">
                프로젝트가 없습니다.
              </Text>
            ) : (
              <ul className="space-y-2">
                {projects.map((project) => (
                  <li
                    key={project.id}
                    className="p-4 border rounded-lg hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectProject(project.id)}
                  >
                    <Text className="font-semibold">{project.name}</Text>
                    <Text className="text-sm text-gray-500">
                      {project.visibility === "public" ? "공개" : "비공개"}
                    </Text>
                    <Text className="text-xs text-gray-400">
                      {project.description}
                    </Text>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* 새 프로젝트 만들기 버튼 */}
        <div className="flex justify-end mt-6">
          <Button
            className="w-1/4"
            variant="solid"
            colorScheme="blue"
            onClick={handleCreateProject}
          >
            새 프로젝트 만들기
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SelectProject;
