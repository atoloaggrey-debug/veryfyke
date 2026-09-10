import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    // Check whether the user is logged in
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

    // Read request data
    const body = await request.json();

    const name = String(body.name || "").trim();
    const phoneValue = body.phone;

    // Validate name
    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Full name is required.",
        },
        { status: 400 }
      );
    }

    if (name.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Full name must be at least 2 characters.",
        },
        { status: 400 }
      );
    }

    // Phone is optional
    const phone =
      phoneValue === null ||
      phoneValue === undefined ||
      String(phoneValue).trim() === ""
        ? null
        : String(phoneValue).trim();

    // Update only the currently logged-in user
    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name,
        phone,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update profile. Please try again.",
      },
      { status: 500 }
    );
  }
}