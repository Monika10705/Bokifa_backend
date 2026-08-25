import { useEffect, useState } from "react";
import { AlertCircle, Mail, UserRound } from "lucide-react";
import api from "../services/api";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProfile() {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/auth/profile", {
          signal: controller.signal,
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(response.data.user);
      } catch (requestError) {
        if (requestError.code !== "ERR_CANCELED") {
          setError(requestError.response?.data?.message || "Unable to load your profile. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadProfile();
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16" aria-busy="true">
        <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-8 shadow-sm space-y-5">
          <div className="h-16 w-16 rounded-full bg-gray-200" />
          <div className="h-7 w-48 rounded bg-gray-200" />
          <div className="h-5 w-64 rounded bg-gray-100" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-700 flex items-start gap-3">
          <AlertCircle className="mt-0.5 shrink-0" size={20} />
          <div>
            <h1 className="font-semibold">Profile unavailable</h1>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  const name = profile?.name || "User";
  const initial = name.charAt(0).toUpperCase();

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
      <p className="mt-2 text-gray-500">Your account details</p>

      <section className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#0d3b2e] text-2xl font-semibold text-white">
            {initial}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold text-gray-900">{name}</h2>
            <p className="capitalize text-sm text-gray-500">{profile?.role || "user"}</p>
          </div>
        </div>

        <dl className="mt-6 space-y-5">
          <div className="flex gap-3">
            <UserRound className="mt-0.5 shrink-0 text-[#0d3b2e]" size={20} />
            <div>
              <dt className="text-sm text-gray-500">Full name</dt>
              <dd className="mt-0.5 font-medium text-gray-900">{name}</dd>
            </div>
          </div>
          <div className="flex gap-3">
            <Mail className="mt-0.5 shrink-0 text-[#0d3b2e]" size={20} />
            <div>
              <dt className="text-sm text-gray-500">Email address</dt>
              <dd className="mt-0.5 font-medium text-gray-900 break-all">{profile?.email || "Not available"}</dd>
            </div>
          </div>
        </dl>
      </section>
    </main>
  );
}

export default Profile;
