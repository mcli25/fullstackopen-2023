import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [newBlog, setNewBlog] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [addBlogVisible, setAddBlogVisible] = useState(false);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
      blogService.getAll().then((blogs) => setBlogs(blogs));
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("Wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };
  const addBlog = async (newBlog) => {
    try {
      const createdBlog = await blogService.create(newBlog);
      setBlogs((blogs) => blogs.concat(createdBlog));
      setErrorMessage(
        `Blog ${createdBlog.title} by ${createdBlog.author} added`
      );
    } catch (error) {
      console.error("Error creating blog:", error);
      setErrorMessage(`error creating blog: ${error.message}`);
    }
  };
  const updateBlog = async (updatedBlog, id) => {
    try {
      const returnedBlog = await blogService.update(id, updatedBlog);
      setBlogs(
        blogs.map((blog) => (blog.id === returnedBlog.id ? returnedBlog : blog))
      );
    } catch (error) {
      console.error("Error updating blog:", error);
      setErrorMessage(`Error updating blog: ${error.message}`);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id);

      setBlogs(blogs.filter((blog) => blog.id !== id));
    } catch (error) {
      console.error("Error updating blog:", error);
      setErrorMessage(`Error updating blog: ${error.message}`);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };
  //sort by likes in descending order
  const compareByLikes = (a, b) => b.likes - a.likes;

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} />
      {user === null ? (
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        ></LoginForm>
      ) : (
        <BlogForm
          user={user}
          addBlog={addBlog}
          newBlog={newBlog}
          setUser={setUser}
          addBlogVisible={addBlogVisible}
          setAddBlogVisible={setAddBlogVisible}
        ></BlogForm>
      )}
      {blogs.sort(compareByLikes).map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          deleteBlog={deleteBlog}
        />
      ))}
    </div>
  );
};

export default App;
