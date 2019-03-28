// requires
const mongoose = require('mongoose');
const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");

// creat express router
const router = express.Router();

// require all models
const db = require("../models");

// connect to the database
mongoose.connect("mongodb://localhost/newsscraper", { useNewUrlParser: true });

/* ==========================================================================
   GET ROUTES
   ========================================================================== */

// home route scraps the target site and load into cheerio
router.get('/', (req, resp) => {
    axios.get('http://digg.com/channel/science').then((response) => {
        // console.log(response.data);
        var $ = cheerio.load(response.data);

        // c
        var results = {};

        $('div.digg-story__content').each(function(i, element) {

            var aTitle = $(element).find($('h2.digg-story__title.entry-title')).text();
            //console.log('aTitle is', aTitle);

            var link = $(element).find($('h2.digg-story__title.entry-title')).children().attr("href");

            var summary = $(element).find($('div.digg-story__description.entry-content.js--digg-story__description')).text();

            // save results to object
            results.title = aTitle;
            results.link = link;
            results.summary = summary;

            // save article to DB if and only if document with same title does not exist, unique enforced in schema
            
            db.Article.create(results).then((dbArticle) => {
                console.log(dbArticle);
            }).catch((err) => {
                console.log('error is',err);
            });
            
        }); // end data srape and save to db
    }); // end axios request

    /* start page render */

    // create object to send to handlebars
    var data = {
        results: []
    };

    // get articles and render page
    db.Article.find({})
    // get 5 newest
    .sort({'title': -1})
    .limit(5)
    .then(function(returnData) {
        console.log(returnData);

        // for each data object returned, pushed to array (results) in data object
        for (var i = 0; i < returnData.length; i++) {

            //console.log('return data is', returnData[i]);
            data.results.push(returnData[i]);
        }
    });  // end query data

    // render page in handlebars sending the data object
    resp.render('index', data);
 
}); // end get

// Route for grabbing a specific article by id when title (<li> tag) is clicked on in 'aticles' sections
router.get("/articles/:id", (req, resp) => {
    // Using the articleID passed in via the appLogic.js ajax request, query the db for the matching document
    db.Article.findOne({ _id: req.params.id })
      // and populate all comments associated with it
      .populate("comment")
      .then((dbArticle) => {
        // pass the results back to the calling ajax request in appLogic.js
        resp.json(dbArticle);
      })
      .catch((err) => {
        // if error send to ajax call
        console.log('route error is', err);
        resp.json(err);
      });
  });


/* ==========================================================================
   POST/UPDATE ROUTE
   ========================================================================== */
router.post("/articles/:id", (req, resp) => {
    // new comment create... data object posted is already in correct format for insert
    db.Comments.create(req.body)
    .then((dbComment) => {
        // get article with matching id as comment and update comment
        return db.Article.findOneAndUpdate({_id: req.params.id},{comment: dbComment.id},{new: true});
    })
    .then((dbArticle) => {
        // return data to calling ajax function
        resp.json(dbArticle);
    })
    .catch((err) => {
        console.log('route error is', err);
        resp.json(err);
    })
});


/* ==========================================================================
   DELETE ROUTES
   ========================================================================== */

// export router for application use
module.exports = router;
