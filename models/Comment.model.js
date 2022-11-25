const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
    {
        content: String,
        imageUser: String,
        author: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
    },
    {
        timestamps: true,
    }
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;