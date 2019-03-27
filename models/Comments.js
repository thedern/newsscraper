// requires
const mongoose = require('mongoose');

// schema constructor reference
const Schema = mongoose.Schema;

// schema
var CommentSchema = new Schema({
    title: String,
    body: String
  });
  
  // create model (collection + document schema)

  var Comments = mongoose.model('Comments', CommentSchema);

  // export for use
  module.exports = Comments;