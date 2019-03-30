/* get method for comments section */
$('#scrapeButton').click(function() {
  console.log('clicked scrape');
  $.ajax({
    method: 'GET',
    url: '/',
    success: function(result) {
      // Do something with the result
      console.log('scraped site');
    }
  });
});

// listener for click event on <li> tag
$(document).on('click', 'li', function() {
  // Empty the comments section
  $('#comments').empty();
  var articleID = $(this).attr('id');

  // ajax call to get the associated article and populate the comments pane
  $.ajax({
    method: 'GET',
    url: '/articles/' + articleID
  })
    // article returned from api_router.js vi 'data' object
    .then(data => {
      console.log('returned data is', data);
      $('#comments').append("<p class='mt-3'>" + data.title + '</p>');

      // input to enter a new title
      $('#comments').append(
        "<p m-3'><input class='form-control' id='titleinput' name='title' placeholder='comment title'></p>"
      );
      // textarea to add a new comment body
      $('#comments').append(
        "<p m-3'><textarea class='form-control' rows='5' id='bodyinput' name='body' placeholder='comment'></textarea></p>"
      );
      // button to submit a new comment, with the id of the article saved to it
      $('#comments').append(
        "<p class='m-3'><button data-id='" +
          data._id +
          "'id='savecomment'>Save Comment</button></p>"
      );
      $('#comments').append(
        "<p class='m-3'><button class='del' data-id='" +
          data._id +
          "'id='delcomment'>Delete Comment</button></p>"
      );

      // if there's a comment in the article
      if (data.comment) {
        // populate the title input
        $('#titleinput').val(data.comment.title);
        // populate the body textarea
        $('#bodyinput').val(data.comment.body);
      }
    });
});

/* post method for new comments */

// listener for click on save button
$(document).on('click', '#savecomment', function() {
  // capture the data_id of the button which is the document id in the DB
  console.log('clicked button');
  var thisId = $(this).attr('data-id');
  var thisTitle = $('#titleinput').val();
  var thisBody = $('#bodyinput').val();

  if (thisTitle && thisBody) {
    $.ajax({
      method: 'POST',
      url: '/articles/' + thisId,
      // create data object for POST request
      data: {
        title: thisTitle,
        body: thisBody
      }
    }).then(returnData => {
      console.log(returnData);
      // clear comments pane
      $('#comments').empty();
    });
  } else {
    console.log('error!');
  }
}); // end post for new comments

// listener for delete comment
$(document).on('click', '#delcomment', function() {
  console.log('clicked del button');
  var thisId = $(this).attr('data-id');

  $.ajax({
    type: 'GET',
    url: '/delete/' + thisId,
    success: function(result) {
      // Do something with the result
      console.log('comment deleted');
      $('#comments').empty();
    }
  });
}); // end delete
