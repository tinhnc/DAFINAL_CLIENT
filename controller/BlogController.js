const Blog = require("../models/Blog");
const utils = require("../utils/mongoose");
const { convert } = require('html-to-text');

// Hàm định dạng ngày giờ
function formatDateTime(dateString) {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.getMonth() + 1; // Tháng bắt đầu từ 0 nên cộng thêm 1
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const formattedDateTime = `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
  return formattedDateTime;
}

module.exports = {
  showListBlog: async (req, res) => {
    try {
      const blogs = await Blog.find();
  
      // Tạo một trường mới để lưu giá trị định dạng ngày giờ
      const formattedBlogs = blogs.map((blog) => {
        const plainTextContent = convert(blog.content, {
          wordwrap: false, // Disable word wrapping
        });
        // Truncate the content to a specific character limit (e.g., 200 characters)
        const truncatedContent = plainTextContent.length > 200
          ? plainTextContent.slice(0, 200) + '...'  // If content is longer than 200 characters, truncate it
          : plainTextContent;
  
        return {
          ...blog.toObject(),
          formattedDate: formatDateTime(blog.date),
          truncatedContent: truncatedContent, // Add truncated content to the object
        };
      });
  
      res.render("blog/blog", { blogs: formattedBlogs });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  },
  
  viewBlogDetail: async (req, res) => {
    try {
      const blogId = req.params.id;
      const blog = await Blog.findById(blogId);
  
      if (!blog) {
        return res.status(404).send("Blog not found");
      }
  
      // Tạo một trường mới để lưu giá trị định dạng ngày giờ cho bài viết chi tiết
      const formattedBlog = {
        ...blog.toObject(),
        formattedDate: formatDateTime(blog.date),
      };
  
      // Lấy ba bài viết gần nhất (loại bài viết hiện tại)
      const recentBlogs = await Blog.find({ _id: { $ne: blog._id } })
        .sort({ date: -1 }) // Sắp xếp theo ngày giảm dần
        .limit(3); // Giới hạn chỉ lấy 3 bài viết gần nhất
  
      // Định dạng ngày giờ và nội dung cho các bài viết gần nhất
      const formattedRecentBlogs = recentBlogs.map((recentBlog) => {
        const plainTextContent = convert(recentBlog.content, {
          wordwrap: false, // Disable word wrapping
        });
        // Truncate the content to a specific character limit (e.g., 200 characters)
        const truncatedContent = plainTextContent.length > 200
          ? plainTextContent.slice(0, 200) + '...'  // If content is longer than 200 characters, truncate it
          : plainTextContent;
  
        return {
          ...recentBlog.toObject(),
          formattedDate: formatDateTime(recentBlog.date),
          truncatedContent: truncatedContent, // Add truncated content to the object
        };
      });
  
      res.render("blog-details/blog-detail", { blog: formattedBlog, recentBlogs: formattedRecentBlogs });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  },
};
