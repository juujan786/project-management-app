import React, { useState } from "react";
import { useSelector } from "react-redux";
import TaskModal from "../modals/TaskModal";

function Task({ colIndex, taskIndex }) {
  const boards = useSelector((state) => state.boards);
  const board = boards.find((board) => board.isActive === true);
  const columns = board.columns;
  const col = columns.find((col, i) => i === colIndex);
  const task = col.tasks.find((task, i) => i === taskIndex);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [deadline, setDeadline] = useState(task.deadline);

  let completed = 0;
  let subtasks = task.subtasks;
  subtasks.forEach((subtask) => {
    if (subtask.isCompleted) {
      completed++;
    }
  });

  const handleOnDrag = (e) => {
    e.dataTransfer.setData(
      "text",
      JSON.stringify({ taskIndex, prevColIndex: colIndex })
    );
  };

  return (
    <>
      <tr
        onClick={() => {
          setIsTaskModalOpen(true);
        }}
        draggable
        onDragStart={handleOnDrag}
        className="h-12 text-center border-b border-gray-400 shadow-gray-500 dark:shadow-[#000000] hover:shadow-md cursor-pointer"
      >
        <td>
          {task.title.length > 30
            ? `${task.title.slice(0, 28)}...`
            : task.title}
        </td>
        <td>{subtasks.length}</td>
        <td className="px-3">
          <span
            className={`py-2 px-6 border-none text-white ${
              task.status === "Todo" && "bg-green-500 "
            } ${task.status === "Doing" && "bg-purple-500 "} ${
              task.status === "Done" && "bg-sky-700 "
            } ${
              task.status !== "Todo" || "Doing" || "Done" ? "bg-[#635fc7]" : ""
            }  rounded-2xl`}
          >
            {task.status}
          </span>
        </td>
        <td className="px-3">
          <input
            type="date"
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              setDeadline(e.target.value);
            }}
            value={deadline}
            className={`z-[99999] py-2 px-6 border-none rounded-2xl ${
              (task.status === "Todo" || task.status === "Doing") &&
              deadline < new Date().toISOString().split("T")[0]
                ? "bg-red-300"
                : "bg-green-300"
            } text-white`}
          />
        </td>
      </tr>

      {isTaskModalOpen && (
        <TaskModal
          colIndex={colIndex}
          taskIndex={taskIndex}
          setIsTaskModalOpen={setIsTaskModalOpen}
        />
      )}
    </>
  );
}

export default Task;
