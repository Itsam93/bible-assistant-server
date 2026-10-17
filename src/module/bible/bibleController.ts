import type {
  Request,
  Response,
} from "express";

import {
  bibleService,
} from "./bible.service";

export function searchBibleReference(
  req: Request,
  res: Response,
): void {
  const reference =
    typeof req.query.reference === "string"
      ? req.query.reference.trim()
      : "";

  const translation =
    typeof req.query.translation === "string"
      ? req.query.translation.trim()
      : "KJV";

  if (!reference) {
    res.status(400).json({
      success: false,
      message:
        "Bible reference is required.",
    });

    return;
  }

  const result =
    bibleService.searchReference(
      reference,
      translation,
    );

  if (!result) {
    res.status(404).json({
      success: false,
      message:
        "Bible reference could not be resolved.",
    });

    return;
  }

  res.status(200).json({
    success: true,
    data: result,
  });
}