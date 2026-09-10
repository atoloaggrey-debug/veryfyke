import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PATCH(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const currentPassword = String(body.currentPassword || "");
    const newPassword = String(body.newPassword || "");
    const confirmPassword = String(body.confirmPassword || "");

    if (!currentPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Current password is required.",
        },
        { status: 400 }
      );
    }

    if (!newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "New password is required.",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "New password must be at least 8 characters.",
        },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "New passwords do not match.",
        },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        {
          success: false,
          message:
            "New password must be different from your current password.",
        },
        { status: 400 }
      );
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      currentUser.passwordHash
    );

    if (!passwordMatches) {
      return NextResponse.json(
        {
          success: false,
          message: "Current password is incorrect.",
        },
        { status: 401 }
      );
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    // Update the password
    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    // Invalidate all existing login sessions
    await prisma.session.deleteMany({
      where: {
        userId: currentUser.id,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Password changed successfully. Please log in again with your new password.",
    });
  } catch (error) {
    console.error("Password change error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to change password. Please try again.",
      },
      { status: 500 }
    );
  }
}