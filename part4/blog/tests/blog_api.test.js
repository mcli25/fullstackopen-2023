const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../index");
const Blog = require("../models/blog");
const { initialBlogs } = require("./test_helper");
const User = require("../models/user");
const api = supertest(app);
const bcrypt = require("bcrypt");

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("testpassword", 10);
  const user = new User({
    username: "testuser",
    name: "Test User",
    passwordHash,
  });
  await user.save();

  const loginResponse = await api.post("/api/login").send({
    username: "testuser",
    password: "testpassword",
  });

  token = loginResponse.body.token;

  console.log("Token received:", token);

  const blogObjects = initialBlogs.map(
    (blog) =>
      new Blog({
        ...blog,
        user: user._id,
      })
  );
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test("blogs are returned as json and with correct amount of blog posts", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  assert.strictEqual(response.body.length, initialBlogs.length);
});

test("blog posts have id as the unique identifier", async () => {
  const response = await api.get("/api/blogs");
  const blogIds = new Set();

  response.body.forEach((blog) => {
    assert.ok(blog.id);
    assert.strictEqual(typeof blog.id, "string");
    //check if there is no duplicate
    assert.strictEqual(blogIds.has(blog.id), false);

    blogIds.add(blog.id);
  });
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "Design pattern",
    author: "Oscar Martin",
    url: "https://designpattern.com/",
    likes: 17,
  };
  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  const titles = response.body.map((r) => r.title);
  assert.strictEqual(response.body.length, initialBlogs.length + 1);

  assert(titles.includes("Design pattern"));
});

test("set the number of likes to 0 if property of likes is missing", async () => {
  const newBlog = {
    title: "Test pattern",
    author: "Test Martin",
    url: "https://test.com/",
  };

  const response = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.likes, 0);
});

test("if the title or url properties are missing from the request data, the backend responds to the request with the status code 400 Bad Request.", async () => {
  const newBlog1 = {
    author: "Test Martin",
    url: "https://test.com/",
  };
  const newBlog2 = {
    title: "Test pattern",
    author: "Test Martin",
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog1)
    .expect(400)
    .expect("Content-Type", /application\/json/);
  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog2)
    .expect(400)
    .expect("Content-Type", /application\/json/);
});

test("the number of blogs decreases by 1 after deleting a single blog", async () => {
  let response = await api.get("/api/blogs");
  const blogToDelete = response.body[0];
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(204);

  response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, initialBlogs.length - 1);
});

test("thumb up to increase likes by 1 succeeds with status code 200 if id is valid", async () => {
  let response = await api.get("/api/blogs");

  const blogToUpdate = response.body[0];

  const updatedBlog = {
    title: blogToUpdate.title,
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: blogToUpdate.likes + 1,
  };

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .set("Authorization", `Bearer ${token}`)
    .send(updatedBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  response = await api.get("/api/blogs");

  const updatedBlogInDb = response.body.find(
    (blog) => blog.id === blogToUpdate.id
  );
  assert.strictEqual(updatedBlogInDb.likes, blogToUpdate.likes + 1);
});

after(async () => {
  await mongoose.connection.close();
});
