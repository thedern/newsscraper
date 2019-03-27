// Whenever someone clicks a p tag
$(document).on("click", "li", function() {
    // Empty the comments section
     $("#comments").empty();
    // Save the id from the p tag
    var articleID = $(this).attr("id");
    // console.log('id is',thisId);
  
    // Now make an ajax call for the Article
    $.ajax({
       method: "GET",
       url: "/articles/" + articleID
    })
       // With that done, add the note information to the page
       .then((data) => {
         console.log(data);
        $("#comments").append("<p class='mt-3'>" + data.title + "</p>")
        // An input to enter a new title
        $("#comments").append("<input class='m-3' id='titleinput' name='title' placeholder='comment title'>");
        // A textarea to add a new note body
        $("#comments").append("<textarea id='bodyinput' name='body' placeholder='comment'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#comments").append("<button data-id='" + data._id + "' id='savenote'>Save Comment</button>");

        // If there's a note in the article
        if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
 }
       });
});