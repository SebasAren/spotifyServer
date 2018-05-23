$(function() {
    $.getJSON('/gettime', function(data) {
        countdown(new Date(data.time));
    });
    $.getJSON('/overview', function(data) {
        drawTable(data);
    });
    $('form').on('submit', function(e) {
        e.preventDefault();
        $.getJSON('/request/?q=' + $('#input').val(), function(data) {
            drawTable(data);
        });
    });
    $('#overview').click(function() {
        $.getJSON('/overview', function(data) {
            drawTable(data);
        });
    });
});

function drawTable(data) {
    var tbl_body = '';
    var odd_even = false;
    $.each(data, function(i, _) {
        var tbl_row = '';
        $.each(this, function(k ,v) {
            if (k == 'URI') return;
            else if (k == 'Duration') return;
            tbl_row += '<td class="song-entry" name="' + i + '">' + v + '</td>';
        });
        tbl_body += '<tr class="' + (odd_even ? 'even' : 'uneven')+'">'+ tbl_row + '</tr>';
        odd_even = !odd_even;
    });
    $('#table').html(tbl_body);
    $('.song-entry').click(function() {
        var dataIndex = $(this).attr('name');
        postRequestSong(data[dataIndex]);
    });
}

function postRequestSong(request) {
    $.post('/post', request, function(response) {
        if (response == 'true') {
            $('#alert-box').removeClass().addClass('alert alert-success')
                .html('Succesfully added your song!');
        }
        else {
            $('#alert-box').removeClass().addClass('alert alert-danger')
                .html('You already submitted');
        }
    });
}

function countdown(startDate) {
    var countDownDate = new Date(startDate).getTime();

    var x = setInterval(function() {

        var now = new Date();
        now.getTime();

        var distance = countDownDate - now;

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        $('#countdown').html(minutes + ' minuten en ' + seconds + ' seconden te gaan.')

    }, 1000);
}
