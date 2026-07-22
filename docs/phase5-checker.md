# Phase 5 verified result checker

The checker accepts exactly six unique numbers from 1–49 and compares them with a verified draw. It reports main matches, the extra-number match, and the corresponding division.

Prize classification follows: 6 main = first; 5 + extra = second; 5 = third; 4 + extra = fourth; 4 = fifth; 3 + extra = sixth; 3 = seventh.

`POST /api/checker` accepts `drawNumber` and `numbers`. Draft, pending-review, rejected, and unknown draws are never used. Dividend values are displayed only when available in the stored source data and remain subject to official results.
