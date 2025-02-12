import { render, screen } from "@testing-library/react";
import { Timeline } from "../src/Timeline";
import React from "react";
import { describe, expect, test } from "vitest";
import "@testing-library/jest-dom";
describe("Timeline Component", () => {
  test("renders timeline events correctly", () => {
    const events = [
      {
        type: "test",
        action: "created",
        title: "Test Event",
        description: "This is a test event",
        date: "2024-02-12T10:00:00Z",
        icon: "",
        payload: {
          check_suite: {
            id: "123",
            status: "completed",
            conclusion: "success",
          }
        }
      },
    ];

    render(<Timeline events={events} />);

    expect(screen.getByText("test")).toBeInTheDocument();
    expect(screen.getByText("created")).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();
  });
});
