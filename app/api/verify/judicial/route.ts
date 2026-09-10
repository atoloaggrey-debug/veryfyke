import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // Security check: only authenticated users can verify judicial credentials
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You must be logged in to verify judicial credentials.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const credentialNo = String(body.credentialNo || "")
      .trim()
      .toUpperCase();

    if (!credentialNo) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a judicial credential number.",
        },
        { status: 400 }
      );
    }

    const personnel = await prisma.judicialPersonnel.findUnique({
      where: {
        credentialNo,
      },
    });

    if (!personnel) {
      return NextResponse.json({
        success: true,
        verified: false,
        message:
          "Judicial credentials could not be verified.",
      });
    }

    return NextResponse.json({
      success: true,
      verified: personnel.status === "ACTIVE",
      personnel: {
        credentialNo: personnel.credentialNo,
        name: personnel.name,
        position: personnel.position,
        court: personnel.court,
        status: personnel.status,
      },
    });
  } catch (error) {
    console.error("Judicial verification error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to connect to the verification service.",
      },
      { status: 500 }
    );
  }
}