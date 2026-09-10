import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // Check authentication
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be logged in to submit a report.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const subject = String(body.subject || "").trim();
    const description = String(body.description || "").trim();
    const department = "AOB";

    if (!subject) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a subject.",
        },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        {
          success: false,
          message: "Please describe the issue.",
        },
        { status: 400 }
      );
    }

    // Create report and associate it with the authenticated user
    const report = await prisma.report.create({
      data: {
        subject,
        description,
        department,
        status: "PENDING",
        result: "NOT_VERIFIED",
        userId: currentUser.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Your report has been submitted successfully.",
      report: {
        id: report.id,
        subject: report.subject,
        department: report.department,
        status: report.status,
        createdAt: report.createdAt,
      },
    });
  } catch (error) {
    console.error("AOB report error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit your report.",
      },
      { status: 500 }
    );
  }
}