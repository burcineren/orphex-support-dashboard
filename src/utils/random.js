import seedrandom from "seedrandom";

let rng = seedrandom(String(Date.now()));

export const setRandomSeed = (seed) => {
  rng = seedrandom(String(seed));
};

export const getRandomInt = (min, max) => {
  return Math.floor(rng() * (max - min + 1)) + min;
};

export const getRandomElement = (array) => {
  return array[getRandomInt(0, array.length - 1)];
};

export const getRandomTags = (tags, maxCount = 3) => {
  const count = getRandomInt(1, maxCount);
  return Array.from({ length: count }, () => getRandomElement(tags));
};
