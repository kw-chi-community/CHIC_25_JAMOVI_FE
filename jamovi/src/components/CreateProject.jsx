// src/components/CreateProject.jsx
import React, { useState, useCallback } from "react";
import {
  Card,
  Input,
  Button,
  Textarea,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useProj from "../hooks/useProj"; // useProj 훅 임포트

const CreateProject = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameError, setNameError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createProject, error } = useProj();
  const navigate = useNavigate();

  const handleNameChange = useCallback((e) => {
    setName(e.target.value);
    if (e.target.value.trim() === "") {
      setNameError("프로젝트 이름은 필수입니다.");
    } else {
      setNameError("");
    }
  }, []);

  const handleDescriptionChange = useCallback((e) => {
    setDescription(e.target.value);
  }, []);

  const handleCreate = async () => {
    // 유효성 검사
    if (name.trim() === "") {
      setNameError("프로젝트 이름은 필수입니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      const newProject = await createProject({
        name: name.trim(),
        description: description.trim(),
      });
      // 성공 시 프로젝트 목록 페이지로 이동
      navigate("/projects");
    } catch (err) {
      // 오류는 useProj 훅에서 처리되므로 추가적인 처리 필요 없음
      // 필요 시 추가적인 오류 처리 로직을 구현할 수 있습니다.
      console.error("프로젝트 생성 오류:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center p-4 w-full">
      <Card className="w-full max-w-lg min-h-[80vh] m-auto mt-[10vh] p-5 shadow-lg">
        <h1 className="text-2xl font-bold mb-4">새 프로젝트 생성</h1>
        <hr className="my-4" />
        <FormControl isInvalid={nameError !== ""} mb={4}>
          <FormLabel>프로젝트 이름</FormLabel>
          <Input
            placeholder="프로젝트 이름을 입력하세요"
            value={name}
            onChange={handleNameChange}
          />
          {nameError && <FormErrorMessage>{nameError}</FormErrorMessage>}
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>설명 (선택)</FormLabel>
          <Textarea
            placeholder="프로젝트에 대한 설명을 입력하세요"
            value={description}
            onChange={handleDescriptionChange}
          />
        </FormControl>

        {/* 오류 메시지 표시 */}
        {error && (
          <div className="mb-4">
            <FormErrorMessage>{error}</FormErrorMessage>
          </div>
        )}

        <Button
          colorScheme="blue"
          onClick={handleCreate}
          isLoading={isSubmitting}
          loadingText="만들는 중..."
        >
          만들기
        </Button>
      </Card>
    </div>
  );
};

export default CreateProject;
