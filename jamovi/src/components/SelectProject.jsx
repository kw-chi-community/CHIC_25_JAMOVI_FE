// src/components/SelectProject.jsx
import React from "react";
import { Card, Button, Spinner, Text, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate 훅
import useProj from "../hooks/useProj"; // useProj 훅 임포트

const SelectProject = () => {
  const { projects, isLoading, error, fetchProjects } = useProj(); // useProj 훅 사용
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const toast = useToast(); // 사용자에게 알림을 표시하기 위한 훅

  // 새 프로젝트 만들기 버튼 클릭 핸들러
  const handleCreateProject = () => {
    navigate("/create-project");
  };

  // 프로젝트 선택 시의 핸들러 (예: 프로젝트 상세 페이지로 이동)
  const handleSelectProject = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  // 다시 시도 버튼 클릭 핸들러
  const handleRetry = () => {
    fetchProjects();
  };

  return (
    <div className="flex justify-center items-center p-4 w-full">
      <Card className="w-full max-w-2xl min-h-[80vh] m-auto mt-[10vh] p-5 shadow-lg">
        <h1 className="text-2xl font-bold mb-4">프로젝트 목록</h1>
        <hr className="my-5" />

        {/* 로딩 상태 표시 */}
        {isLoading && (
          <div className="flex justify-center items-center my-4">
            <Spinner size="lg" />
            <Text className="ml-2">프로젝트를 불러오는 중...</Text>
          </div>
        )}

        {/* 오류 상태 표시 */}
        {error && (
          <div className="flex flex-col items-center my-4">
            <Text className="text-red-500 mb-2">오류: {error}</Text>
            <Button onClick={handleRetry} colorScheme="teal">
              다시 시도
            </Button>
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
