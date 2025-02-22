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
  const [error, setError] = useState("");

  const { createProject } = useProj();
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

    if (name.length > 250) {
      setNameError("프로젝트 이름이 너무 길어요. 250자 이내로 줄여주세요.");
      return;
    }

    if (new Blob([description]).size > 60000) {
      setError("프로젝트 설명이 너무 길어요. 길이를 줄여주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const newProject = await createProject({
        name: name.trim(),
        description: description.trim(),
      });

      if (!newProject.success) {
        if (newProject.detail === "name is tooo long") {
          setNameError("프로젝트 이름이 너무 길어요. 250자 이내로 줄여주세요.");
        } else if (newProject.detail === "description is tooo long") {
          setError("프로젝트 설명이 너무 길어요. 길이를 줄여주세요.");
        }
        return;
      }

      navigate(`/home?id=${newProject.project_id}`);
    } catch (err) {
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
