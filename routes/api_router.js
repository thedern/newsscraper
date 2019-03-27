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
            data.results.push(returnData[i])

            /*
                sample of data returned
                data is { results:
                [ { _id: 5c994176b8b253092c1fd62b,
                    title:
                        '\n\n\nHeartburn Gave My Dad Cancer. What About The Rest Of Us?\n\n\n\n',
                    link:
                        'https://undark.org/article/esophageal-cancer-rates-rising-united-states/',
                    summary:
                        '\nEsophageal cancer related to chronic acid reflux is among the fastest-growing cancers in the US. Diet and weight are likely culprits, but what else?\n',
            */
        }
    });  // end query data

    // render page in handlebars sending the data object
    resp.render('index', data);
 
}); // end get

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("comments")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });


/* ==========================================================================
   POST ROUTES
   ========================================================================== */



/* ==========================================================================
   UPDATE ROUTES
   ========================================================================== */



/* ==========================================================================
   DELETE ROUTES
   ========================================================================== */

module.exports = router;
