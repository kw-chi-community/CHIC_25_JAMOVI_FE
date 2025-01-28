import { useState } from "react";
import { Card, CardBody, CardHeader, Button, Collapse } from "@chakra-ui/react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";

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
            집어넣을 예정입니다. 로렘잇섬어쩌고저쩌고
          </p>
        </div>
      </div>
    </div>
  );
};

const Result = () => {
  const [items, setItems] = useState(["1", "2", "3"]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((prevItems) => {
        const oldIndex = prevItems.indexOf(active.id);
        const newIndex = prevItems.indexOf(over.id);
        const updatedItems = Array.from(prevItems);
        updatedItems.splice(oldIndex, 1);
        updatedItems.splice(newIndex, 0, active.id);
        return updatedItems;
      });
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
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
                    <Button variant="solid">export</Button>
                    <Button variant="solid">new project</Button>
                    <Button variant="solid">logout</Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleCollapse}
                      className="p-0"
                    >
                      {isCollapsed ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronUp className="h-4 w-4" />
                      )}
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
                    onClick={toggleCollapse}
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
      </div>
    </DndContext>
  );
};

export default Result;
