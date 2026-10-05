import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProjectCard from "../components/ProjectCard";

const baseProject = {
  id: "p1",
  name: "Website Redesign",
  description: "A complete overhaul of the marketing site",
  status: "active",
};

describe("ProjectCard", () => {
  it("renders the project name and description", () => {
    render(<ProjectCard project={baseProject} />);

    expect(
      screen.getByRole("heading", { name: "Website Redesign" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("A complete overhaul of the marketing site")
    ).toBeInTheDocument();
  });

  it("renders the status badge", () => {
    render(<ProjectCard project={baseProject} />);

    expect(screen.getByText("active")).toBeInTheDocument();
  });

  it("renders a different status value when provided", () => {
    render(
      <ProjectCard project={{ ...baseProject, status: "completed" }} />
    );

    expect(screen.getByText("completed")).toBeInTheDocument();
  });

  it("renders the progress section starting at 0%", () => {
    render(<ProjectCard project={baseProject} />);

    expect(screen.getByText("Progress")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("renders the stats labels (Tasks / Members / Status)", () => {
    render(<ProjectCard project={baseProject} />);

    expect(screen.getByText("Tasks")).toBeInTheDocument();
    expect(screen.getByText("Members")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("renders the empty activity placeholder", () => {
    render(<ProjectCard project={baseProject} />);

    expect(
      screen.getByRole("heading", { name: "Recently Activity" })
    ).toBeInTheDocument();
    expect(screen.getByText("No recent activity")).toBeInTheDocument();
    expect(
      screen.getByText("Nothing has happened yet")
    ).toBeInTheDocument();
  });
});
