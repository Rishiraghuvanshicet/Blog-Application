const { Document, Packer, Paragraph, HeadingLevel } = require("docx");
const XLSX = require("xlsx");
const Post = require("../models/postSchema");

// 📄 Export Single Post as Word
const exportPostToWord = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate("author", "name");

    if (!post) return res.status(404).json({ message: "Post not found" });

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({ text: post.title, heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: `Author: ${post.author.name}` }),
            new Paragraph(""),
            new Paragraph(post.content),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    const filename = `${post.title.replace(/\s+/g, "_")}.docx`;

    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.send(buffer);
  } catch (err) {
    console.error("Word export error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 📊 Export All Posts as Excel
const exportAllPostsToExcel = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "name email");

    const data = posts.map((post) => ({
      Title: post.title,
      Author: post.author.name,
      Email: post.author.email,
      Content: post.content,
      Likes: post.likes.length,
      Comments: post.comments.length,
      CreatedAt: post.createdAt,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Posts");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", "attachment; filename=posts.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (err) {
    console.error("Excel export error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  exportPostToWord,
  exportAllPostsToExcel,
};
