const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const total = blogs.reduce((total, blog) => {
    return total + blog.likes;
  }, 0);

  return total;
};

const favoriteBlog = (blogs) => {
  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);
  const blog = sortedBlogs[0];
  const selectedProperties = ["title", "author", "likes"];

  const selectedData = Object.keys(blog)
    .filter((key) => selectedProperties.includes(key))
    .reduce((acc, key) => ({ ...acc, [key]: blog[key] }), {});

  return selectedData;
};

const mostBlogs = (blogs) => {
  const count = blogs.reduce((acc, blog) => {
    const author = blog.author;
    acc[author] = (acc[author] || 0) + 1;
    return acc;
  }, {});

  let max = 0;
  let authorToreturn;
  for (const author in count) {
    if (count[author] > max) {
      authorToreturn = author;
      max = count[author];
    }
  }

  return { author: authorToreturn, blogs: max };
};

const mostLikes = (blogs) => {
  const count = blogs.reduce((acc, blog) => {
    const author = blog.author;
    acc[author] = (acc[author] || 0) + blog.likes;
    return acc;
  }, {});

  let max = 0;
  let authorToreturn;
  for (const author in count) {
    if (count[author] > max) {
      authorToreturn = author;
      max = count[author];
    }
  }

  return { author: authorToreturn, likes: max };
};
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
