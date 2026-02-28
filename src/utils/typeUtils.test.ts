import { describe, expect, it } from "vitest";

import { calculateDefenses } from "./typeUtils";

describe("typeUtils", () => {
  describe("calculateDefenses", () => {
    it("calculates neutral defenses for Normal type", () => {
      const defenses = calculateDefenses(["Normal"]);
      expect(defenses["Fighting"]).toBe(2);
      expect(defenses["Ghost"]).toBe(0);
      expect(defenses["Water"]).toBe(1);
    });

    it("calculates dual type defenses correctly (Charizard: Fire/Flying)", () => {
      const defenses = calculateDefenses(["Fire", "Flying"]);
      // 2x Rock from Fire, 2x Rock from Flying = 4x
      expect(defenses["Rock"]).toBe(4);
      // 0.5x Grass from Fire, 0.5x Grass from Flying = 0.25x
      expect(defenses["Grass"]).toBe(0.25);
      // 0.5x Bug from Fire, 0.5x Bug from Flying = 0.25x
      expect(defenses["Bug"]).toBe(0.25);
      // 2x Water from Fire, 1x from Flying = 2x
      expect(defenses["Water"]).toBe(2);
    });

    it("handles immunity in dual types (Gengar: Ghost/Poison)", () => {
      const defenses = calculateDefenses(["Ghost", "Poison"]);
      // Ghost is immune to Normal
      expect(defenses["Normal"]).toBe(0);
      // Ghost is immune to Fighting, Poison resists Fighting (0.5), total 0
      expect(defenses["Fighting"]).toBe(0);
      // Ghost is weak to Ghost (2), Poison is neutral (1), total 2
      expect(defenses["Ghost"]).toBe(2);
    });
  });
});
