import { describe, it, expect, beforeEach, vi } from "vitest";
import { calculateNeedsAttention, generateMockData } from "./dataUtils";

describe("calculateNeedsAttention", () => {
  let now;

  beforeEach(() => {
    // Mock current date
    now = new Date("2024-01-15T12:00:00.000Z");
    vi.setSystemTime(now);
  });

  it("should return false for Done requests", () => {
    const request = {
      id: "REQ-0001",
      status: "Done",
      priority: "High",
      createdAt: new Date(
        now.getTime() - 10 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        now.getTime() - 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
      lastCommentAt: null,
    };

    const result = calculateNeedsAttention(request);

    expect(result.needsAttention).toBe(false);
    expect(result.reasons).toEqual([]);
  });

  it("should flag High priority requests", () => {
    const request = {
      id: "REQ-0002",
      status: "New",
      priority: "High",
      createdAt: new Date(
        now.getTime() - 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        now.getTime() - 1 * 24 * 60 * 60 * 1000
      ).toISOString(),
      lastCommentAt: null,
    };

    const result = calculateNeedsAttention(request);

    expect(result.needsAttention).toBe(true);
    expect(result.reasons).toContain("High priority");
  });

  it("should flag aging requests (>7 days old)", () => {
    const request = {
      id: "REQ-0003",
      status: "In Progress",
      priority: "Medium",
      createdAt: new Date(
        now.getTime() - 10 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        now.getTime() - 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
      lastCommentAt: null,
    };

    const result = calculateNeedsAttention(request);

    expect(result.needsAttention).toBe(true);
    expect(result.reasons).toContain("Aging request");
  });

  it("should flag requests with no activity in 3+ days", () => {
    const request = {
      id: "REQ-0004",
      status: "Waiting on Customer",
      priority: "Low",
      createdAt: new Date(
        now.getTime() - 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        now.getTime() - 4 * 24 * 60 * 60 * 1000
      ).toISOString(),
      lastCommentAt: null,
    };

    const result = calculateNeedsAttention(request);

    expect(result.needsAttention).toBe(true);
    expect(result.reasons).toContain("No recent activity");
  });

  it("should use lastCommentAt as last activity if more recent", () => {
    const request = {
      id: "REQ-0005",
      status: "In Progress",
      priority: "Low",
      createdAt: new Date(
        now.getTime() - 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        now.getTime() - 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
      lastCommentAt: new Date(
        now.getTime() - 1 * 24 * 60 * 60 * 1000
      ).toISOString(),
    };

    const result = calculateNeedsAttention(request);

    expect(result.needsAttention).toBe(false);
    expect(result.reasons).not.toContain("No recent activity");
  });

  it("should handle multiple reasons simultaneously", () => {
    const request = {
      id: "REQ-0006",
      status: "New",
      priority: "High",
      createdAt: new Date(
        now.getTime() - 10 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        now.getTime() - 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
      lastCommentAt: null,
    };

    const result = calculateNeedsAttention(request);

    expect(result.needsAttention).toBe(true);
    expect(result.reasons).toHaveLength(3);
    expect(result.reasons).toContain("High priority");
    expect(result.reasons).toContain("Aging request");
    expect(result.reasons).toContain("No recent activity");
  });

  it("should not flag recent low priority requests", () => {
    const request = {
      id: "REQ-0007",
      status: "In Progress",
      priority: "Low",
      createdAt: new Date(
        now.getTime() - 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        now.getTime() - 1 * 24 * 60 * 60 * 1000
      ).toISOString(),
      lastCommentAt: null,
    };

    const result = calculateNeedsAttention(request);

    expect(result.needsAttention).toBe(false);
    expect(result.reasons).toEqual([]);
  });
});

describe("generateMockData", () => {
  it("should generate 25 requests", () => {
    const data = generateMockData();
    expect(data).toHaveLength(25);
  });

  it("should generate requests with required fields", () => {
    const data = generateMockData();
    const request = data[0];

    expect(request).toHaveProperty("id");
    expect(request).toHaveProperty("title");
    expect(request).toHaveProperty("customer");
    expect(request).toHaveProperty("status");
    expect(request).toHaveProperty("priority");
    expect(request).toHaveProperty("createdAt");
    expect(request).toHaveProperty("updatedAt");
    expect(request).toHaveProperty("tags");
    expect(request).toHaveProperty("comments");
  });

  it("should generate unique IDs", () => {
    const data = generateMockData();
    const ids = data.map((r) => r.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(data.length);
  });

  it("should generate valid status values", () => {
    const data = generateMockData();
    const validStatuses = ["New", "In Progress", "Waiting on Customer", "Done"];

    data.forEach((request) => {
      expect(validStatuses).toContain(request.status);
    });
  });

  it("should generate valid priority values", () => {
    const data = generateMockData();
    const validPriorities = ["Low", "Medium", "High"];

    data.forEach((request) => {
      expect(validPriorities).toContain(request.priority);
    });
  });
});
