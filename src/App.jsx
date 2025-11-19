import { BrowserRouter, Routes, Route, useLocation, Link } from "react-router-dom";
import HomeFeed from "./pages/HomeFeed";
import CreatePost from "./pages/CreatePost";
import PostPage from "./pages/PostPage";
import EditPost from "./pages/EditPost";

function Layout({ children }) {
  const location = useLocation();
  const hideSidebar = location.pathname.includes("/post/");

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-green-50 to-gray-100">
      {!hideSidebar && (
        <aside className="w-64 fixed left-0 top-0 bottom-0 bg-gradient-to-b from-green-700 to-green-800 text-white shadow-2xl flex flex-col">
          <div className="px-6 py-8">
            <div className="flex items-center gap-3 mb-8">
             
              <h2 className="text-2xl font-bold">Matcha Hub</h2>
            </div>

            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                className={`px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                  location.pathname === "/"
                    ? "bg-white text-green-700 font-semibold shadow-lg"
                    : "hover:bg-green-600 hover:translate-x-1"
                }`}
              >
        
                <span>Home Feed</span>
              </Link>

              <Link
                to="/new"
                className={`px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                  location.pathname === "/new"
                    ? "bg-white text-green-700 font-semibold shadow-lg"
                    : "hover:bg-green-600 hover:translate-x-1"
                }`}
              >
      
                <span>Create Post</span>
              </Link>
            </nav>
          </div>

          <div className="mt-auto px-6 py-6 border-t border-green-600">
            <p className="text-sm text-green-200">
              Share your favorite matcha moments
            </p>
          </div>
        </aside>
      )}

        <main className={`overflow-y-auto ${!hideSidebar ? 'ml-64' : ''}`}>
        <div className="main">
          <div className="w-full max-w-7xl mx-auto content-wrapper">{children}</div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><HomeFeed /></Layout>} />
        <Route path="/new" element={<Layout><CreatePost /></Layout>} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/post/:id/edit" element={<EditPost />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;