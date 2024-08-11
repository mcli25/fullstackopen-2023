import React, { useState } from "react";

const BlogForm = ({
  user,
  addBlog,
  setUser,
  addBlogVisible,
  setAddBlogVisible,
}) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const hideWhenVisible = { display: addBlogVisible ? "none" : "" };
  const showWhenVisible = { display: addBlogVisible ? "" : "none" };

  const logout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addBlog({ title, author, url });
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <div>
      <p>
        {user.username} logged-in <button onClick={logout}>logout</button>
      </p>

      <h2>create new</h2>
      <div style={hideWhenVisible}>
        <button onClick={() => setAddBlogVisible(true)}>create</button>
      </div>
      <div style={showWhenVisible}>
        <form onSubmit={handleSubmit}>
          <div>
            <label>title: </label>
            <input type="text" value={title} onChange={handleTitleChange} />
          </div>
          <div>
            <label>author: </label>
            <input type="text" value={author} onChange={handleAuthorChange} />
          </div>
          <div>
            <label>url: </label>
            <input type="text" value={url} onChange={handleUrlChange} />
          </div>
          <button type="submit">create</button>
        </form>
        <button onClick={() => setAddBlogVisible(false)}>cancel</button>
      </div>
    </div>
  );
};

export default BlogForm;
