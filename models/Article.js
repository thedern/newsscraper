// requires
const mongoose = require('mongoose');

// schema constructor reference
const Schema = mongoose.Schema;

// schema
var ArticleSchema = new Schema({
    
    title: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: true
    },
    note: {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  });

  // create model (collection + document schema)

  var Article = mongoose.model('Article', ArticleSchema);

  // export for use
  module.exports = Article;
