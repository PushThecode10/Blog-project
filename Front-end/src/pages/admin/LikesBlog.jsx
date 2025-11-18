// import Sidebar from "../../components/Sidebar";
// import Header from "../../components/Header";
// import API from "../../axios";
// import React, { useEffect, useState } from "react";

// const LikesBlog = () => {
//   const [likedBlogs, setLikedBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("");


//   useEffect(() => {
//     const fetchLikes = async () => {
//       try {
//         const res = await API.get("blogs/liked");
//         const blogs = (res.data?.likedBlogs || []).filter((b) => b !== null);
//         setLikedBlogs(blogs);
//       } catch (error) {
//         console.error("Error fetching liked blogs:", error);
//         setMessage("❌ Failed to load liked blogs");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchLikes();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Sidebar />
//       <Header />

//       <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-6 ml-80">
//         <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-[#40a7cf] to-[#da4453] bg-clip-text text-transparent">
//           ❤️ Your Liked Blogs
//         </h2>

//         {/* Loading Spinner */}
//         {loading && (
//           <div className="flex justify-center items-center py-20">
//             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#40a7cf]"></div>
//           </div>
//         )}

//         {/* Error Message */}
//         {!loading && message && (
//           <div className="text-center py-20 text-red-500 font-semibold">
//             {message}
//           </div>
//         )}

//         {/* Empty State */}
//         {!loading && likedBlogs.length === 0 && !message && (
//           <div className="text-center py-20">
//             <svg
//               className="mx-auto h-24 w-24 text-gray-300"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={1.5}
//                 d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//               />
//             </svg>
//             <h3 className="text-2xl font-semibold text-gray-700 mb-2 mt-10">
//               No liked blogs yet
//             </h3>
//             <p className="text-gray-500 mb-6">
//               Start exploring and like the blogs you love!
//             </p>
//           </div>
//         )}

//         {/* Liked Blogs Grid */}
//         {!loading && likedBlogs.length > 0 && (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {likedBlogs.map((blog, index) => (
//                 <div
//                   key={blog._id || index}
//                   className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
//                 >
//                   {/* Thumbnail */}
//                   <div className="relative overflow-hidden h-56">
//                     <img
//                       src={blog.thumbnail || "/default-thumb.jpg"}
//                       alt={blog.title || "Untitled"}
//                       className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
//                     />
//                   </div>

//                   {/* Content */}
//                   <div className="p-6">
//                     <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-[#40a7cf] transition-colors">
//                       {blog.title || "Untitled Blog"}
//                     </h2>

//                     <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
//                       {blog.description?.slice(0, 120) || "No description"}...
//                     </p>

//                     {/* ✅ Like count */}
//                     <div className="flex items-center justify-between mt-4">
//                       <div className="flex items-center gap-2 text-gray-700">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="currentColor"
//                           viewBox="0 0 20 20"
//                           className="w-5 h-5 text-[#da4453]"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.657l-6.828-6.829a4 4 0 010-5.656z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                         <span className="font-medium text-gray-700">
//                           Likes:{" "}
//                           <span className="text-[#40a7cf] font-semibold">
//                             {blog.likeCount || blog.likes?.length || 0}
//                           </span>
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Total Count */}
//             <div className="mt-12 text-center">
//               <p className="text-gray-600 text-lg">
//                 You have liked{" "}
//                 <span className="font-bold text-[#40a7cf]">
//                   {likedBlogs.length}
//                 </span>{" "}
//                 {likedBlogs.length === 1 ? "blog" : "blogs"}
//               </p>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LikesBlog;
