
var generic_session_controller = {
    
    start_session: function (builder_list,content_list,flags_list) {
        //generic_session_controller.end_session();
        $('body').append('<div id="progress"><div id="progress_value"></div></div>');
        $('#progress_value').css('width',"0%");
        $('#progress').addClass('notransition');
        $('#progress').css({'opacity':'0.0'});
        $('#progress').redraw();
        $('#progress').removeClass('notransition');
        $('#progress').css({'opacity':'1.0'});
        $('body').append('<div id="session_container"></div>');
        $('#session_container').addClass('notransition');
        $('#session_container').css({'opacity':'0.0'});
        $('#session_container').redraw();
        $('#session_container').removeClass('notransition');
        $('#session_container').css({'opacity':'1.0'});
        window.checked = false;
        window.content_list = content_list;
        window.builder_list = builder_list;
        window.flags_list = flags_list;
        window.current_index = 0;
        
        window.builder_list[0](window.content_list[0],window.flags_list[0]);
    },
    
    next_question: function () {
        $('#session_container').html("").off("transitionend");
        $('#session_container').addClass('notransition');
        $('#session_container').css({'transform':'translate(10%,0%)', 'opacity':'0.0'});
        builder_list[window.current_index](window.content_list[window.current_index],window.flags_list[window.current_index]);
        $('#session_container').redraw();
        $('#session_container').removeClass('notransition');
        $('#session_container').css({'transform':'translate(0%,0%)', 'opacity':'1.0'});
        window.checked = false;
    },
    
    end_session: function () {
        $('#session_container').remove();
        $('#progress').remove();
        $('body').append('<div id="session_container"></div>');
        $('#session_container').append('<div id="completed_banner">Session Completed!</div>');
        var medallion_border_color = '#444';
        var current_progress = (window.session_currents[window.session_modules.indexOf(window.current_module)] === null) ? 0 : parseInt(window.session_currents[window.session_modules.indexOf(window.current_module)]);
        var full_mastery = parseInt(window.session_fulls[window.session_modules.indexOf(window.current_module)]);
        if (current_progress + 1 >= full_mastery) {
            console.log(current_progress);
            console.log(full_mastery);
            window.current_module_image = window.current_module_image.split('.png')[0] + '_gold.png';
            medallion_border_color = '#ca7700';
        }
        $('#completed_banner').append('<div id="end_medallion_container" style="display:block;margin:20px;text-align:center;"><img class="end_medallion" style="border-color:'+medallion_border_color+'" src="'+window.current_module_image+'" width="100" height="100"></div>');
        if (window.session_modules.indexOf(window.current_module) > -1) {
            // Show and animate progress bar if module is tracked in database; otherwise, don't do this.
            $('#end_medallion_container').append('<div class="module_mastery"><div class="module_mastery_value"></div></div>');
            var current_percent = current_progress/full_mastery;
            $('.module_mastery_value').addClass('notransition');
            $('.module_mastery_value').css('width', current_percent*100 + '%');
            $('.module_mastery_value').redraw();
            $('.module_mastery_value').removeClass('notransition');
            var new_progress = (current_progress + 1 > full_mastery) ? full_mastery : (current_progress + 1);
            var new_percent = new_progress / full_mastery;
            $('#completed_banner').on("animationend", function(e) {
                $('.module_mastery_value').css('width', new_percent*100 + '%');
            });
        }
        $('#completed_banner').append('<a id="to_menu" class="std_button complete" href="">To Menu</a>');
        $('#to_menu').click( function (e) {
            e.preventDefault();
            $('#session_container').css('opacity','0.0');
            $('#session_container').on("transitionend", function() {
                $(this).remove();
                if (window.session_modules.indexOf(window.current_module) > -1) {
                    // update database, only if module is being tracked.
                    $.post("../common/update_user_progress.php",{"module" : window.current_module, 
                                                                 "progress" : new_progress}, function(response) {
                        if (response == "update_success") {
                            window.session_currents[window.session_modules.indexOf(window.current_module)] = new_progress;
                            session_select_module.display_menu();
                        } else {
                            window.location.replace("/common/auth_response.php?result="+response);
                        }
                    });
                } else {
                    session_select_module.display_menu();
                }
            });
        });
    },
    
    approve: function () {
        var currentPercent = Math.round(parseFloat($('#progress_value').css('width')) / parseFloat($('#progress').css('width'))*100);
        var percent_increment = Math.ceil(100.0 / parseFloat(window.content_list.length)); 
        var newPercent = (currentPercent + percent_increment >= 100) ? 100 : currentPercent + percent_increment;
        $('#progress_value').css('width',newPercent + '%');
        $('#session_container').append('<div id="correct_banner">Correct!</div>');
        $('#correct_banner').on("animationend", function(e) {
            $(this).remove();
            if (window.current_index+1 < window.content_list.length) {
                $('#session_container').css({'opacity':'0.0','transform':'translate(-10%,0%)'});
                $('#session_container').on("transitionend", function(e) {
                    window.current_index++;
                    generic_session_controller.next_question();
                });
            } else {
                $('#session_container').css({'opacity':'0.0'});
                $('#progress').css({'transform':'translate(0%,-10%)','opacity':'0.0'});
                $('#session_container').on("transitionend", function(e) {
                    $(this).remove();
                    generic_session_controller.end_session();
                });
            }
        });
    },
    
    incorrect: function (feedback) {
        $('#session_container').append('<div id="incorrect_banner"><div class="incorrect_cell"><b>Incorrect:</b><br/>'+feedback+'</div><div class="incorrect_cell"><a id="incorrect_move_on" class="std_button" href="">Next</a></div></div>');
        $('#incorrect_move_on').click( function(e) {
            e.preventDefault();
            if (!$(this).hasClass("session_disabled_button")) {
                $(this).addClass("session_disabled_button");
                window.builder_list.push(window.builder_list[window.current_index]);
                window.builder_list.splice(window.current_index,1);
                window.content_list.push(window.content_list[window.current_index]);
                window.content_list.splice(window.current_index,1);
                $('#session_container').css({'opacity':'0.0','transform':'translate(-10%,0%)'});
                $('#session_container').on("transitionend", function(e) {
                    generic_session_controller.next_question();
                });
            }
        });
    },
    
    warn: function (feedback) {
        $('#session_container').append('<div id="warning_banner"><div class="warning_cell">'+feedback+'</div><div class="warning_cell"><a id="warning_move_on" class="std_button" href="">Next</a></div></div>');
        $('#warning_move_on').click( function(e) {
            e.preventDefault();
            if (!$(this).hasClass("session_disabled_button")) {
                $(this).addClass("session_disabled_button");
                window.builder_list.push(window.builder_list[window.current_index]);
                window.builder_list.splice(window.current_index,1);
                window.content_list.push(window.content_list[window.current_index]);
                window.content_list.splice(window.current_index,1);
                $('#session_container').css({'opacity':'0.0','transform':'translate(-10%,0%)'});
                $('#session_container').on("transitionend", function(e) {
                    generic_session_controller.next_question();
                });
            }
        });
    },
    
    show_quit_dialog: function () {
        $('#session_container').append('<div id="quit_dialog"><span style="font-size:20px;"><b>Really Quit?</b></span><br/><br/>You will lose all your progress for this session.<div id="button_block" style="display:block;margin:15px;"><a id="quit_cancel" class="std_button nomen" href="" style="margin-right:10px;width:70px;">No</a><a id="quit_confirm" class="std_button nomen" href="" style="margin-left:10px;width:70px;">Yes</a></div></div>');
        $('#quit_confirm').click( function(e) {
            e.preventDefault();
            if (!$(this).hasClass("session_disabled_button")) {
                $(this).addClass("session_disabled_button");
                $('#session_container').css({'opacity':'0.0'});
                $('#progress').css({'transform':'translate(0%,-10%)','opacity':'0.0'});
                $('#session_container').on("transitionend", function(e) {
                    $(this).remove();
                    $('#progress').remove();
                    session_select_module.display_menu();
                });
            }
        });
        $('#quit_cancel').click( function(e) {
            e.preventDefault();
            if (!$(this).hasClass("session_disabled_button")) {
                $(this).addClass("session_disabled_button");
                $('#quit_dialog').css({'opacity':'0.0','transform':'translate(-50%,-10%)'});
                $('#quit_dialog').on("transitionend", function(e) {
                    $(this).remove();
                    $('#check_button').css('opacity','1.0');
                    $('#quit_button').css('opacity','1.0');
                    window.checked = false;
                });
            }
        });
        
    }
    
    
};

$.fn.redraw = function(){
  $(this).each(function(){
    var redraw = this.offsetHeight;
  });
};