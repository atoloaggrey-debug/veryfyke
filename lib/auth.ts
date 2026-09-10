import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get("veryfyke_session")?.value;

  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: {
      token,
    },
    include: {
      user: true,
    },
  });

  if (!session) {
    cookieStore.set("veryfyke_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });

    return null;
  }

  // Check whether the session has expired
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({
      where: {
        id: session.id,
      },
    });

    cookieStore.set("veryfyke_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });

    return null;
  }

  return session.user;
}

// Check whether the current user has a specific role
export async function requireRole(role: string) {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  if (user.role !== role) {
    return null;
  }

  return user;
}