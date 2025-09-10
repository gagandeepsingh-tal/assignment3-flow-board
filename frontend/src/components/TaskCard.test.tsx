import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskCard from "./TaskCard";
import { BoardProvider } from "../state/context";
import { Task } from "../state/types";

function renderWithProvider(ui: React.ReactElement) {
  return render(<BoardProvider>{ui}</BoardProvider>);
}

describe("TaskCard", () => {
  const task: Task = { id: "t1", title: "Hello", column: "todo" };

  it("shows delete affordance on hover and calls request delete", () => {
    const onRequestDelete = vi.fn();
    renderWithProvider(<TaskCard task={task} onRequestDelete={onRequestDelete} />);
    const card = screen.getByText("Hello");
    fireEvent.mouseOver(card);
    const deleteBtn = screen.getByLabelText("Delete task");
    fireEvent.click(deleteBtn);
    expect(onRequestDelete).toHaveBeenCalledTimes(1);
  });

  it("enters edit on double click and validates input", () => {
    renderWithProvider(
      <TaskCard task={task} onRequestDelete={() => {}} />
    );
    const card = screen.getByText("Hello");
    fireEvent.doubleClick(card);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.blur(input);
    // Should keep editing due to invalid value; show error
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByText(/Title cannot be empty/i)).toBeInTheDocument();
  });
});


