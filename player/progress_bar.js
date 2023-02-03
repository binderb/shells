window.pauseUI = false;
$('body').append('<div id="progress"><div id="progress_value"></div></div>');
$('#progress_value').on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(e) {
   window.pauseUI = false;
});
/*$('#session_container').append('<a class="std_button" href="" id="increase">Increase</a>');
$('#increase').click( function(e) {
    e.preventDefault();
    $(this).addClass("pop_button");
    if (!window.pauseUI) {
        window.pauseUI = true;
        var currentPercent = Math.round(parseFloat($('#progress_value').css('width')) / parseFloat($('#progress').css('width'))*100);
        var newPercent = (currentPercent + 20 >= 100) ? 100 : currentPercent + 20;
        $('#progress_value').css('width',newPercent + '%');
    }
}).on("animationend", function (e) {
    $(this).removeClass("pop_button");
});*/
