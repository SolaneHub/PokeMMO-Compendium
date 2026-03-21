import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Pokemon } from "@/types/pokemon";

import CaptureSection from "./CaptureSection";

// Mocking atoms and molecules
vi.mock("@/components/atoms/Slider", () => ({
  default: ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
  }) => (
    <div data-testid="slider">
      <label>{label}</label>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  ),
}));

vi.mock("@/components/molecules/BallSelector", () => ({
  default: ({ onSelect }: { onSelect: (v: string) => void }) => (
    <div data-testid="ball-selector">
      <button onClick={() => onSelect("Fast Ball")}>Select Fast Ball</button>
      <button onClick={() => onSelect("Dream Ball")}>Select Dream Ball</button>
      <button onClick={() => onSelect("Repeat Ball")}>
        Select Repeat Ball
      </button>
      <button onClick={() => onSelect("Nest Ball")}>Select Nest Ball</button>
      <button onClick={() => onSelect("Dusk Ball")}>Select Dusk Ball</button>
      <button onClick={() => onSelect("Quick Ball")}>Select Quick Ball</button>
      <button onClick={() => onSelect("Timer Ball")}>Select Timer Ball</button>
    </div>
  ),
}));

describe("CaptureSection", () => {
  const defaultProps = {
    ballType: "Poke Ball",
    setBallType: vi.fn(),
    selectedPokemon: {
      name: "Pikachu",
      baseStats: { spe: 90 },
      types: ["Electric"],
    } as unknown as Pokemon,
    dreamBallTurns: 0,
    setDreamBallTurns: vi.fn(),
    targetLevel: 50,
    setTargetLevel: vi.fn(),
    turnsPassed: 1,
    setTurnsPassed: vi.fn(),
    repeatBallCaptures: 0,
    setRepeatBallCaptures: vi.fn(),
    isNightOrCave: false,
    setIsNightOrCave: vi.fn(),
    baseCatchRate: 190,
    catchProbability: 0.5,
    getProbabilityColor: vi.fn(() => "text-green-400"),
    getProbabilityMessage: vi.fn(() => "Easy catch"),
  };

  it("renders correctly with default props", () => {
    render(<CaptureSection {...defaultProps} />);
    expect(screen.getByText("Easy catch")).toBeInTheDocument();
  });

  it("shows Fast Ball options when selected", () => {
    render(<CaptureSection {...defaultProps} ballType="Fast Ball" />);
    expect(screen.getByText("Base Speed")).toBeInTheDocument();
    expect(screen.getByText("90")).toBeInTheDocument();
  });

  it("shows Dream Ball options when selected", () => {
    render(<CaptureSection {...defaultProps} ballType="Dream Ball" />);
    expect(screen.getByText("Turns Asleep")).toBeInTheDocument();
    const turnBtn = screen.getByText("2");
    fireEvent.click(turnBtn);
    expect(defaultProps.setDreamBallTurns).toHaveBeenCalledWith(2);
  });

  it("shows Repeat Ball options when selected", () => {
    render(<CaptureSection {...defaultProps} ballType="Repeat Ball" />);
    expect(screen.getByText("Times Caught")).toBeInTheDocument();
  });

  it("shows Dusk Ball options when selected", () => {
    render(<CaptureSection {...defaultProps} ballType="Dusk Ball" />);
    expect(screen.getByText("Night/Cave")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Night/Cave"));
    expect(defaultProps.setIsNightOrCave).toHaveBeenCalledWith(true);
  });

  it("shows Nest Ball options when selected", () => {
    render(<CaptureSection {...defaultProps} ballType="Nest Ball" />);
    expect(screen.getByText("Target Level")).toBeInTheDocument();
  });

  it("shows Timer Ball options when selected", () => {
    render(<CaptureSection {...defaultProps} ballType="Timer Ball" />);
    expect(screen.getByText("Turns Passed")).toBeInTheDocument();
  });

  it("shows Quick Ball options when selected", () => {
    render(<CaptureSection {...defaultProps} ballType="Quick Ball" />);
    expect(screen.getByText("Combat Turn")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Later Turns"));
    expect(defaultProps.setTurnsPassed).toHaveBeenCalledWith(2);
  });

  it("displays Guaranteed label when probability is >= 100", () => {
    render(<CaptureSection {...defaultProps} catchProbability={100} />);
    expect(screen.getByText("Guaranteed")).toBeInTheDocument();
  });
});
