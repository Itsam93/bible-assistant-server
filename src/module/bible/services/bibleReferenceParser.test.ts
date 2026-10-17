import {
  describe,
  expect,
  it,
} from "vitest";

import {
  parseSpokenBibleReference,
} from "./bibleReferenceParser";

describe(
  "parseSpokenBibleReference",
  () => {
    it(
      "parses John 3:16",
      () => {
        expect(
          parseSpokenBibleReference(
            "John 3:16",
          ),
        ).toBe(
          "John 3:16",
        );
      },
    );

    it(
      "parses spoken chapter and verse",
      () => {
        expect(
          parseSpokenBibleReference(
            "John chapter three verse sixteen",
          ),
        ).toBe(
          "John 3:16",
        );
      },
    );

    it(
      "parses a verse range",
      () => {
        expect(
          parseSpokenBibleReference(
            "John chapter three verses sixteen through eighteen",
          ),
        ).toBe(
          "John 3:16-18",
        );
      },
    );

    it(
      "parses Psalm chapter references",
      () => {
        expect(
          parseSpokenBibleReference(
            "Psalm twenty three",
          ),
        ).toBe(
          "Psalms 23",
        );
      },
    );

    it(
      "parses numbered books",
      () => {
        expect(
          parseSpokenBibleReference(
            "First Corinthians chapter thirteen verse four",
          ),
        ).toBe(
          "1 Corinthians 13:4",
        );
      },
    );

    it(
      "parses second Timothy",
      () => {
        expect(
          parseSpokenBibleReference(
            "Second Timothy chapter three verse sixteen",
          ),
        ).toBe(
          "2 Timothy 3:16",
        );
      },
    );

    it(
      "parses Revelation",
      () => {
        expect(
          parseSpokenBibleReference(
            "Revelation twenty one verse four",
          ),
        ).toBe(
          "Revelation 21:4",
        );
      },
    );

    it(
      "removes presentation commands",
      () => {
        expect(
          parseSpokenBibleReference(
            "show John chapter three verse sixteen",
          ),
        ).toBe(
          "John 3:16",
        );
      },
    );
  },
);