import { useState } from "react";
import { Card, CardBody, CardHeader, Button } from "@chakra-ui/react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
      className="flex justify-between items-center border border-gray-300 p-2 mb-2 bg-white rounded shadow"
    >
      <span className="handle cursor-grab" {...attributes} {...listeners}>
        ☰
      </span>
      <span>{id}</span>
    </div>
  );
};

const Result = () => {
  const [items, setItems] = useState(["1", "2", "3"]);

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

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
    >
      <div className="p-4 w-full h-full">
        <Card className="h-full">
          <CardHeader className="w-full flex">
            <h1 className="w-1/2">결과</h1>
            <div className="w-1/2 flex justify-end space-x-4">
              <Button variant={"solid"}>export</Button>
              <Button variant={"solid"}>new project</Button>
              <Button variant={"solid"}>logout</Button>
            </div>
          </CardHeader>
          <hr className="mx-5" />
          <CardBody>
            <SortableContext items={items}>
              {items.map((id) => (
                <SortableItemComponent key={id} id={id} />
              ))}
            </SortableContext>
          </CardBody>
        </Card>
      </div>
    </DndContext>
  );
};

export default Result;
