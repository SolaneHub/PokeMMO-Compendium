import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import SearchBar from "./SearchBar";

describe("SearchBar component", () => {
  it("renders an input with correct placeholder", () => {
    render(
      <SearchBar
        value=""
        onChange={() => {
          /* noop */
        }}
        placeholder="Find Pokemon..."
      />
    );
    expect(screen.getByPlaceholderText("Find Pokemon...")).toBeInTheDocument();
  });

  it("calls onChange when typing", () => {
    const handleChange = vi.fn();
    render(<SearchBar value="" onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Charizard" } });

    expect(handleChange).toHaveBeenCalledWith("Charizard");
  });

  it("displays the current value", () => {
    render(
      <SearchBar
        value="Bulbasaur"
        onChange={() => {
          /* noop */
        }}
      />
    );
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("Bulbasaur");
  });
});
