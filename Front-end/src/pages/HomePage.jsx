import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../axios.js';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import { useAuth } from '../Context/AuthProvide.jsx';
import { Helmet } from 'react-helmet-async';

const HomePage = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [likedBlogs, setLikedBlogs] = useState(new Set());
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await API.get('/blogs/all');
        setBlogs(res.data.blogs || []);
        setFilteredBlogs(res.data.blogs || []);
      } catch (error) {
        console.error(error);
        setMessage('❌ Failed to fetch blogs');
      }
    };
    fetchBlogs();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get('/categories/getAllCategories');
        setCategories(res.data.categories || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  // Filter blogs by category
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(
        blogs.filter((blog) => blog.category?._id === selectedCategory)
      );
    }
  }, [selectedCategory, blogs]);

  // Handle like for authenticated users
  const handleLike = async (blogId) => {
    if (!user) {
      setMessage('⚠️ Please login first to like this blog!');
      setTimeout(() => {
        setMessage('');
        navigate('/login');
      }, 1500);
      return;
    }

    try {
      const res = await API.post(
        `/blogs/like/${blogId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      setLikedBlogs((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(blogId)) {
          newSet.delete(blogId);
        } else {
          newSet.add(blogId);
        }
        return newSet;
      });

      setMessage(res.data.message || '✅ Blog liked successfully');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to like blog');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  // Determine how many blogs to show
  const displayedBlogs = user ? filteredBlogs : filteredBlogs.slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Navbar />
      <Helmet>
        <title>Home - MyBlogSite</title>
        <meta name="description" content="Welcome to MyBlogSite. Discover amazing stories, insights, and ideas from talented writers around the world." />
        <meta name="keywords" content="blog, stories, articles, myblogsite, insights, ideas" />
        <meta name="author" content="MyBlogSite" />
      </Helmet>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white py-24 mt-16 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-fadeIn">
            Welcome to Our Blog
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            {user 
              ? 'Discover amazing stories, insights, and ideas'
              : 'Discover amazing stories, insights, and ideas from talented writers around the world'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/blog"
              className="inline-block bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
            >
              Explore All Blogs
            </Link>
            {!user && (
              <Link
                to="/signup"
                className="inline-block bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105 shadow-2xl"
              >
                Join Us Today
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg text-center font-medium border-l-4 shadow-md animate-fadeIn ${
              message.includes('✅')
                ? 'bg-green-50 text-green-700 border-green-500'
                : message.includes('⚠️')
                ? 'bg-yellow-50 text-yellow-700 border-yellow-500'
                : 'bg-red-50 text-red-700 border-red-500'
            }`}
          >
            {message}
          </div>
        )}

        {/* Categories Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-3 text-center">
            Browse by Category
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Find the perfect content for your interests
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => setSelectedCategory(category._id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${
                  selectedCategory === category._id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Blogs Section */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                {selectedCategory === 'all' ? 'Featured Blogs' : 'Filtered Blogs'}
              </h2>
              <p className="text-gray-600">
                {user 
                  ? `${filteredBlogs.length} ${filteredBlogs.length === 1 ? 'blog' : 'blogs'}`
                  : (filteredBlogs.length > 4 
                      ? 'Showing top 4 blogs' 
                      : `${filteredBlogs.length} ${filteredBlogs.length === 1 ? 'blog' : 'blogs'} available`)
                }
              </p>
            </div>
          </div>

          {filteredBlogs.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-6">
                <svg
                  className="mx-auto h-32 w-32 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-700 mb-2">
                No blogs found
              </h3>
              <p className="text-gray-500 text-lg">Try selecting a different category</p>
            </div>
          ) : (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${user ? '' : 'xl:grid-cols-4'} gap-8`}>
              {displayedBlogs.map((blog) => (
                <article
                  key={blog._id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
                >
                  {/* Image */}
                  <Link to={`/blogs/${blog._id}`} className="block relative overflow-hidden">
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={
                          blog.thumbnail ||
                          'https://via.placeholder.com/400x300?text=No+Image'
                        }
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-2 bg-white/95 backdrop-blur-sm text-cyan-600 rounded-full text-xs font-bold shadow-lg">
                        {blog.category?.name || 'Uncategorized'}
                      </span>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-5">
                    <Link
                      to={`/blogs/${blog._id}`}
                      className="block mb-3 group-hover:text-cyan-600 transition-colors"
                    >
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-2 mb-2">
                        {blog.title}
                      </h3>
                      {blog.subtitle && (
                        <p className="text-gray-500 text-sm font-medium line-clamp-1 mb-2">
                          {blog.subtitle}
                        </p>
                      )}
                    </Link>

                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                      {blog.description}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleLike(blog._id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 ${
                          user && likedBlogs.has(blog._id)
                            ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                            : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md hover:shadow-lg'
                        }`}
                      >
                        {user && likedBlogs.has(blog._id) ? (
                          <AiFillLike className="text-lg" />
                        ) : (
                          <AiOutlineLike className="text-lg" />
                        )}
                        <span className="text-sm">Like</span>
                      </button>

                      <Link
                        to={`/blogs/${blog._id}`}
                        className="inline-flex items-center gap-1 text-cyan-600 font-semibold hover:gap-2 transition-all text-sm group/link"
                      >
                        Read
                        <svg
                          className="w-4 h-4 group-hover/link:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* View All Blogs Button - Only for non-authenticated users */}
        {!user && filteredBlogs.length > 4 && (
          <div className="mt-12 text-center">
            <Link
              to="/blog"
              className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/50"
            >
              View All Blogs ({filteredBlogs.length})
            </Link>
          </div>
        )}

        {/* Features Section - Only for non-authenticated users */}
        {!user && (
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Read Stories</h3>
              <p className="text-gray-600">Explore diverse content from amazing writers</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Save Favorites</h3>
              <p className="text-gray-600">Like and bookmark your favorite articles</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Join Community</h3>
              <p className="text-gray-600">Connect with readers and writers worldwide</p>
            </div>
          </div>
        )}

        {/* CTA Section */}
        {user ? (
          // CTA for authenticated users
          filteredBlogs.length > 0 && (
            <div className="mt-16 text-center bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl p-12 text-white">
              <h2 className="text-3xl font-bold mb-4">Want to see more?</h2>
              <p className="text-lg mb-6 opacity-90">
                Explore our complete collection of articles and stories
              </p>
              <Link
                to="/blog"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              >
                View All Blogs
              </Link>
            </div>
          )
        ) : (
          // CTA for non-authenticated users
          <div className="mt-20 relative bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-3xl p-12 md:p-16 text-white overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10 text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join our community today and unlock access to exclusive content, save your favorites, and connect with amazing writers
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/signup"
                  className="inline-block bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
                >
                  Create Free Account
                </Link>
                <Link
                  to="/login"
                  className="inline-block bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105"
                >
                  Already Have Account?
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;