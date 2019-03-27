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

        var results = {};

        $('div.digg-story__content').each(function(i, element) {

            var title = $(element).find($('h2.digg-story__title.entry-title')).text();

            var link = $(element).find($('h2.digg-story__title.entry-title')).children().attr("href");

            var summary = $(element).find($('div.digg-story__description.entry-content.js--digg-story__description')).text();

            // save results to object
            results.title = title;
            results.link = link;
            results.summary = summary;
            
            // create DB entries for scraped articles
            db.Article.create(results).then((dbArticle) => {
                console.log(dbArticle);
            }).catch((err) =>{
                console.log(err);
            });

        }); // end data collection

    }); // end axios


    // the redirect to articles page should hit the get route for the DB 
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

       //  I NEED TO CREATE AN OBJECT AND PUT returnData in it as the key the array is the value... see below
       //  each title, link, and summary need to be an object which will be pushed to an array.  Each member of
       //  the array will be an object.  
       //  data = { results: [ {id title link summary},{id title link summary},{id title link summary},... ]}

        // for each loop, i need to do something like this... kinda... sorta... maybe
        for (var i = 0; i < returnData.length; i++) {

            //console.log('return data is', returnData[i]);
            data.results.push(returnData[i])

            // data.results.push

            /*
            data is already and object... need to push onto array.  // data.results.push(returnData[i])
            return data is { _id: 5c994204b6c31b2b987663fc,
                title: '\n\n\nHow Fake Meat Could Save The Planet\n\n\n\n',
                link:
                 'https://onezero.medium.com/how-fake-meat-could-save-the-planet-70e23b937e7b',
                summary:
                 '\nRealistic alternative meats and dairy products could herald the end of livestock farming  —  and change the way we make food.\n',
                __v: 0 }


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

        console.log('data is', data)
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
