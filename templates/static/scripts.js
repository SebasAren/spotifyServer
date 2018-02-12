$(function() {
    $('form').on('submit', function(e) {
        e.preventDefault();
        $.getJSON('/request/?q=' + $('#input').val(), function(data) {
            drawTable(data);
        })
    });
    $('#overview').click(function() {
        $.getJSON('/overview', function(data) {
            drawTable(data);
        })
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
        })
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
