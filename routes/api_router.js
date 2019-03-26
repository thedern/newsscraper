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
        console.log(response.data);
        var $ = cheerio.load(response.data);

        // create object to send to handlebars
        // var data = {
        //     results: []
        // };

        var results = {};

        $('div.digg-story__content').each(function(i, element) {
        //$('h2.digg-story__title.entry-title').each(function(i, element) {

            var title = $(element).find($('h2.digg-story__title.entry-title')).text();

            var link = $(element).find($('h2.digg-story__title.entry-title')).children().attr("href");

            var summary = $(element).find($('div.digg-story__description.entry-content.js--digg-story__description')).text();

            // data.results.push({
            //     title: title,
            //     link: link,
            //     summary: summary

            // save to DB
            results.title = title;
            results.link = link;
            results.summary = summary;
            
            // create DB entries
            db.Article.create(results).then((dbArticle) => {
                console.log(dbArticle);
            }).catch((err) =>{
                console.log(err);
            });

        }); // end data collection

    }); // end axios

    // Each scraped article should be saved to your application database

    // save data.results to db

    // the redirect to articles page should hit the get route for the DB 
    // res.redirect('/articles') ==> 'app.get("/articles"' which goes to db and renders page // resp.render('index', data);

}); // end get


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
