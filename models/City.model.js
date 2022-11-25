const { Schema, model } = require("mongoose");

const citySchema = new Schema(

    {
        cityName: {
            type: String,
            required: true,

        },
        continent: {
            type: String,
        },
        currency: String,
        language: String,
        englishSkills: Number,
        lifeExpectancy: Number,
        coworkingSpaces: Number,
        cityImage: String,
        comments: [{
            type: Schema.Types.ObjectId, ref: "Comment",
        }],
        favorite: [{
            type: Schema.Types.ObjectId, ref: "User",
        }],
    },
    {
        timestamps: true,
    }
);

const City = model("City", citySchema);

module.exports = City;