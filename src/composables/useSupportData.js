import { ref, computed } from 'vue';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import {
  setRandomSeed,
  getRandomElement,
  getRandomTags,
  getRandomInt,
} from '@/utils/random';
import {
  STATUSES,
  PRIORITIES,
  MAX_DAYS_AGO,
  DAYS_SINCE_ACTIVITY_THRESHOLD,
  DAYS_AGING_THRESHOLD,
} from '@/constants/support.js';

// Faker seed for reproducible data
faker.seed(123);

export const generateMockData = (count = 25, seed = Date.now()) => {
  setRandomSeed(seed);

  return Array.from({ length: count }, (_, i) => {
    const daysAgo = getRandomInt(0, MAX_DAYS_AGO);
    const createdAt = dayjs().subtract(daysAgo, 'day').toISOString();

    const updatedDaysAgo = getRandomInt(0, daysAgo);
    const updatedAt = dayjs().subtract(updatedDaysAgo, 'day').toISOString();

    const hasComment = getRandomInt(0, 10) > 3;
    const lastCommentAt = hasComment
      ? dayjs().subtract(getRandomInt(0, updatedDaysAgo), 'day').toISOString()
      : null;

    return {
      id: `REQ-${String(i + 1).padStart(4, '0')}`,
      title: faker.lorem.sentence({ min: 4, max: 8 }),
      customer: faker.company.name(),
      status: getRandomElement(STATUSES.map((s) => s.label)),
      priority: getRandomElement(PRIORITIES.map((p) => p.label)),
      createdAt,
      updatedAt,
      lastCommentAt,
      tags: getRandomTags(['bug', 'feature', 'urgent', 'api', 'billing']),
      comments: [],
    };
  });
};

export const calculateNeedsAttention = (request) => {
  if (request.status === 'Done') {
    return { needsAttention: false, reasons: [] };
  }

  const now = dayjs();
  const created = dayjs(request.createdAt);
  const updated = dayjs(request.updatedAt);
  const lastComment = request.lastCommentAt
    ? dayjs(request.lastCommentAt)
    : null;

  const lastActivity =
    lastComment && lastComment.isAfter(updated) ? lastComment : updated;

  const daysSinceCreation = now.diff(created, 'day');
  const daysSinceActivity = now.diff(lastActivity, 'day');

  const reasons = [];
  let needsAttention = false;

  if (request.priority === 'High') {
    reasons.push('High priority');
    needsAttention = true;
  }

  if (daysSinceCreation > DAYS_AGING_THRESHOLD) {
    reasons.push('Aging request');
    needsAttention = true;
  }

  if (daysSinceActivity > DAYS_SINCE_ACTIVITY_THRESHOLD) {
    reasons.push('No recent activity');
    needsAttention = true;
  }

  return { needsAttention, reasons };
};

export const useSupportData = (count = 25, seed = 123) => {
  const requests = ref(generateMockData(count, seed));

  const requestsWithAttention = computed(() =>
    requests.value.map((req) => ({
      ...req,
      attention: calculateNeedsAttention(req),
    }))
  );

  const needsAttentionCount = computed(
    () =>
      requestsWithAttention.value.filter((r) => r.attention.needsAttention)
        .length
  );

  const regenerateData = (newCount, newSeed) => {
    requests.value = generateMockData(newCount || count, newSeed || seed);
  };

  return {
    requests: requestsWithAttention,
    needsAttentionCount,
    regenerateData,
    STATUSES,
    PRIORITIES,
  };
};
