import {
  Router,
} from "express";

import {
  searchBibleReference,
} from "./bibleController";

const router = Router();

router.get(
  "/search",
  searchBibleReference,
);

export default router;