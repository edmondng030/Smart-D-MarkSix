import { NextResponse } from "next/server";

export function apiSuccess<T>(data: T, status = 200) { return NextResponse.json({ success: true as const, data }, { status }); }
export function apiError(code: string, message: string, status: number, details?: unknown) { return NextResponse.json({ success: false as const, error: { code, message, ...(details === undefined ? {} : { details }) } }, { status }); }
