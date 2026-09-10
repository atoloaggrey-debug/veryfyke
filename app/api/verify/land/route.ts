import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // Security check: only authenticated users can verify land professionals
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You must be logged in to verify land professional credentials.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const registrationNo = String(body.registrationNo || "")
      .trim()
      .toUpperCase();

    if (!registrationNo) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a registration number.",
        },
        { status: 400 }
      );
    }

    const professional = await prisma.landProfessional.findUnique({
      where: {
        registrationNo,
      },
    });

    if (!professional) {
      return NextResponse.json({
        success: true,
        verified: false,
        message: "Land professional credentials could not be verified.",
      });
    }

    return NextResponse.json({
      success: true,
      verified: professional.status === "ACTIVE",
      professional: {
        registrationNo: professional.registrationNo,
        name: professional.name,
        profession: professional.profession,
        organization: professional.organization,
        status: professional.status,
      },
    });
  } catch (error) {
    console.error("Land verification error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to the verification service.",
      },
      { status: 500 }
    );
  }
}