import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Mail, Pencil, UserRound } from "lucide-react";
import api from "../services/api";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

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
        setFormData({ name: response.data.user.name || "", email: response.data.user.email || "" });
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

  const handleChange = (event) => {
    const { name: field, value } = event.target;
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const cancelEditing = () => {
    setFormData({ name: profile?.name || "", email: profile?.email || "" });
    setEditing(false);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim() || !formData.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const response = await api.put("/auth/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile(response.data.user);
      setFormData({ name: response.data.user.name, email: response.data.user.email });
      setEditing(false);
      setSuccess(response.data.message || "Profile updated successfully.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

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

        {success && (
          <div className="mt-6 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2 size={18} />
            {success}
          </div>
        )}

        {editing ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label htmlFor="name" className="text-sm font-medium text-gray-700">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
                className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-[#0d3b2e] focus:ring-2 focus:ring-[#0d3b2e]/15"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
                className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-[#0d3b2e] focus:ring-2 focus:ring-[#0d3b2e]/15"
              />
            </div>
            {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
            <div className="flex justify-end gap-3 pt-1">
              <button type="button" onClick={cancelEditing} disabled={saving} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-60">Cancel</button>
              <button type="submit" disabled={saving} className="rounded-lg bg-[#0d3b2e] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0a2f24] disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        ) : (
          <>
        <dl className="mt-6 space-y-5">
          <div className="flex gap-3 items-center">
            <UserRound className="mt-0.5 shrink-0 text-[#0d3b2e]" size={20} />
            <div>
              <dt className="text-sm text-gray-500">Full name</dt>
              <dd className="mt-0.5 font-medium text-gray-900">{name}</dd>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <Mail className="mt-0.5 shrink-0 text-[#0d3b2e]" size={20} />
            <div>
              <dt className="text-sm text-gray-500">Email address</dt>
              <dd className="mt-0.5 font-medium text-gray-900 break-all">{profile?.email || "Not available"}</dd>
            </div>
          </div>
        </dl>
        <div className="mt-7 flex justify-end border-t border-gray-100 pt-6">
          <button onClick={() => { setSuccess(""); setError(""); setEditing(true); }} className="inline-flex items-center gap-2 rounded-lg border border-[#0d3b2e] px-4 py-2 text-sm font-medium text-[#0d3b2e] transition hover:bg-[#0d3b2e] hover:text-white">
            <Pencil size={16} />
            Edit profile
          </button>
        </div>
          </>
        )}
      </section>
    </main>
  );
}

export default Profile;
