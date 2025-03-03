// src/components/SelectProject.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Spinner,
  Text,
  useToast,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FiMoreVertical } from "react-icons/fi"; // 점 세 개 아이콘
import useProj from "../hooks/useProj"; // useProj 훅 임포트

const SelectProject = () => {
  const { projects, isLoading, error, fetchProjects, delProj, updateProject } = useProj();
  const navigate = useNavigate();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProject, setSelectedProject] = useState(null);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

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

  const handleEditProject = async () => {
    if (!selectedProject) return;

    try {
      await updateProject(selectedProject.id, {
        name: newName,
        description: newDescription,
      });

      toast({
        title: "수정 완료",
        description: "프로젝트가 성공적으로 수정되었습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      fetchProjects(); // 수정 후 목록 다시 불러오기
      onClose();
    } catch (err) {
      toast({
        title: "수정 실패",
        description: err.message || "프로젝트 수정 중 오류가 발생했습니다.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
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
                    className="p-4 border rounded-lg flex justify-between items-center hover:bg-gray-100"
                  >
                    <div
                      className="cursor-pointer flex-1"
                      onClick={() => handleSelectProject(project.id)}
                    >
                      <Text className="font-semibold">{project.name}</Text>
                      <Text className="text-sm text-gray-500">
                        {project.visibility === "public" ? "공개" : "비공개"}
                      </Text>
                      <Text className="text-xs text-gray-400">
                        {project.description}
                      </Text>
                    </div>

                    {/* 점 세 개 메뉴 버튼 */}
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<FiMoreVertical />}
                        variant="ghost"
                        aria-label="옵션 열기"
                      />
                      <MenuList>
                        {/* 수정 버튼 */}
                        <MenuItem
                          onClick={() => {
                            setSelectedProject(project);
                            setNewName(project.name);
                            setNewDescription(project.description || "");
                            onOpen();
                          }}
                        >
                          수정
                        </MenuItem>

                        {/* 삭제 버튼 */}
                        <MenuItem
                          onClick={async () => {
                            try {
                              await delProj(project.id);
                              toast({
                                title: "삭제 완료",
                                description: "프로젝트가 성공적으로 삭제되었습니다.",
                                status: "success",
                                duration: 3000,
                                isClosable: true,
                              });
                            } catch (err) {
                              toast({
                                title: "삭제 실패",
                                description:
                                  err.message || "프로젝트 삭제 중 오류가 발생했습니다.",
                                status: "error",
                                duration: 5000,
                                isClosable: true,
                              });
                            }
                          }}
                          color="red.500"
                        >
                          삭제
                        </MenuItem>
                      </MenuList>
                    </Menu>
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

      {/* 프로젝트 수정 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>프로젝트 수정</ModalHeader>
          <ModalBody>
            <Text mb={2}>프로젝트 이름</Text>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="새 프로젝트 이름"
            />
            <Text mt={4} mb={2}>프로젝트 설명</Text>
            <Textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="새 프로젝트 설명"
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3}>취소</Button>
            <Button colorScheme="blue" onClick={handleEditProject}>수정</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SelectProject;
