import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

export default function HomeFeed() {
  const [posts, setPosts] = useState([]);
  const [sort, setSort] = useState("new");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [sort, search]);

  async function fetchPosts() {
    setLoading(true);
    let query = supabase.from("posts").select("*");

    if (search.trim()) {
      query = query.ilike("title", `%${search}%`);
    }

    if (sort === "new") {
      query = query.order("created_at", { ascending: false });
    } else {
      query = query.order("upvotes", { ascending: false });
    }

    const { data, error } = await query;
    
    if (!error) {
      setPosts(data || []);
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-green-800 mb-2">Discover Matcha</h1>
        <p className="text-gray-600">Explore and share the best matcha experiences</p>
      </div>

      <div className="mb-6">
        <input
          className="w-full md:w-96 border-2 border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
          placeholder="🔍 Search matcha posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3 mb-8">
        <span className="font-semibold text-gray-700">Sort by:</span>

        <button
          className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 ${
            sort === "new"
              ? "bg-green-600 text-white shadow-md transform scale-105"
              : "bg-white text-gray-700 border-2 border-gray-300 hover:border-green-600 hover:text-green-600"
          }`}
          onClick={() => setSort("new")}
        >
           Newest
        </button>

        <button
          className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 ${
            sort === "upvotes"
              ? "bg-green-600 text-white shadow-md transform scale-105"
              : "bg-white text-gray-700 border-2 border-gray-300 hover:border-green-600 hover:text-green-600"
          }`}
          onClick={() => setSort("upvotes")}
        >
           Popular
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
        
          <p className="text-xl text-gray-600">Loading posts...</p>
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <Link
              key={p.id}
              to={`/post/${p.id}`}
              className="group cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              {p.image_url ? (
                <div className="relative h-56 overflow-hidden bg-gray-200">
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ) : (
                <div className="h-56 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  
                </div>
              )}

              <div className="p-5">
                <h3 className="font-bold text-xl text-green-800 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                  {p.title}
                </h3>

                {p.content && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {p.content}
                  </p>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">👍</span>
                    <span className="font-semibold text-gray-700">{p.upvotes || 0}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(p.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          
          <p className="text-gray-600 text-lg mb-4">
            No posts yet. Be the first to share!
          </p>
          <Link
            to="/new"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Create Your First Post
          </Link>
        </div>
      )}
    </div>
  );
}