<!DOCTYPE html>
<html>
<head>
    <script src="jquery-3.2.1.min.js"></script>

</head>
    <body>
    </body>
</html>
<script>
//Variable is passed to modal
$('#my_modal').on('show.bs.modal', function(e) {
    var review = $(e.relatedTarget).data('review');
    $(e.currentTarget).find('input[name="review"]').val(review);
});

//Now post my form with the following ajax code when Modal Submit button is pressed.
$.post('insert.php', {review: review},
function(data){
    $('#myModal').modal('hide');
    $("#message").html(data);
    $("#message").fadeIn(500); 
    $("#message").fadeOut(2500);
});
</script>