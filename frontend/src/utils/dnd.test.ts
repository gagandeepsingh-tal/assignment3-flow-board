import { describe, it, expect } from "vitest";
import { computeDropIndex } from "./dnd";

describe("computeDropIndex", () => {
  const items = [
    { top: 0, height: 20 },
    { top: 20, height: 20 },
    { top: 40, height: 20 },
  ];

  it("inserts at start when above first mid", () => {
    expect(computeDropIndex(items, 5)).toBe(0);
  });

  it("inserts between items near middle thresholds", () => {
    expect(computeDropIndex(items, 15)).toBe(1); // before second item
    expect(computeDropIndex(items, 35)).toBe(2); // before third item
  });

  it("inserts at end when below last mid", () => {
    expect(computeDropIndex(items, 60)).toBe(3);
  });

  it("handles empty list", () => {
    expect(computeDropIndex([], 10)).toBe(0);
  });
});


