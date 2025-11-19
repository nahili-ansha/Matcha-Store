import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams, useNavigate } from "react-router-dom";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadPost(); }, []);

  async function loadPost() {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      setTitle(data.title);
      setContent(data.content);
      setImage(data.image_url);
    }
    setLoading(false);
  }

  async function updatePost(e) {
    e.preventDefault();

    await supabase
      .from("posts")
      .update({ title, content, image_url: image })
      .eq("id", id);

    navigate(`/post/${id}`);
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-100">
        <div className="text-center">
          <p className="text-xl text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-green-50 to-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/post/${id}`)}
            className="text-green-700 hover:text-green-800 font-semibold mb-4 flex items-center gap-2"
          >
            ← Back to Post
          </button>
          <h1 className="text-4xl font-bold text-green-800 mb-2">Edit Post</h1>
          <p className="text-gray-600">Update your matcha post details</p>
        </div>

        {/* Form Card */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border-t-4 border-yellow-500">

          <form onSubmit={updatePost} className="space-y-6">

            {/* Title Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title *
              </label>
              <input
                className="w-full border-2 border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                required
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

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => navigate(`/post/${id}`)}
                className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-4 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}