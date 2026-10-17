import {
  afterAll,
  describe,
  expect,
  it,
} from "vitest";

import {
  localBibleRepository,
} from "./local-bible.repository";

describe("LocalBibleRepository", () => {
  describe("getVerse", () => {
    it("returns KJV John 3:16", () => {
      const result =
        localBibleRepository.getVerse(
          "KJV",
          "john",
          3,
          16,
        );

      expect(result).not.toBeNull();

      expect(result).toMatchObject({
        translationId: "KJV",
        bookId: "john",
        bookName: "John",
        chapter: 3,
        verse: 16,
      });

      expect(result?.text).toBeTruthy();
    });

    it("returns ASV John 3:16", () => {
      const result =
        localBibleRepository.getVerse(
          "ASV",
          "john",
          3,
          16,
        );

      expect(result).not.toBeNull();

      expect(result).toMatchObject({
        translationId: "ASV",
        bookId: "john",
        bookName: "John",
        chapter: 3,
        verse: 16,
      });

      expect(result?.text).toBeTruthy();
    });

    it("returns Hausa John 3:16", () => {
      const result =
        localBibleRepository.getVerse(
          "HA_CON",
          "john",
          3,
          16,
        );

      expect(result).not.toBeNull();

      expect(result).toMatchObject({
        translationId: "HA_CON",
        bookId: "john",
        bookName: "John",
        chapter: 3,
        verse: 16,
      });

      expect(result?.text).toBeTruthy();
    });

    it("returns KJV Genesis 1:1", () => {
      const result =
        localBibleRepository.getVerse(
          "KJV",
          "genesis",
          1,
          1,
        );

      expect(result).not.toBeNull();

      expect(result).toMatchObject({
        translationId: "KJV",
        bookId: "genesis",
        bookName: "Genesis",
        chapter: 1,
        verse: 1,
      });

      expect(result?.text).toBeTruthy();
    });

    it("returns null for an unknown translation", () => {
      const result =
        localBibleRepository.getVerse(
          "NIV",
          "john",
          3,
          16,
        );

      expect(result).toBeNull();
    });

    it("returns null for an unknown book", () => {
      const result =
        localBibleRepository.getVerse(
          "KJV",
          "not-a-book",
          3,
          16,
        );

      expect(result).toBeNull();
    });

    it("returns null for a non-existent verse", () => {
      const result =
        localBibleRepository.getVerse(
          "KJV",
          "john",
          999,
          999,
        );

      expect(result).toBeNull();
    });
  });

  describe("getPassage", () => {
    it("returns a KJV verse range", () => {
      const result =
        localBibleRepository.getPassage(
          "KJV",
          "john",
          3,
          16,
          18,
        );

      expect(result).not.toBeNull();

      expect(result).toMatchObject({
        reference:
          "John 3:16-18",
        chapter: 3,
        startVerse: 16,
        endVerse: 18,
        translation: {
          id: "KJV",
        },
        book: {
          id: "john",
          name: "John",
        },
      });

      expect(result?.verses).toHaveLength(3);

      expect(
        result?.verses[0],
      ).toMatchObject({
        verse: 16,
      });

      expect(
        result?.verses[1],
      ).toMatchObject({
        verse: 17,
      });

      expect(
        result?.verses[2],
      ).toMatchObject({
        verse: 18,
      });
    });

    it("returns an ASV verse range", () => {
      const result =
        localBibleRepository.getPassage(
          "ASV",
          "john",
          3,
          16,
          18,
        );

      expect(result).not.toBeNull();

      expect(result).toMatchObject({
        reference:
          "John 3:16-18",
        chapter: 3,
        startVerse: 16,
        endVerse: 18,
      });

      expect(result?.verses).toHaveLength(3);
    });

    it("returns a Hausa verse range", () => {
      const result =
        localBibleRepository.getPassage(
          "HA_CON",
          "john",
          3,
          16,
          18,
        );

      expect(result).not.toBeNull();

      expect(result).toMatchObject({
        reference:
          "John 3:16-18",
        chapter: 3,
        startVerse: 16,
        endVerse: 18,
      });

      expect(result?.verses).toHaveLength(3);
    });

    it("returns a single verse passage", () => {
      const result =
        localBibleRepository.getPassage(
          "KJV",
          "john",
          3,
          16,
        );

      expect(result).not.toBeNull();

      expect(result).toMatchObject({
        reference: "John 3:16",
        startVerse: 16,
        endVerse: 16,
      });

      expect(result?.verses).toHaveLength(1);
    });

    it("returns null when the passage does not exist", () => {
      const result =
        localBibleRepository.getPassage(
          "KJV",
          "john",
          999,
          1,
          5,
        );

      expect(result).toBeNull();
    });

    it("returns null for an invalid verse range", () => {
      const result =
        localBibleRepository.getPassage(
          "KJV",
          "john",
          3,
          18,
          16,
        );

      expect(result).toBeNull();
    });

    it("returns null for an invalid chapter", () => {
      const result =
        localBibleRepository.getPassage(
          "KJV",
          "john",
          0,
          1,
          5,
        );

      expect(result).toBeNull();
    });
  });

  afterAll(() => {
    localBibleRepository.close();
  });
});