import { describe, it, expect, beforeEach, vi } from 'vitest';
import { calculateNeedsAttention, generateMockData } from './useSupportData.js';

// Mock dayjs properly
vi.mock('dayjs', () => {
  const mockDayjs = (date) => {
    const actualDate = date ? new Date(date) : new Date();

    return {
      subtract(value, unit) {
        const newDate = new Date(actualDate);
        if (unit === 'day') {
          newDate.setDate(newDate.getDate() - value);
        }
        return mockDayjs(newDate);
      },

      toISOString() {
        return actualDate.toISOString();
      },

      isAfter(other) {
        const otherDate = other.toDate ? other.toDate() : new Date(other);
        return actualDate > otherDate;
      },

      diff(other, unit) {
        const otherDate =
          typeof other === 'string' ? new Date(other) : other.toDate();
        const diffMs = actualDate - otherDate;

        if (unit === 'day') {
          return Math.floor(diffMs / (1000 * 60 * 60 * 24));
        }
        return diffMs;
      },

      toDate() {
        return actualDate;
      },
    };
  };

  return {
    default: mockDayjs,
  };
});

// Mock faker
vi.mock('@faker-js/faker', () => ({
  faker: {
    seed: vi.fn(),
    lorem: {
      sentence: vi.fn(() => 'Test Request Title'),
    },
    company: {
      name: vi.fn(() => 'Test Company Inc'),
    },
  },
}));

// Mock random utils
vi.mock('../utils/random', () => ({
  setRandomSeed: vi.fn(),
  getRandomElement: vi.fn((arr) => arr[0]),
  getRandomTags: vi.fn(() => ['bug', 'urgent']),
  getRandomInt: vi.fn((min) => min),
}));

describe('useSupportData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('calculateNeedsAttention', () => {
    it('returns false for Done status', () => {
      const request = {
        status: 'Done',
        priority: 'High',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        lastCommentAt: null,
      };

      const result = calculateNeedsAttention(request);

      expect(result.needsAttention).toBe(false);
      expect(result.reasons).toEqual([]);
    });

    it('flags high priority requests', () => {
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);

      const request = {
        status: 'New',
        priority: 'High',
        createdAt: yesterday.toISOString(),
        updatedAt: yesterday.toISOString(),
        lastCommentAt: null,
      };

      const result = calculateNeedsAttention(request);

      expect(result.needsAttention).toBe(true);
      expect(result.reasons).toContain('High priority');
    });

    it('flags aging requests (>7 days)', () => {
      const now = new Date();
      const tenDaysAgo = new Date(now);
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

      const twoDaysAgo = new Date(now);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const request = {
        status: 'New',
        priority: 'Low',
        createdAt: tenDaysAgo.toISOString(),
        updatedAt: twoDaysAgo.toISOString(),
        lastCommentAt: null,
      };

      const result = calculateNeedsAttention(request);

      expect(result.needsAttention).toBe(true);
      expect(result.reasons).toContain('Aging request');
    });

    it('flags inactive requests (>3 days no activity)', () => {
      const now = new Date();
      const fiveDaysAgo = new Date(now);
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

      const request = {
        status: 'New',
        priority: 'Low',
        createdAt: fiveDaysAgo.toISOString(),
        updatedAt: fiveDaysAgo.toISOString(),
        lastCommentAt: null,
      };

      const result = calculateNeedsAttention(request);

      expect(result.needsAttention).toBe(true);
      expect(result.reasons).toContain('No recent activity');
    });

    it('uses lastCommentAt as last activity if more recent', () => {
      const now = new Date();
      const tenDaysAgo = new Date(now);
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

      const oneDayAgo = new Date(now);
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const request = {
        status: 'In Progress',
        priority: 'Medium',
        createdAt: tenDaysAgo.toISOString(),
        updatedAt: tenDaysAgo.toISOString(),
        lastCommentAt: oneDayAgo.toISOString(),
      };

      const result = calculateNeedsAttention(request);

      expect(result.needsAttention).toBe(true);
      expect(result.reasons).toContain('Aging request');
      expect(result.reasons).not.toContain('No recent activity');
    });

    it('handles multiple reasons simultaneously', () => {
      const now = new Date();
      const tenDaysAgo = new Date(now);
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

      const request = {
        status: 'New',
        priority: 'High',
        createdAt: tenDaysAgo.toISOString(),
        updatedAt: tenDaysAgo.toISOString(),
        lastCommentAt: null,
      };

      const result = calculateNeedsAttention(request);

      expect(result.needsAttention).toBe(true);
      expect(result.reasons).toHaveLength(3);
      expect(result.reasons).toContain('High priority');
      expect(result.reasons).toContain('Aging request');
      expect(result.reasons).toContain('No recent activity');
    });

    it('does not flag recent low priority requests', () => {
      const now = new Date();
      const oneDayAgo = new Date(now);
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const request = {
        status: 'In Progress',
        priority: 'Low',
        createdAt: oneDayAgo.toISOString(),
        updatedAt: oneDayAgo.toISOString(),
        lastCommentAt: null,
      };

      const result = calculateNeedsAttention(request);

      expect(result.needsAttention).toBe(false);
      expect(result.reasons).toEqual([]);
    });
  });

  describe('generateMockData', () => {
    it('generates the specified number of requests', () => {
      const data = generateMockData(10);

      expect(data).toHaveLength(10);
    });

    it('generates default 25 requests when count not provided', () => {
      const data = generateMockData();

      expect(data).toHaveLength(25);
    });

    it('generates requests with required fields', () => {
      const data = generateMockData(1);
      const request = data[0];

      expect(request).toHaveProperty('id');
      expect(request).toHaveProperty('title');
      expect(request).toHaveProperty('customer');
      expect(request).toHaveProperty('status');
      expect(request).toHaveProperty('priority');
      expect(request).toHaveProperty('createdAt');
      expect(request).toHaveProperty('updatedAt');
      expect(request).toHaveProperty('lastCommentAt');
      expect(request).toHaveProperty('tags');
      expect(request).toHaveProperty('comments');
    });

    it('generates unique IDs', () => {
      const data = generateMockData(10);
      const ids = data.map((r) => r.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(data.length);
    });

    it('generates valid ISO date strings', () => {
      const data = generateMockData(1);
      const request = data[0];

      expect(() => new Date(request.createdAt)).not.toThrow();
      expect(() => new Date(request.updatedAt)).not.toThrow();

      const created = new Date(request.createdAt);
      const updated = new Date(request.updatedAt);

      expect(created).toBeInstanceOf(Date);
      expect(updated).toBeInstanceOf(Date);
      expect(created.getTime()).not.toBeNaN();
      expect(updated.getTime()).not.toBeNaN();
    });

    it('ensures updatedAt is not before createdAt', () => {
      const data = generateMockData(10);

      data.forEach((request) => {
        const created = new Date(request.createdAt);
        const updated = new Date(request.updatedAt);

        expect(updated.getTime()).toBeGreaterThanOrEqual(created.getTime());
      });
    });

    it('generates comments array', () => {
      const data = generateMockData(1);
      const request = data[0];

      expect(Array.isArray(request.comments)).toBe(true);
    });
  });
});
