import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const { error } = await supabase.from("posts").insert([
      { title, content, image_url: image }
    ]);

    if (!error) navigate("/");
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-8">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-green-800 mb-2">Create New Post</h1>
        <p className="text-gray-600">Share your matcha experience with the community</p>
      </div>

      {/* Form Card */}
      <div className="bg-white shadow-xl rounded-2xl p-8 border-t-4 border-green-600">

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title *
            </label>
            <input
              required
              className="w-full border-2 border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              placeholder="e.g., Best Matcha Latte in Tokyo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Content Textarea */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows="6"
              className="w-full border-2 border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none"
              placeholder="Share your thoughts, recipe, or experience..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* Image URL Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Image URL
            </label>
            <input
              className="w-full border-2 border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              placeholder="https://example.com/image.jpg"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
            {image && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <img
                  src={image}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-xl border-2 border-gray-200"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              Create Post
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-4 rounded-xl font-semibold transition-all"
            >
              Cancel
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}