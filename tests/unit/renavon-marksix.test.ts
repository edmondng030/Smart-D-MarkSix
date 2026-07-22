import { describe, expect, it } from "vitest";
import { mapRenavonRows } from "@/lib/renavon/marksix";

describe("mapRenavonRows", () => {
  it("maps and sorts a valid Renavon draw", () => {
    const result = mapRenavonRows([{ draw_id: "202677N", draw_date: "2026-07-16+08:00", ball_1: 44, ball_2: 21, ball_3: 18, ball_4: 32, ball_5: 26, ball_6: 30, extra_ball: 27, total_sales: 38183508, jackpot_amount: 619815, first_prize_dividend: 8000000 }]);
    expect(result.issues).toEqual([]);
    expect(result.validRows[0]).toMatchObject({ draw_number: "202677N", draw_date: "2026-07-16", number_1: 18, number_6: 44, extra_number: 27, turnover: 38183508 });
  });

  it("rejects duplicate and invalid numbers", () => {
    const result = mapRenavonRows([{ draw_id: "bad", draw_date: "2026-07-16", ball_1: 1, ball_2: 1, ball_3: 3, ball_4: 4, ball_5: 5, ball_6: 50, extra_ball: 1 }]);
    expect(result.validRows).toEqual([]);
    expect(result.issues).toHaveLength(1);
  });
});
