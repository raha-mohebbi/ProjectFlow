import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// ── Mock Supabase before importing the component ──────────────
vi.mock("../lib/supabase", () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
  },
}));

import { supabase } from "../lib/supabase";
import CreateTaskModal from "../components/CreateTaskModal";

const onClose = vi.fn();

const renderModal = (isOpen = true) =>
  render(<CreateTaskModal isOpen={isOpen} onClose={onClose} />);

// Helper: build the `from().insert().select().single()` chain mock
const setupInsertChain = (result = { data: { id: "t1" }, error: null }) => {
  const single = vi.fn().mockResolvedValue(result);
  const select = vi.fn().mockReturnValue({ single });
  const insert = vi.fn().mockReturnValue({ select });
  supabase.from.mockReturnValue({ insert, select, single });
  return { insert, select, single };
};

describe("CreateTaskModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Silence component console noise
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("renders nothing when isOpen is false", () => {
    const { container } = renderModal(false);

    expect(container).toBeEmptyDOMElement();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("renders the modal with its fields when isOpen is true", () => {
    renderModal(true);

    expect(
      screen.getByRole("heading", { name: "Create New Task" })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter task title")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter task description")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create Task" })
    ).toBeInTheDocument();
  });

  it("inserts the task with form values and closes the modal on success", async () => {
    supabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "user-123" } },
    });
    const { insert } = setupInsertChain({
      data: { id: "t1" },
      error: null,
    });

    const { container } = renderModal(true);

    fireEvent.change(screen.getByPlaceholderText("Enter task title"), {
      target: { value: "Finish the report" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter task description"), {
      target: { value: "Quarterly report" },
    });
    fireEvent.change(container.querySelector('select[name="project_id"]'), {
      target: { value: "project-a" },
    });
    fireEvent.change(container.querySelector('select[name="status"]'), {
      target: { value: "in_progress" },
    });
    fireEvent.change(container.querySelector('select[name="priority"]'), {
      target: { value: "high" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create Task" }));

    await waitFor(() => expect(insert).toHaveBeenCalledTimes(1));
    expect(insert).toHaveBeenCalledWith({
      title: "Finish the report",
      description: "Quarterly report",
      project_id: "project-a",
      status: "in_progress",
      priority: "high",
      created_by: "user-123",
    });
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it("does not insert anything when the user is not authenticated", async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    setupInsertChain();

    renderModal(true);

    fireEvent.change(screen.getByPlaceholderText("Enter task title"), {
      target: { value: "Ghost task" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create Task" }));

    await waitFor(() => expect(supabase.auth.getUser).toHaveBeenCalled());
    expect(supabase.from).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("closes the modal via the × button without inserting", () => {
    setupInsertChain();

    renderModal(true);
    fireEvent.click(screen.getByRole("button", { name: "×" }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(supabase.from).not.toHaveBeenCalled();
  });
});
