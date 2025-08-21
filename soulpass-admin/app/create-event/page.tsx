"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // simple random claim code generator
  const generateClaimCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      alert("⚠️ Please select an image for the event.");
      return;
    }

    setLoading(true);
    const claimCode = generateClaimCode();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("image", image);
      formData.append("claimCode", claimCode);

      // ✅ call the correct API route
      const res = await fetch("/api/create-event", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert(
          `✅ Event created!\n\n📌 Claim Code: ${claimCode}\n🔗 Tx Hash: ${data.txHash}`
        );

        // reset form
        setName("");
        setDescription("");
        setImage(null);

        // back to dashboard
        router.push("/");
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">➕ Create Event</h1>

      <form onSubmit={handleCreateEvent} className="space-y-4">
        <input
          type="text"
          placeholder="Event Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
          disabled={loading}
        />

        <textarea
          placeholder="Event Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          required
          disabled={loading}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full p-2 border rounded"
          required
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "⏳ Creating..." : "Create Event"}
        </button>
      </form>
    </main>
  );
}
