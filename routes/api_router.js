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

        var results = [];

        $('div.digg-story__content').each(function(i, element) {
        //$('h2.digg-story__title.entry-title').each(function(i, element) {

            var title = $(element).find($('h2.digg-story__title.entry-title')).text();

            var link = $(element).find($('h2.digg-story__title.entry-title')).children().attr("href");

            var summary = $(element).find($('div.digg-story__description.entry-content.js--digg-story__description')).text();

            results.push({
                title: title,
                link: link,
                summary: summary
            });



        });

        // do stuff with cherrio to render page with handlebars
        // this works, gets me title and link
        // 
        console.log('results are', results);
       
    });

    resp.render('index');
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
