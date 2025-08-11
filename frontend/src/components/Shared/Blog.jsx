import { BookOpenIcon, CalendarDaysIcon, HomeIcon, UserCircleIcon } from "@heroicons/react/16/solid";
import React from "react";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Power of Authentic Feedback",
      author: "Jane Doe",
      date: "Aug 10, 2025",
      snippet:
        "Learn how genuine testimonials can build trust and drive conversions for your business. We explore the psychology behind social proof.",
      imageUrl:
        "https://placehold.co/600x400/2F3061/E6E8F3?text=Authentic+Feedback",
      isFeatured: true, // This post will be the featured one
    },
    {
      id: 2,
      title: "A Guide to Writing Impactful Testimonials",
      author: "John Smith",
      date: "Aug 08, 2025",
      snippet:
        "Struggling to get meaningful testimonials from your clients? This guide provides a step-by-step framework to help you.",
      imageUrl:
        "https://placehold.co/600x400/2F3061/E6E8F3?text=Writing+Testimonials",
    },
    {
      id: 3,
      title: "Success Stories: How Truetestify Changed the Game",
      author: "Team Truetestify",
      date: "Aug 05, 2025",
      snippet:
        "We highlight some of the most inspiring success stories from businesses that leveraged our platform to grow their brand.",
      imageUrl:
        "https://placehold.co/600x400/2F3061/E6E8F3?text=Success+Stories",
    },
    {
      id: 4,
      title: "Behind the Scenes: Our Mission to Build Trust",
      author: "Marketing Dept.",
      date: "Jul 30, 2025",
      snippet:
        "Discover the core values and mission that drive our team to create a platform built on transparency and trust.",
      imageUrl: "https://placehold.co/600x400/2F3061/E6E8F3?text=Our+Mission",
    },
  ];

  // Find the featured post for a special layout
  const featuredPost = blogPosts.find((post) => post.isFeatured);
  // Filter out the featured post for the grid view
  const otherPosts = blogPosts.filter((post) => !post.isFeatured);
  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="mx-auto max-w-7xl">

        {/* Main Blog Header */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 md:text-5xl">
            The <span className="text-indigo-600">truetestify</span> Blog
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Insights, success stories, and tips on building trust with
            testimonials.
          </p>
        </header>

        {/* Featured Blog Post Section */}
        {featuredPost && (
          <div className="mb-12 overflow-hidden  bg-white shadow-xl md:flex md:items-center">
            <div className="md:w-1/2">
              <img
                src={featuredPost.imageUrl}
                alt={featuredPost.title}
                className="h-half w-half object-cover"
              />
            </div>
            <div className="p-8 md:w-1/2">
              <span className="mb-2 inline-block  bg-indigo-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">
                Featured Post
              </span>
              <h2 className="mb-3 text-3xl font-bold text-gray-800">
                {featuredPost.title}
              </h2>
              <p className="mb-4 text-gray-600">{featuredPost.snippet}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <UserCircleIcon size={16} />
                  <span>{featuredPost.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CalendarDaysIcon size={16} />
                  <span>{featuredPost.date}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid of Other Blog Posts */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {otherPosts.map((post) => (
            <div
              key={post.id}
            className="overflow-hidden bg-white shadow-lg transition-transform hover:scale-105"
            >
              <img
                src={post.imageUrl}
                alt={post.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-gray-800">
                  {post.title}
                </h3>
                <p className="mb-4 text-gray-600 line-clamp-3">
                  {post.snippet}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <UserCircleIcon size={14} />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarDaysIcon size={14} />
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
