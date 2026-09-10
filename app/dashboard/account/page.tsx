"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
};

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile editing
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Password changing
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          router.push("/login");
          return;
        }

        setUser(data.user);
        setName(data.user.name);
        setPhone(data.user.phone || "");
      } catch (error) {
        console.error("Unable to load account:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [router]);

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function startEditing() {
    if (!user) {
      return;
    }

    setName(user.name);
    setPhone(user.phone || "");
    setMessage("");
    setError("");
    setEditing(true);
  }

  function cancelEditing() {
    if (user) {
      setName(user.name);
      setPhone(user.phone || "");
    }

    setMessage("");
    setError("");
    setEditing(false);
  }

  async function handleSave() {
    setMessage("");
    setError("");

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      setError("Full name is required.");
      return;
    }

    if (trimmedName.length < 2) {
      setError("Full name must be at least 2 characters.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          phone: trimmedPhone,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to update profile.");
        return;
      }

      setUser(data.user);
      setName(data.user.name);
      setPhone(data.user.phone || "");

      setMessage("Profile updated successfully.");
      setEditing(false);
    } catch (error) {
      console.error("Profile update error:", error);
      setError("Unable to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    setPasswordMessage("");
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError("Current password is required.");
      return;
    }

    if (!newPassword) {
      setPasswordError("New password is required.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError(
        "New password must be at least 8 characters."
      );
      return;
    }

    if (!confirmPassword) {
      setPasswordError("Please confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError(
        "New password must be different from your current password."
      );
      return;
    }

    try {
      setPasswordSaving(true);

      const response = await fetch("/api/auth/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setPasswordError(
          data.message || "Unable to change password."
        );
        return;
      }

      setPasswordMessage("Password changed successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Password change error:", error);

      setPasswordError(
        "Unable to change password. Please try again."
      );
    } finally {
      setPasswordSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            My Account
          </h1>

          <p className="mt-2 text-slate-400">
            View and manage your VeryfyKe account information.
          </p>
        </div>

        {/* Account Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

          {/* Profile Header */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">

            <div className="flex items-center gap-4">

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold">
                {user?.name
                  ? user.name.charAt(0).toUpperCase()
                  : "U"}
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  {loading ? "Loading..." : user?.name}
                </h2>

                <p className="text-sm text-slate-400">
                  VeryfyKe Account
                </p>
              </div>

            </div>

            {/* Edit Button */}
            {!loading && user && !editing && (
              <button
                onClick={startEditing}
                className="rounded-lg bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500"
              >
                ✏️ Edit Profile
              </button>
            )}

          </div>

          {/* Profile Success Message */}
          {message && (
            <div className="mb-6 rounded-xl border border-emerald-800 bg-emerald-950/40 p-4 text-emerald-400">
              {message}
            </div>
          )}

          {/* Profile Error Message */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-800 bg-red-950/40 p-4 text-red-400">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="py-10 text-center text-slate-400">
              Loading account information...
            </div>
          ) : user ? (
            <>
              {/* Edit Profile */}
              {editing ? (
                <div className="space-y-6">

                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      Full Name
                    </label>

                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full cursor-not-allowed rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-500"
                    />

                    <p className="mt-2 text-xs text-slate-500">
                      Email address cannot be changed here.
                    </p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      Phone Number
                    </label>

                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(event) =>
                        setPhone(event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                      placeholder="Enter your phone number (optional)"
                    />
                  </div>

                  {/* Profile Buttons */}
                  <div className="flex flex-wrap gap-3 pt-2">

                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saving
                        ? "Saving..."
                        : "💾 Save Changes"}
                    </button>

                    <button
                      onClick={cancelEditing}
                      disabled={saving}
                      className="rounded-lg border border-slate-700 px-6 py-3 font-semibold text-slate-300 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      ❌ Cancel
                    </button>

                  </div>

                </div>
              ) : (
                /* Account Information */
                <div className="space-y-4">

                  {/* Name */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                    <p className="text-sm text-slate-500">
                      Full Name
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      {user.name}
                    </p>
                  </div>

                  {/* Email */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                    <p className="text-sm text-slate-500">
                      Email Address
                    </p>

                    <p className="mt-1 break-all text-lg font-semibold">
                      {user.email}
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                    <p className="text-sm text-slate-500">
                      Phone Number
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      {user.phone || "Not provided"}
                    </p>
                  </div>

                  {/* Role */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                    <p className="text-sm text-slate-500">
                      Account Role
                    </p>

                    <p className="mt-1 text-lg font-semibold text-blue-400">
                      {user.role}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                    <p className="text-sm text-slate-500">
                      Account Status
                    </p>

                    <p className="mt-1 text-lg font-semibold text-emerald-400">
                      ● Active
                    </p>
                  </div>

                  {/* Member Since */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                    <p className="text-sm text-slate-500">
                      Member Since
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>

                </div>
              )}

              {/* Divider */}
              <div className="my-10 border-t border-slate-800" />

              {/* Change Password Section */}
              <div>

                <div className="mb-6">
                  <h2 className="text-2xl font-bold">
                    🔐 Change Password
                  </h2>

                  <p className="mt-2 text-slate-400">
                    Update your password to help keep your account secure.
                  </p>
                </div>

                {/* Password Success */}
                {passwordMessage && (
                  <div className="mb-6 rounded-xl border border-emerald-800 bg-emerald-950/40 p-4 text-emerald-400">
                    {passwordMessage}
                  </div>
                )}

                {/* Password Error */}
                {passwordError && (
                  <div className="mb-6 rounded-xl border border-red-800 bg-red-950/40 p-4 text-red-400">
                    {passwordError}
                  </div>
                )}

                <div className="space-y-6">

                  {/* Current Password */}
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      Current Password
                    </label>

                    <div className="relative">
                      <input
                        id="currentPassword"
                        type={
                          showCurrentPassword
                            ? "text"
                            : "password"
                        }
                        value={currentPassword}
                        onChange={(event) =>
                          setCurrentPassword(event.target.value)
                        }
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-20 text-white outline-none focus:border-blue-500"
                        placeholder="Enter your current password"
                        disabled={passwordSaving}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(
                            !showCurrentPassword
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 hover:text-white"
                      >
                        {showCurrentPassword
                          ? "Hide"
                          : "Show"}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label
                      htmlFor="newPassword"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      New Password
                    </label>

                    <div className="relative">
                      <input
                        id="newPassword"
                        type={
                          showNewPassword
                            ? "text"
                            : "password"
                        }
                        value={newPassword}
                        onChange={(event) =>
                          setNewPassword(event.target.value)
                        }
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-20 text-white outline-none focus:border-blue-500"
                        placeholder="Enter a new password"
                        disabled={passwordSaving}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowNewPassword(
                            !showNewPassword
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 hover:text-white"
                      >
                        {showNewPassword
                          ? "Hide"
                          : "Show"}
                      </button>
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                      Password must be at least 8 characters.
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      Confirm New Password
                    </label>

                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-20 text-white outline-none focus:border-blue-500"
                        placeholder="Confirm your new password"
                        disabled={passwordSaving}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 hover:text-white"
                      >
                        {showConfirmPassword
                          ? "Hide"
                          : "Show"}
                      </button>
                    </div>
                  </div>

                  {/* Change Password Button */}
                  <button
                    onClick={handleChangePassword}
                    disabled={passwordSaving}
                    className="rounded-lg bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {passwordSaving
                      ? "Changing Password..."
                      : "🔐 Change Password"}
                  </button>

                </div>
              </div>

            </>
          ) : null}

        </div>

        {/* Back Button */}
        <div className="mt-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-lg border border-slate-700 px-5 py-3 font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            ← Back to Dashboard
          </button>
        </div>

      </div>
    </main>
  );
}