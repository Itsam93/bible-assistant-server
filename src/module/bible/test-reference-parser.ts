import {
  parseBibleReference,
} from "./bible.reference-parser";

import {
  parseNaturalBibleReference,
} from "./bible.natural-language-parser";

const tests = [
  "John 3:16",
  "Jn 3:16",
  "Romans 8:28",
  "Rom 8:28",
  "1 Corinthians 13:4",
  "1 Cor 13:4",
  "Psalm 23:1",
];

for (const input of tests) {
  console.log(
    input,
    "=>",
    parseBibleReference(input),
  );
}

const spokenTests = [
  "John chapter three verse sixteen",
  "John chapter 3 verse 16",
  "Romans chapter eight verse twenty eight",
];

for (const input of spokenTests) {
  console.log(
    input,
    "=>",
    parseNaturalBibleReference(input),
  );
}