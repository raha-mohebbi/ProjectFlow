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
import CreateProjectModal from "../components/CreateProjectModal";

const onClose = vi.fn();

const renderModal = (isOpen = true) =>
  render(<CreateProjectModal isOpen={isOpen} onClose={onClose} />);

// Helper: build the `from().insert().select().single()` chain mock
const setupInsertChain = (result = { data: { id: "p1" }, error: null }) => {
  const single = vi.fn().mockResolvedValue(result);
  const select = vi.fn().mockReturnValue({ single });
  const insert = vi.fn().mockReturnValue({ select });
  supabase.from.mockReturnValue({ insert, select, single });
  return { insert, select, single };
};

describe("CreateProjectModal", () => {
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

  it("renders the modal with its form when isOpen is true", () => {
    renderModal(true);

    expect(
      screen.getByRole("heading", { name: "Create New Project" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Project Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Status")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create Project" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("shows 'Project name is required' when submitting an empty form", async () => {
    renderModal(true);

    fireEvent.click(screen.getByRole("button", { name: "Create Project" }));

    expect(await screen.findByText("Project name is required")).toBeInTheDocument();
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it("inserts the project with form values and closes the modal on success", async () => {
    supabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "user-123" } },
    });
    const { insert } = setupInsertChain({
      data: { id: "p1" },
      error: null,
    });

    renderModal(true);

    fireEvent.change(screen.getByLabelText("Project Name"), {
      target: { value: "My Project" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Project description" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create Project" }));

    await waitFor(() => expect(insert).toHaveBeenCalledTimes(1));
    expect(insert).toHaveBeenCalledWith({
      name: "My Project",
      description: "Project description",
      status: "active",
      color: "red",
      created_by: "user-123",
    });
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it("does not insert anything when the user is not authenticated", async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    setupInsertChain();

    renderModal(true);

    fireEvent.change(screen.getByLabelText("Project Name"), {
      target: { value: "Ghost Project" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create Project" }));

    await waitFor(() => expect(supabase.auth.getUser).toHaveBeenCalled());
    expect(supabase.from).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("closes the modal via the Cancel button without inserting", () => {
    setupInsertChain();

    renderModal(true);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it("closes the modal via the ✕ button without inserting", () => {
    setupInsertChain();

    renderModal(true);
    fireEvent.click(screen.getByRole("button", { name: "✕" }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(supabase.from).not.toHaveBeenCalled();
  });
});
