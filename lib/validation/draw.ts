import { z } from "zod";

const integerNumber = z.coerce.number().int().min(1).max(49);
const optionalMoney = z.preprocess(
  (value) => value === "" || value === undefined ? undefined : value,
  z.coerce.number().nonnegative().optional()
);

export const drawCsvRowSchema = z
  .object({
    draw_number: z.string().trim().min(1, "缺少期數"),
    draw_date: z.iso.date("日期必須使用 YYYY-MM-DD 格式"),
    number_1: integerNumber,
    number_2: integerNumber,
    number_3: integerNumber,
    number_4: integerNumber,
    number_5: integerNumber,
    number_6: integerNumber,
    extra_number: integerNumber,
    turnover: optionalMoney,
    first_prize_fund: optionalMoney,
    first_prize_units: optionalMoney,
    first_prize_dividend: optionalMoney,
    source_name: z.string().trim().optional(),
    source_url: z.union([z.literal(""), z.url()]).optional()
  })
  .superRefine((row, context) => {
    const main = [row.number_1, row.number_2, row.number_3, row.number_4, row.number_5, row.number_6];
    if (new Set(main).size !== 6) context.addIssue({ code: "custom", path: ["number_1"], message: "六個正選號碼不得重複" });
    if (main.includes(row.extra_number)) context.addIssue({ code: "custom", path: ["extra_number"], message: "特別號碼不得與正選號碼重複" });
  })
  .transform((row) => {
    const main = [row.number_1, row.number_2, row.number_3, row.number_4, row.number_5, row.number_6].sort((a, b) => a - b);
    return { ...row, number_1: main[0], number_2: main[1], number_3: main[2], number_4: main[3], number_5: main[4], number_6: main[5] };
  });

export type ValidatedDrawRow = z.infer<typeof drawCsvRowSchema>;

export const importDecisionSchema = z.object({
  importId: z.uuid(),
  decision: z.enum(["approve", "reject"]),
  reason: z.string().trim().max(500).optional()
}).refine((value) => value.decision !== "reject" || Boolean(value.reason), { path: ["reason"], message: "拒絕匯入時必須提供原因" });
