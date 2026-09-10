import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // Security check: only authenticated users can verify credentials
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be logged in to verify police credentials.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const officerNo = String(body.officerNo || "")
      .trim()
      .toUpperCase();

    if (!officerNo) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a police officer number.",
        },
        { status: 400 }
      );
    }

    const officer = await prisma.policeOfficer.findUnique({
      where: {
        officerNo,
      },
    });

    if (!officer) {
      return NextResponse.json({
        success: true,
        verified: false,
        message: "Officer credentials could not be verified.",
      });
    }

    return NextResponse.json({
      success: true,
      verified: officer.status === "ACTIVE",
      officer: {
        name: officer.name,
        rank: officer.rank,
        status: officer.status,
      },
    });
  } catch (error) {
    console.error("Police verification error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while verifying the officer.",
      },
      { status: 500 }
    );
  }
}