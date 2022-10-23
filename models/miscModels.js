const mongoose = require('mongoose');

// schemas
const blogSchema = mongoose.Schema({
    cover : {
        type: String
    },
    title : {
        type: String,
        required: true
    },
    body : {
        type: String,
        required: true
    },
    categories: [
        {
            type: String
        }
    ]
}, { timestamps: true })


// models
let Blog = mongoose.model('blog', blogSchema);


// exports
module.exports = {
    Blog
}
