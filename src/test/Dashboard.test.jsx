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
import Dashboard from "../components/layout/Dashboard";

const projects = [
  { id: "p1", name: "Alpha Project", description: "First", status: "active" },
  {
    id: "p2",
    name: "Beta Project",
    description: "Second",
    status: "completed",
  },
  {
    id: "p3",
    name: "Gamma Project",
    description: "Third",
    status: "inactive",
  },
];

// Helper: build the `from().select().eq()` chain mock that Dashboard awaits
const setupProjectsFetch = (data = projects, error = null) => {
  const eq = vi.fn().mockResolvedValue({ data, error });
  const select = vi.fn().mockReturnValue({ eq });
  supabase.from.mockReturnValue({ select, eq });
  return { select, eq };
};

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Silence component console noise
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    supabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "user-123" } },
    });
  });

  it("renders the heading and fetches the user's projects", async () => {
    setupProjectsFetch();

    render(<Dashboard />);

    expect(
      await screen.findByRole("heading", { name: "Alpha Project" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Beta Project" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Gamma Project" })
    ).toBeInTheDocument();
    expect(supabase.from).toHaveBeenCalledWith("projects");
    expect(supabase.auth.getUser).toHaveBeenCalled();
  });

  it("shows '0 projects' in the header when there are no projects", async () => {
    setupProjectsFetch([]);

    render(<Dashboard />);

    expect(
      await screen.findByText("0 projects across your workspace")
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Alpha Project" })
    ).not.toBeInTheDocument();
  });

  it("does not query projects when the user is not authenticated", async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    setupProjectsFetch();

    render(<Dashboard />);

    await waitFor(() => expect(supabase.auth.getUser).toHaveBeenCalled());
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it("filters projects by search text", async () => {
    setupProjectsFetch();

    render(<Dashboard />);
    await screen.findByRole("heading", { name: "Alpha Project" });

    fireEvent.change(screen.getByPlaceholderText("Search Projects..."), {
      target: { value: "beta" },
    });

    expect(
      screen.getByRole("heading", { name: "Beta Project" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Alpha Project" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Gamma Project" })
    ).not.toBeInTheDocument();
  });

  it("filters projects by status via the Filter dropdown", async () => {
    setupProjectsFetch();

    render(<Dashboard />);
    await screen.findByRole("heading", { name: "Alpha Project" });

    // Open the dropdown
    fireEvent.click(screen.getByRole("button", { name: /Filter/ }));
    expect(screen.getByRole("radio", { name: "Active" })).toBeInTheDocument();

    // Pick "Completed"
    fireEvent.click(screen.getByRole("radio", { name: "Completed" }));

    expect(
      screen.getByRole("heading", { name: "Beta Project" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Alpha Project" })
    ).not.toBeInTheDocument();
    // Dropdown closes after selecting
    expect(
      screen.queryByRole("radio", { name: "Active" })
    ).not.toBeInTheDocument();
  });

  it("switches the view mode from grid to list", async () => {
    setupProjectsFetch();

    const { container } = render(<Dashboard />);
    await screen.findByRole("heading", { name: "Alpha Project" });

    const projectsGrid = container.querySelector(".grid.grid-cols-1");
    expect(projectsGrid).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /List/ }));

    const projectsList = container.querySelector(".flex.flex-col.gap-4");
    expect(projectsList).not.toBeNull();
    expect(container.querySelector(".grid.grid-cols-1")).toBeNull();
  });

  it("opens the Create Project modal from the '+ New Project' button", async () => {
    setupProjectsFetch([]);

    render(<Dashboard />);
    await screen.findByText("0 projects across your workspace");

    fireEvent.click(screen.getByRole("button", { name: "+ New Project" }));

    expect(
      await screen.findByRole("heading", { name: "Create New Project" })
    ).toBeInTheDocument();
  });

  it("renders the stats cards from the Tasks section", async () => {
    setupProjectsFetch([]);

    render(<Dashboard />);

    expect(await screen.findByText("total projects")).toBeInTheDocument();
    expect(screen.getByText("total tasks")).toBeInTheDocument();
    expect(screen.getByText("completed")).toBeInTheDocument();
    expect(screen.getByText("overdue")).toBeInTheDocument();
  });
});
