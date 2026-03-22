import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { UserRole } from "../../../../../generated/prisma";
import { db } from "~/server/db";

const registerSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  role: z.enum(["BUSINESS", "CUSTOMER"]).optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { username, email, password, role } = parsed.data;
  const passwordHash = await hash(password, 12);

  try {
    const user = await db.user.create({
      data: {
        username,
        email: email.toLowerCase().trim(),
        passwordHash,
        name: username,
        role: role === "BUSINESS" ? UserRole.BUSINESS : UserRole.CUSTOMER,
      },
      select: { id: true, username: true, email: true },
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch (e: unknown) {
    const isUniqueViolation =
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      (e as { code: string }).code === "P2002";
    if (isUniqueViolation) {
      return NextResponse.json(
        { error: "Username or email already in use" },
        { status: 409 },
      );
    }
    console.error("Registration error:", e);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
