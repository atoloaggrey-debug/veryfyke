import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const MAX_FAILED_ATTEMPTS = 3;
const LOCKOUT_HOURS = 24;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter your email and password.",
        },
        { status: 400 }
      );
    }

    const now = new Date();

    // Check whether this email is currently locked
    const loginAttempt = await prisma.loginAttempt.findUnique({
      where: { email },
    });

    if (loginAttempt?.lockedUntil && loginAttempt.lockedUntil > now) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Too many failed login attempts. Your account is temporarily locked. Please try again later.",
        },
        { status: 423 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Keep invalid credentials generic
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    // Check password
    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      // If an old lockout has expired, start counting again
      const currentFailedCount =
        loginAttempt?.lockedUntil && loginAttempt.lockedUntil <= now
          ? 0
          : loginAttempt?.failedCount || 0;

      const newFailedCount = currentFailedCount + 1;

      // Lock account after 3 failed attempts
      if (newFailedCount >= MAX_FAILED_ATTEMPTS) {
        const lockedUntil = new Date(
          now.getTime() + LOCKOUT_HOURS * 60 * 60 * 1000
        );

        await prisma.loginAttempt.upsert({
          where: { email },
          update: {
            failedCount: newFailedCount,
            lockedUntil,
          },
          create: {
            email,
            failedCount: newFailedCount,
            lockedUntil,
          },
        });

        return NextResponse.json(
          {
            success: false,
            message:
              "Too many failed login attempts. Your account has been locked for 24 hours.",
          },
          { status: 423 }
        );
      }

      // Record failed attempt
      await prisma.loginAttempt.upsert({
        where: { email },
        update: {
          failedCount: newFailedCount,
          lockedUntil: null,
        },
        create: {
          email,
          failedCount: newFailedCount,
        },
      });

      const attemptsRemaining =
        MAX_FAILED_ATTEMPTS - newFailedCount;

      return NextResponse.json(
        {
          success: false,
          message: `Invalid email or password. ${attemptsRemaining} login attempt${
            attemptsRemaining === 1 ? "" : "s"
          } remaining.`,
        },
        { status: 401 }
      );
    }

    // Successful login:
    // Clear previous failed attempts
    await prisma.loginAttempt.deleteMany({
      where: { email },
    });

    // Create secure session
    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // Secure HTTP-only session cookie
    response.cookies.set("veryfyke_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to login. Please try again.",
      },
      { status: 500 }
    );
  }
}