# Phase 4 seeded generator

The generator is a reproducible exploration tool, not a prediction service. Every valid six-number combination retains the same theoretical jackpot probability.

## Methods

- `uniform_random`: equal selection weight for each available number.
- `conditional_random`: equal random selection followed by transparent constraints.
- `historical_weighted`: weighted sampling from verified historical frequency with additive smoothing; the score is not a probability.

## Reproducibility and limits

The same method, seed, constraints, previous draw, and verified dataset reproduce the same output. Requests are limited to 50 unique combinations and 50,000 bounded attempts.

Supported constraints include required/excluded numbers, exact odd and low counts, sum range, consecutive-number policy, maximum same-ending count, and previous-draw exclusion.

Authenticated users have generation runs and saved combinations protected by owner-only RLS. Anonymous users may generate but cannot save.
