import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  Button,
  Collapse,
  useToast,
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
import { DndContext } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import useProj from "../hooks/useProj"; // ✅ useProj 훅 임포트

const SortableItemComponent = ({ id }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, handle: ".handle" });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex justify-between p-2 mb-2 items-start hover:bg-[#EDF2F7] rounded transition-colors duration-100"
    >
      <span
        className="handle cursor-grab text-gray-300"
        {...attributes}
        {...listeners}
      >
        ☰
      </span>
      <div className="flex-grow">
        <div className="px-2">
          <h1>대응표본 T 검증</h1>
          <p>
            본 연구 결과 p값은 0.189로 유의미한지는 모르겠지만 어쨌든 결과가
            나왔습니다. 이 자리에는 이런 식으로 llm이 생성해준 값을 대충
            집어넣을 예정입니다.
          </p>
        </div>
      </div>
    </div>
  );
};

const Result = () => {
  const navigate = useNavigate();
  const handleNavigateToLogin = () => {
    navigate("/login");
  };
  const location = useLocation();
  const { getProject, updateProject, delProj } = useProj(); // ✅ 프로젝트 관련 함수 사용
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const queryParams = new URLSearchParams(location.search);
  const projectId = queryParams.get("id");

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false); // ✅ 추가: Collapse 상태
  const [items, setItems] = useState(["1", "2", "3"]); // ✅ 추가: items 상태

  useEffect(() => {
    console.log("현재 프로젝트 ID:", projectId);
  }, [projectId]);

  const handleEditProject = async () => {
    if (!projectId) return;

    try {
      const projectData = await getProject(Number(projectId)); // ✅ projectId를 숫자로 변환
      setNewName(projectData.name);
      setNewDescription(projectData.description || "");
      onOpen(); // ✅ 모달 열기
    } catch (err) {
      toast({
        title: "불러오기 실패",
        description: err.message || "프로젝트 정보를 불러오는 중 오류가 발생했습니다.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleUpdateProject = async () => {
    if (!projectId) return;

    try {
      await updateProject(Number(projectId), {
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

      onClose(); // ✅ 모달 닫기
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

  const toggleCollapse = () => { // ✅ 추가: Collapse 상태 토글 함수
    setIsCollapsed(!isCollapsed);
  };

  return (
    <DndContext
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
    >
      <div className="pl-2 p-4 w-full h-full">
        <Card className="w-full h-full">
          <div className="w-full px-6">
            <Collapse in={!isCollapsed} animateOpacity>
              <div className="transition-all">
                <div className="w-full flex items-center my-4">
                  <div className="w-1/2">
                    <h1>결과</h1>
                  </div>
                  <div className="w-1/2 flex justify-end space-x-4">
                    <Button variant="solid" colorScheme="red" onClick={() => delProj(Number(projectId))}>
                      Delete
                    </Button>
                    <Button variant="solid" onClick={() => navigate("/project")}>
                      Go to Project
                    </Button>
                    <Button variant="solid" colorScheme="blue" onClick={handleEditProject}>
                      Edit Project
                    </Button>
                    <Button variant="solid" onClick={handleNavigateToLogin}>
                      logout
                    </Button>
                  </div>
                </div>
                <hr />
              </div>
            </Collapse>
          </div>
          <div className="h-full px-5">
            {isCollapsed && <div className="m-5" />}

            <div className="flex w-full h-full">
              <div className="w-3/4 pt-0 pl-0 p-5">
                {!isCollapsed && <div className="pt-5" />}
                <SortableContext items={items}>
                  {items.map((id) => (
                    <SortableItemComponent key={id} id={id} />
                  ))}
                </SortableContext>
              </div>

              <div className="w-1/4 h-full pl-5 border-l border-gray-200">
                <Collapse in={isCollapsed} animateOpacity>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleCollapse} // ✅ 수정: Collapse 버튼 작동
                    className="flex w-full mb-2"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </Collapse>
                <div>asdfasdf</div>
              </div>
            </div>
          </div>
        </Card>

        {/* 프로젝트 수정 모달 */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>프로젝트 수정</ModalHeader>
            <ModalBody>
              <Input
                placeholder="새 프로젝트 이름"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                mb={3}
              />
              <Textarea
                placeholder="새 프로젝트 설명"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose} mr={3}>취소</Button>
              <Button colorScheme="blue" onClick={handleUpdateProject}>수정</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </DndContext>
  );
};

export default Result;
