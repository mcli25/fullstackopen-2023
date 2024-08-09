const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({});
    response.json(blogs);
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.post("/", (request, response, next) => {
  const blog = new Blog(request.body);

  blog
    .save()
    .then((result) => {
      response.status(201).json(result);
    })
    .catch((error) => {
      next(error);
    });
});

blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;
    const result = await Blog.findByIdAndDelete(id);
    if (result) {
      response.status(204).end();
    } else {
      response.status(404).json({ error: "Blog not found" });
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.put('/:id', async (request, response, next) => {

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true, runValidators: true, context: 'query' }
    )
    if (updatedBlog) {
      response.json(updatedBlog)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter;
