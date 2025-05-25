import { useState } from "react";

export default function AnnouncementForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace with API call or state update
    console.log("Announcement:", { title, content });
    setTitle("");
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="text"
        placeholder="Title"
        className="w-full px-3 py-2 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Write announcement..."
        className="w-full px-3 py-2 border rounded"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
        Post Announcement
      </button>
    </form>
  );
}
