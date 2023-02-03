// ---------------------------------
// Dimensional Analysis Question
// ---------------------------------
function build_dimanalysis (flags) {
	// Empty global variables.
	window.stoich_terms = [];
	window.stoich_flipped = [];
    // create prompt.
    var promptString = 'There are <a class="prompt_link" href="" value="35;mL;1;">35mL</a> of an unknown liquid in a beaker. Determine the <b>density</b> of the liquid if it has a mass of <a class="prompt_link" href="" value="2.54;g;1;">2.54g</a>.';
    $('#session_container').append('<div class="prompt_container nomen">'+promptString+'</div>');
    // create response space.
    $('#session_container').append('<div class="stoich_container"></div>');
	$('.stoich_container').append('<div class="stoich_box"></div>');
	$('#session_container').append('<div class="context_box"></div>');
	display_context('main');
	$('#session_container').append('<a id="quit" class="std_button" style="margin:5px;" href="">Quit</div>');
	$('#session_container').append('<a id="check" class="std_button" style="margin:5px;" href="">Check</div>');
	refresh_stoich_box();
	$('.stoich_box').click( function(e) {
		e.preventDefault();
		$('div[id^="stoichterm"]').removeClass('stoich_selected');
		$('.contextual_container').remove();
	});
	$('body').click( function(e) {
		e.preventDefault();
		$('div[id^="stoichterm"]').removeClass('stoich_selected');
		$('.contextual_container').remove();
	});
	$('.prompt_link').click( function(e) {
		e.preventDefault();
		add_stoich_term($(this).attr('value').split(';'));
	});
	// UI Buttons
	// Flip Button
	
	// Delete Button
	
	// Calculate Button
	
	$('#calculate').click( function(e) {
	    e.preventDefault();
	    e.stopPropagation();
	    $('.stoich_term').removeClass('stoich_selected');
	    $('.contextual_container').remove();
	    $(this).addClass("light_button");
	    if (window.stoich_terms.length == 0) {
	   		show_modal('<span style="font-size:20px;"><b>Nothing to Calculate...</b></span><br/><br/>Add some terms to your equation first.');
	    } else {
	     	$('.stoich_term').css('background-color','transparent');
	    	$('.stoich_term').addClass('fixed_stoich');
	    	$('.stoich_box').addClass('shine_class');
	    	$('.context_box').empty();
	    	$('.context_box').addClass('shine_class');
	    	dimanalysis_calculate();
	    	$('.stoich_box').on('animationend', function(e) {
	    		$('.stoich_box').removeClass('shine_class');
	    		$('.stoich_box').off('animationend');
	    	});
	    	$('.context_box').on('animationend', function(e) {
	    		$('.context_box').removeClass('shine_class');
	    		$('.context_box').off('animationend');
	    	});
	    }
	    refresh_stoich_box();
	}).on("animationend", function (e) {
		$(this).removeClass("light_button");
	});
	$('#quit').click( function(e) {
		e.preventDefault();
		e.stopPropagation();
		generic_session_controller.show_quit_dialog();
	});
	
	$('.stoich_box').sortable({
		placeholder: 'stoich_placeholder',
		forcePlaceholderSize: true,
		cancel: '.stoich_times, .fixed_stoich',
		start: function(e, ui){
			$('.stoich_times').remove();
			$('.stoich_term').removeClass('stoich_selected');
			$('.contextual_container').remove();
		},
		stop: function(e, ui) {
			refresh_stoich_box();
			var from = parseInt(ui.item.attr('id').split('_')[1]);
			$('div[id^="stoichterm"]').each( function(index, element) {
				$(element).attr('id','stoichterm_'+index); 
			});
			var to = parseInt(ui.item.attr('id').split('_')[1]);
			window.stoich_terms.splice(to, 0, window.stoich_terms.splice(from, 1)[0]);
			window.stoich_flipped.splice(to, 0, window.stoich_flipped.splice(from, 1)[0]);
		}
	});
	$('.stoich_box').disableSelection();

	refresh_stoich_box(); 
}

function display_context (context) {
	$('.context_box').empty();
	if (context == 'main') {
		$('.context_box').append('<div id="context_main" style="display:table-cell;text-align:center;vertical-align:middle;"></div>');
		$('#context_main').append('<a id="calculate" class="std_button" style="vertical-align:middle;text-align:center;" href="">Calculate!</div>');
		$('#context_main').append('<a id="tools" class="std_button" style="vertical-align:middle;text-align:center;" href="">Tools</div>');
	} else if (context == 'result') {
		$('.context_box').append('<div id="context_result"></div>');
		$('#context_result').append('<div id="result_box"><div id="result_box_text">'+window.result_value+'</div></div>');
		$('#context_result').append('<div id="result_buttons" style="display:inline-block;"></div>');
		$('#result_buttons').append('<a id="back" class="std_button" href="">Back</a>');
		$('#result_box').addClass('glow_pulse_class');
		$('#result_box').on('animationend', function(e) {
			e.stopPropagation();
			$('#result_box').removeClass('glow_pulse_class');
			$('#result_box').off('animationend');
		});
		$('#result_box_text').addClass('glow_pulse_text_class');
		$('#result_box_text').on('animationend', function(e) {
			e.stopPropagation();
			$('#result_box_text').removeClass('glow_pulse_text_class');
			$('#result_box_text').off('animationend');
		});
	}

}


function dimanalysis_calculate () {
    // Gather the units and values
    var num_vals = [];
    var num_units = [];
    var num_objects = $('.numerator_units');
    var den_vals = [];
    var den_units = [];
    var cancel_list = [];
    window.result_value = 1.0;
    window.result_units = [];
    $('.numerator_value').each( function() { num_vals.push(parseFloat($(this).html())); });
    $('.numerator_units').each( function() { 
        // Put all the non-empty numerator units into the list for now. 
        // We'll remove units later if they cancel.
        if ($(this).html() !== "") num_units.push($(this).html());
    });
    $('.denominator_value').each( function() { den_vals.push($(this).html()); });
    $('.denominator_units').each( function() {
        // Handle cancelling of units and modification of unit lists here.
        var den_units_i = $(this).html();
        if (den_units_i !== "") {
            if (num_units.indexOf(den_units_i) > -1) {
                $(this).addClass('stoich_strikethrough');
                num_objects.filter(':contains("'+den_units_i+'")').not('.stoich_strikethrough').first().addClass('stoich_strikethrough');
                num_units.splice(num_units.indexOf(den_units_i),1);
            } else {
                den_units.push(den_units_i);     
            }
        }
    });
    window.result_value = num_vals.reduce( (a,b) => a * b ) / den_vals.reduce( (a,b) => a * b);
    display_context('result');
    //alert(answer_value);
    
}

function add_stoich_term (term) {
	window.stoich_terms.push(term);
	window.stoich_flipped.push(false);
	 // build stoich term
	$('.stoich_box').append('<div id="stoichterm_new" class="stoich_term"></div>');
	$('#stoichterm_new').append('<div class="stoich_value numerator_value">'+term[0]+'</div>');
	$('#stoichterm_new').append('<div class="stoich_units numerator_units">'+term[1]+'</div>');
	$('#stoichterm_new').append('<div class="stoich_line"></div>');
	$('#stoichterm_new').append('<div class="stoich_value denominator_value">'+term[2]+'</div>');
	$('#stoichterm_new').append('<div class="stoich_units denominator_units">'+term[3]+'</div>');
	$('#stoichterm_new').click( function(e) {
		e.preventDefault();
		e.stopPropagation();
		$('div[id^="stoichterm"]').removeClass('stoich_selected');
		$('.contextual_container').remove();
		if ($(this).hasClass('fixed_stoich')) return;
		$(this).addClass('stoich_selected');
		
	    $(this).append('<div class="contextual_container" style="position:relative;"></div>')
	    $('.contextual_container').append('<a id="flip" class="std_button" style="position:absolute;display:block;left:0px;top:-10px;" href="">Flip</div>');
		$('#flip').css('left',(-1 * $('#flip').width() / 2 + 10) + 'px');
		$('#flip').click( function(e) {
			e.preventDefault();
			e.stopPropagation();
			$(this).addClass("light_button");
			var num_val = $('.stoich_selected').find('.numerator_value').html();
			var num_units = $('.stoich_selected').find('.numerator_units').html();
			var den_val = $('.stoich_selected').find('.denominator_value').html();
			var den_units = $('.stoich_selected').find('.denominator_units').html();
			$('.stoich_selected').find('.numerator_value').html(den_val);
			$('.stoich_selected').find('.numerator_units').html(den_units);
			$('.stoich_selected').find('.denominator_value').html(num_val);
			$('.stoich_selected').find('.denominator_units').html(num_units);
			var term_index = parseInt($('.stoich_selected').attr('id').split('_')[1]);
			window.stoich_flipped[term_index] = !window.stoich_flipped[term_index];
		}).on("animationend", function (e) {
			$(this).removeClass("light_button");
		});
		
		$('.contextual_container').append('<a id="delete" class="std_button" style="position:absolute;display:block;width:10px;height:10px;line-height:10px;left:0px;top:0px;" href="">x</div>');
		$('#delete').css('left',(-1 * $(this).width() + 25)+'px');
		$('#delete').css('top',(-1 * ($(this).height() + 1.5 * $('#delete').height()) - 15)+'px');
		$('#delete').click( function(e) {
			e.preventDefault();
			e.stopPropagation();
			$(this).addClass("light_button");
			var term_index = parseInt($('.stoich_selected').attr('id').split('_')[1]);
			window.stoich_terms.splice(term_index, 1);
			window.stoich_flipped.splice(term_index, 1);
			$('.stoich_selected').remove();
			refresh_stoich_box();
		}).on("animationend", function (e) {
			$(this).removeClass("light_button");
		});
	   
	});
	// Necessary to prevent weird visual glitches when dragging terms
	$('#stoichterm_new').css('width',$('#stoichterm_new').width()+1);
	// Renumber each box in order
	$('div[id^="stoichterm"]').each( function(index, element) {
		$(element).attr('id','stoichterm_'+index); 
	});
	refresh_stoich_box();
}

function show_modal (text) {
	$('#session_container').append('<div id="modal_dialog">'+text+'<div id="button_block" style="display:block;margin:15px;"><a id="modal_confirm" class="std_button nomen" href="" style="margin-right:10px;width:70px;">OK</a></div></div>');
	$('#modal_confirm').click( function(e) {
		e.preventDefault();
		if (!$(this).hasClass("session_disabled_button")) {
			$(this).addClass("session_disabled_button");
			$('#modal_dialog').css({'opacity':'0.0','transform':'translate(-50%,-10%)'});
			$('#modal_dialog').on("transitionend", function(e) {
				$(this).remove();
				//$('#check_button').css('opacity','1.0');
				//$('#quit_button').css('opacity','1.0');
				window.checked = false;
			});
		}
	});
	
}





function refresh_stoich_box () {
	

	// display the initial prompt if we don't have any terms
    if (window.stoich_terms.length == 0) {
    	$('.stoich_initial').remove()
    	$('.stoich_container').append('<div class="stoich_initial"><div class="stoich_initial_text">Compose an equation starting with values above.</div></div>');
    	$('.stoich_box').css('display','block');
    	$('.stoich_box').css('height','0%');
    } else {
    	$('.stoich_initial').remove();
    	$('.stoich_box').css('display','block');
    	$('.stoich_box').css('height','100%');
    	
    }
	
    
    // reset the multiplication symbols
    $('.stoich_times').remove();
    $('.stoich_term + .stoich_term').before($('<div class="stoich_times"><p>⨉</p></div>'));
}

