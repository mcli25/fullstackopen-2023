import React, { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, updateBlog, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  const handleLike = async () => {
    try {
      const updatedBlog = {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1,
      };
      await updateBlog(updatedBlog, blog.id);
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };
  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${blog.title}?`
    );

    if (confirmed) {
      try {
        await deleteBlog(blog.id);
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  return (
    <div style={blogStyle}>
      <h2>{blog.title}</h2>
      <p>Author: {blog.author}</p>
      <button onClick={toggleDetails}>{showDetails ? "Hide" : "View"}</button>
      {showDetails && (
        <div className="blog-details">
          <p>URL: {blog.url}</p>
          <p>likes: {blog.likes}</p>
          <button onClick={handleLike}>like</button>
          <p>Creator: {blog.user ? blog.user.username : "Unknown"}</p>
          <button onClick={handleDelete}>delete</button>
        </div>
      )}
    </div>
  );
};

export default Blog;
