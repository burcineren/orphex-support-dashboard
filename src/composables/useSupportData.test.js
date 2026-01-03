import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { ref, nextTick } from "vue";
import { renderHook, waitFor } from "@vue/test-utils/V2";
import {
  useSupportData,
  generateMockData,
  calculateNeedsAttention,
} from "@/composables/useSupportData.js";
import dayjs from "dayjs";

// Mock external dependencies
vi.mock("@faker-js/faker", () => ({
  faker: {
    seed: vi.fn(),
    lorem: {
      sentence: vi.fn(() => "Mock title"),
    },
    company: {
      name: vi.fn(() => "Mock Company"),
    },
  },
}));

vi.mock("dayjs", () => ({
  default: vi.fn(() => ({
    subtract: vi.fn().mockReturnThis(),
    toISOString: vi.fn().mockReturnValue("2026-01-01T00:00:00Z"),
    isAfter: vi.fn().mockReturnValue(false),
    diff: vi.fn().mockReturnValue(2),
  })),
}));

describe("useSupportData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("generateMockData", () => {
    it("generates correct number of requests", () => {
      const result = generateMockData(5, 123);
      expect(result).toHaveLength(5);
    });

    it("generates requests with correct structure", () => {
      const result = generateMockData(1, 123)[0];
      expect(result).toEqual(
        expect.objectContaining({
          id: expect.stringMatching(/^REQ-\d{4}$/),
          title: expect.any(String),
          customer: expect.any(String),
          status: expect.any(String),
          priority: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          lastCommentAt: expect.anything(), // null or string
          tags: expect.arrayContaining([expect.any(String)]),
          comments: expect.arrayContaining([]),
        })
      );
    });

    it("generates different data with different seeds", () => {
      const data1 = generateMockData(3, 123);
      const data2 = generateMockData(3, 456);
      expect(data1).not.toEqual(data2);
    });
  });

  describe("calculateNeedsAttention", () => {
    it("returns false for Done status", () => {
      const request = {
        status: "Done",
        priority: "High",
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z",
      };
      const result = calculateNeedsAttention(request);
      expect(result.needsAttention).toBe(false);
      expect(result.reasons).toEqual([]);
    });

    it("flags high priority requests", () => {
      const request = {
        status: "New",
        priority: "High",
        createdAt: dayjs().subtract(1, "day").toISOString(),
        updatedAt: dayjs().subtract(1, "day").toISOString(),
      };
      const result = calculateNeedsAttention(request);
      expect(result.needsAttention).toBe(true);
      expect(result.reasons).toContain("High priority");
    });

    it("flags aging requests (>7 days)", () => {
      const request = {
        status: "New",
        priority: "Low",
        createdAt: dayjs().subtract(10, "day").toISOString(),
        updatedAt: dayjs().subtract(1, "day").toISOString(),
      };
      dayjs().diff.mockReturnValueOnce(10); // daysSinceCreation
      const result = calculateNeedsAttention(request);
      expect(result.needsAttention).toBe(true);
      expect(result.reasons).toContain("Aging request");
    });

    it("flags inactive requests (>3 days no activity)", () => {
      const request = {
        status: "New",
        priority: "Low",
        createdAt: dayjs().subtract(1, "day").toISOString(),
        updatedAt: dayjs().subtract(5, "day").toISOString(),
        lastCommentAt: null,
      };
      dayjs().diff.mockReturnValueOnce(5); // daysSinceActivity
      const result = calculateNeedsAttention(request);
      expect(result.needsAttention).toBe(true);
      expect(result.reasons).toContain("No recent activity");
    });
  });

  describe("useSupportData composable", () => {
    it("returns expected reactive properties", async () => {
      const { result } = renderHook(() => useSupportData(3, 123));

      await waitFor(() => {
        expect(result.value.requests).toHaveLength(3);
        expect(result.value.needsAttentionCount).toBeGreaterThanOrEqual(0);
        expect(result.value.STATUSES).toBeDefined();
        expect(result.value.PRIORITIES).toBeDefined();
      });
    });

    it("regenerates data when regenerateData called", async () => {
      const { result } = renderHook(() => useSupportData(3, 123));

      const initialRequests = result.value.requests;

      await nextTick();

      result.value.regenerateData(5, 456);

      await nextTick();

      expect(result.value.requests).toHaveLength(5);
      expect(result.value.requests).not.toEqual(initialRequests);
    });

    it("calculates needsAttentionCount correctly", async () => {
      const { result } = renderHook(() => useSupportData(10, 123));

      await waitFor(() => {
        const total = result.value.requests.length;
        const attentionCount = result.value.needsAttentionCount;
        expect(attentionCount).toBeLessThanOrEqual(total);
        expect(attentionCount).toBeGreaterThanOrEqual(0);
      });
    });

    it("includes attention flags in requests", async () => {
      const { result } = renderHook(() => useSupportData(1, 123));

      await waitFor(() => {
        const request = result.value.requests[0];
        expect(request.attention).toEqual(
          expect.objectContaining({
            needsAttention: expect.any(Boolean),
            reasons: expect.any(Array),
          })
        );
      });
    });
  });

  describe("edge cases", () => {
    it("handles zero requests", async () => {
      const { result } = renderHook(() => useSupportData(0, 123));

      await nextTick();

      expect(result.value.requests).toHaveLength(0);
      expect(result.value.needsAttentionCount).toBe(0);
    });

    it("handles custom seed values", async () => {
      const { result: result1 } = renderHook(() => useSupportData(2, 111));
      const { result: result2 } = renderHook(() => useSupportData(2, 222));

      await nextTick();

      expect(result1.value.requests).not.toEqual(result2.value.requests);
    });
  });
});
