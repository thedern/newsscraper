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
            
        }); // end data collection

    }); // end axios


    // the redirect to articles page which populates screen 
    resp.redirect('/articles'); 
    

}); // end get


router.get('/articles', (res, resp) => {

    // create object to send to handlebars
    var data = {
        results: []
    };
    // get articles and render page
    db.Article.find({})
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

        // render page in handlebars sending the data object
        resp.render('index', data);

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
