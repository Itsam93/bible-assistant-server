import { bibleService } from "./bible.service";

const references = [
  "John 3:16",
  "Jn 3:16",
  "Romans 8:28",
  "1 Corinthians 13:4",
  "John chapter three verse sixteen",
  "Romans chapter eight verse twenty eight",
];

for (const reference of references) {
  console.log("\n========================================");
  console.log(`Testing: ${reference}`);
  console.log("========================================");

  const result =
    bibleService.searchReference(
      reference,
      "KJV",
    );

  if (!result) {
    console.log("NOT FOUND");
    continue;
  }

  console.log(
    `Reference: ${result.reference}`,
  );

  console.log(
    `Translation: ${result.translation.name}`,
  );

  console.log(
    `Book: ${result.book.name}`,
  );

  console.log(
    `Chapter: ${result.chapter}`,
  );

  for (const verse of result.verses) {
    console.log(
      `${verse.verse}. ${verse.text}`,
    );
  }
}

bibleService.close();