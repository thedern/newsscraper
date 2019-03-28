// requires
const mongoose = require('mongoose');

// eliminates:  "DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead"
mongoose.set('useCreateIndex', true);

// schema constructor reference
const Schema = mongoose.Schema;

// schema
var ArticleSchema = new Schema({
    
    title: {
      type: String,
      required: true,
      unique: true
    },
    link: {
      type: String,
      required: true,
      unique: true
    },
    summary: {
      type: String,
      required: true,
      unique: true
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comments"
    }
  });

  // create model (collection + document schema)

  var Article = mongoose.model('Article', ArticleSchema);

  // export for use
  module.exports = Article;
