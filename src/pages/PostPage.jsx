import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, []);

  async function fetchPost() {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();
    setPost(data);
  }

  async function fetchComments() {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", id)
      .order("created_at", { ascending: true });
    setComments(data || []);
  }

  async function addComment() {
    if (!newComment.trim()) return;

    await supabase.from("comments").insert([
      { post_id: id, text: newComment }
    ]);

    setNewComment("");
    fetchComments();
  }

  async function upvote() {
    const { data: p } = await supabase
      .from("posts")
      .select("upvotes")
      .eq("id", id)
      .single();

    await supabase
      .from("posts")
      .update({ upvotes: (p.upvotes || 0) + 1 })
      .eq("id", id);

    fetchPost();
  }

  async function deletePost() {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await supabase.from("posts").delete().eq("id", id);
      navigate("/");
    }
  }

  if (!post) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-100">
        <div className="text-center">
          
          <p className="text-xl text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold mb-6 transition-colors"
        >
          ← Back to Home
        </Link>

        {/* Main Post Card */}
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden mb-8">
          
          {/* Image */}
          {post.image_url && (
            <div className="relative h-96 bg-gray-200">
              <img 
                src={post.image_url} 
                alt={post.title}
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            
            {/* Title */}
            <h1 className="text-4xl font-bold text-green-800 mb-4">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b">
              <span className="flex items-center gap-1">
                 {new Date(post.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
              <span className="flex items-center gap-1">
                👍 {post.upvotes || 0} votes
              </span>
            </div>

            {/* Description */}
            {post.content && (
              <p className="text-gray-700 text-lg leading-relaxed mb-8 whitespace-pre-wrap">
                {post.content}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                onClick={upvote}
              >
                <span className="text-xl">👍</span>
                Upvote
              </button>

              <Link
                to={`/post/${id}/edit`}
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
            
                Edit
              </Link>

              <button
                onClick={deletePost}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
      
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white shadow-xl rounded-2xl p-8">
          
          <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
           
            Comments ({comments.length})
          </h2>

          {/* Comments List */}
          <div className="space-y-4 mb-8">
            {comments.length > 0 ? (
              comments.map((c) => (
                <div
                  key={c.id}
                  className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-xl hover:bg-green-100 transition-colors"
                >
                  <p className="text-gray-800 mb-2">{c.text}</p>
                  <small className="text-gray-500 text-xs">
                    {new Date(c.created_at).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </small>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>

          {/* Add Comment Form */}
          <div className="border-t pt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Add a comment
            </label>
            <div className="flex gap-3">
              <input
                className="flex-1 border-2 border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') addComment();
                }}
              />

              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
                onClick={addComment}
              >
                Post
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}