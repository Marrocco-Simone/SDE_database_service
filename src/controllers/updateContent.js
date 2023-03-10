const { isValidObjectId } = require("mongoose");
const { Content, User } = require("../schemas");

async function updateContent(req, res) {
  try {
    if (!req.body) {
      return res.status(400).send({ error: "Request body not sent" });
    }
    const { title, content_text } = req.body;
    if (!title && !content_text) {
      return res.status(400).send({ error: "Invalid request body" });
    }

    const contentId = req.params.contentId;

    if (!contentId || !isValidObjectId(contentId)) {
      return res.status(400).send({ error: "Content ID not valid" });
    }

    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).send({ error: "Content not found" });
    }

    if (!content.user.equals(req.user._id)) {
      return res.status(403).send({ error: "Forbidden" });
    }

    if (title) content.title = title;
    if (content_text) content.content_text = content_text;

    await content.save();

    res.send(content.toObject());
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

module.exports = { updateContent };
