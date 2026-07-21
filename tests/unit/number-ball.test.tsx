import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NumberBall } from "@/components/draw/number-ball";

describe("NumberBall", () => {
  it("provides an accessible main-number label", () => { render(<NumberBall number={8} />); expect(screen.getByLabelText("正選號碼 8")).toHaveTextContent("08"); });
  it("distinguishes the extra number", () => { render(<NumberBall number={12} extra />); expect(screen.getByLabelText("特別號碼 12")).toBeInTheDocument(); });
});
