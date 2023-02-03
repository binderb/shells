
// ---------------------------------
// Give Ionic Formula Question
// ---------------------------------
function build_give_ionic_formula (compound,flags) {
    // create prompt.
    var promptString = "Enter the chemical formula for<br/><b>"+compound.name+"</b>.";
    $('#session_container').append('<div class="prompt_container nomen">'+promptString+'</div>');
    // create response space.
    $('#session_container').append('<div class="response_container nomen"></div>');
    $('.response_container').append('<div class="response_init nomen">Compose the correct formula from the pieces below.</div>');
    // create fragment tiles.
    $('#session_container').append('<div class="tiles_container nomen"></div>');
    // choose a set of 7 random elements, including the ones that constitute the solution.
    var all_ions = window.pt.concat(window.polyatomics);
    all_ions = ionic_filter_flags(all_ions,flags);
    var tile_elements = [compound.cation.element_symbol,compound.anion.element_symbol];
    for (var i=0; i<7; i++) {
        var found_flag = false;
        while (found_flag === false) {
            var picked_element = all_ions[getRandomInt(all_ions.length)];
            if (tile_elements.indexOf(picked_element.element_symbol) < 0) {
                tile_elements.push(picked_element.element_symbol);
                found_flag = true;
            }
        }
    }
    shuffle(tile_elements);
    tile_elements.push("1","2","3","4","5","6","7","8","9","0","(",")");
    for (var i=0; i<21; i++) {
        $('.tiles_container').append('<div class="tile active_tile nomen">'+tile_elements[i]+'</div>');
    }
    $('.tile').click( function(e) {
        e.preventDefault();
        if ($(this).hasClass('active_tile') && !window.checked) {
            if ($(this).text() != '(' && $(this).text() != ')') $(this).removeClass('active_tile').addClass('inactive_tile');
            if ($('.response_container').find('.response_init').length) $('.response_container').empty();
            var appendString = '<div class="tile active_tile response_tile_new nomen">'+$(this).html()+'</div>';
            if (parseInt($(this).text()) > -1) appendString = '<div class="tile active_tile response_tile_new nomen"><sub>'+$(this).html()+'</sub></div>';
            $('.response_container').append(appendString);
            $('.response_tile_new').click( function (e) {
                e.preventDefault();
                e.stopPropagation();
                $('.tiles_container').find('.tile:contains("'+$(this).text()+'")').removeClass('inactive_tile').addClass('active_tile');
                $(this).remove();
                if ($('.response_container').find('.tile').length == 0) $('.response_container').append('<div class="response_init nomen">Compose the correct formula from the pieces below.</div>');
            });
            $('.response_tile_new').removeClass('response_tile_new').addClass('response_tile');
        }
    });
    $('.tiles_container').append('<a id="quit_button" class="std_button nomen" href="">Quit</a>');
    $('.tiles_container').append('<a id="check_button" class="std_button nomen" href="">Check</a>');
    $('#check_button').click( function(e) {
        e.preventDefault();
        if (!window.checked) {
            window.checked = true;
            $(this).css('opacity','0.5');
            $('#quit_button').css('opacity','0.5');
            $(this).addClass("light_button");
            // Get formula from blocks
            var formula = "";
            $('.response_tile').each( function(index) { formula += $(this).html();});
            if (compound.ionic_formula == formula) generic_session_controller.approve();
            else generic_session_controller.incorrect(generate_feedback(compound.ionic_formula,"generic"))
        }
    }).on("animationend", function (e) {
        $(this).removeClass("light_button");
    });
    $('#quit_button').click( function(e) {
        e.preventDefault();
        if (!window.checked) {
            window.checked = true;
            $(this).css('opacity','0.5');
            $('#check_button').css('opacity','0.5');
            $(this).addClass("light_button");
            // Show quit dialog
            generic_session_controller.show_quit_dialog();
        }
    }).on("animationend", function (e) {
        $(this).removeClass("light_button");
    });
}

// ---------------------------------
// Give Ionic Name Question
// ---------------------------------
function build_give_ionic_name (compound,flags) {
    // create prompt.
    var promptString = "Enter the ionic compound name for<br/><b>"+compound.ionic_formula+"</b>.";
    $('#session_container').append('<div class="prompt_container nomen">'+promptString+'</div>');
    // create response space.
    $('#session_container').append('<form id="name_form" action=""><input type="text" class="name_input nomen" name="ionic_name"></form>');
    $('.name_input').focus();
    $('#session_container').append('<a id="quit_button" class="std_button nomen" href="">Quit</a>');
    $('#session_container').append('<a id="check_button" class="std_button nomen" href="">Check</a>');
    $('#name_form').submit( function (e) {
        e.preventDefault();
        $('#check_button').click();
    })
    $('#check_button').click( function(e) {
        e.preventDefault();
        if (!window.checked) {
            window.checked = true;
            $(this).css('opacity','0.5');
            $('#quit_button').css('opacity','0.5');
            $(this).addClass("light_button");
            var theName = $('.name_input').val().toLowerCase();
            if (compound.name.toLowerCase().replace(/\s/g,'') == theName.replace(/\s/g,'')) generic_session_controller.approve();
            else if (compound.alternate_name.toLowerCase().replace(/\s/g,'') == theName.replace(/\s/g,'')) generic_session_controller.approve();
            else generic_session_controller.incorrect(generate_feedback({"name" : compound.name, "alternate" : compound.alternate_name},"generic"))
        }
    }).on("animationend", function (e) {
        $(this).removeClass("light_button");
    });
    $('#quit_button').click( function(e) {
        e.preventDefault();
        if (!window.checked) {
            window.checked = true;
            $(this).css('opacity','0.5');
            $('#check_button').css('opacity','0.5');
            $(this).addClass("light_button");
            // Show quit dialog
            generic_session_controller.show_quit_dialog();
        }
    }).on("animationend", function (e) {
        $(this).removeClass("light_button");
    });
}

// ---------------------------------
// Choose Polyatomic Ion Name Multiple Choice Question
// ---------------------------------
function build_give_polyatomic_name_mc (ion,flags) {
    // create prompt.
    var promptString = "Choose the correct name for the ion<br/><b>"+ion.polyatomic_formula+"</b>";
    $('#session_container').append('<div class="prompt_container nomen">'+promptString+'</div>');
    // create choices.
    var choices = [];
    choices.push(ion.name);
    while (choices.length < 4) {
        var new_ion = generate_polyatomic_ion(flags);
        if (choices.indexOf(new_ion.name) < 0) choices.push(new_ion.name);
    }
    shuffle(choices);
    for (var i=0; i<choices.length; i++) {
        $('#session_container').append('<a id="choice_'+i+'" class="mc_button" href="">'+choices[i]+'</a>');
        $('#choice_'+i).click( function(e) {
            e.preventDefault();
            if (!window.checked) {
                window.checked = true;
                if ($(this).text() == ion.name) {
                    $(this).css('background-color','#00a900');
                    generic_session_controller.approve();
                } else {
                    $(this).css('background-color','#9e0000');
                    generic_session_controller.incorrect(generate_feedback(ion.name,"generic"));
                }
            }
        });
    }
    $('#session_container').append('<a id="quit_button" class="std_button nomen" href="">Quit</a>');
    $('#quit_button').click( function(e) {
        e.preventDefault();
        if (!window.checked) {
            window.checked = true;
            $(this).css('opacity','0.5');
            $('#check_button').css('opacity','0.5');
            $(this).addClass("light_button");
            // Show quit dialog
            generic_session_controller.show_quit_dialog();
        }
    }).on("animationend", function (e) {
        $(this).removeClass("light_button");
    });
}

// ---------------------------------
// Give Covalent Name Question
// ---------------------------------
function build_give_covalent_name (compound,flags) {
    // create prompt.
    var promptString = "Enter the name for the covalent compound<br/><b>"+compound.molecular_formula+"</b>.";
    $('#session_container').append('<div class="prompt_container nomen">'+promptString+'</div>');
    // create response space.
    $('#session_container').append('<form id="name_form" action=""><input type="text" class="name_input nomen" name="covalent_name"></form>');
    $('.name_input').focus();
    $('#session_container').append('<a id="quit_button" class="std_button nomen" href="">Quit</a>');
    $('#session_container').append('<a id="check_button" class="std_button nomen" href="">Check</a>');
    $('#name_form').submit( function (e) {
        e.preventDefault();
        $('#check_button').click();
    })
    $('#check_button').click( function(e) {
        e.preventDefault();
        if (!window.checked) {
            window.checked = true;
            $(this).css('opacity','0.5');
            $(this).addClass("light_button");
            var theName = $('.name_input').val().toLowerCase();
            if (compound.name.toLowerCase().replace(/\s/g,'') == theName.replace(/\s/g,'')) generic_session_controller.approve();
            else if (compound.systematic_alternate.toLowerCase().replace(/\s/g,'') == theName.replace(/\s/g,'')) generic_session_controller.warn(generate_warning(compound.name,"covalent_name"));
            else generic_session_controller.incorrect(generate_feedback({"name" : compound.name, "alternate" : compound.systematic_alternate},"generic"));
        }
    }).on("animationend", function (e) {
        $(this).removeClass("light_button");
    });
    $('#quit_button').click( function(e) {
        e.preventDefault();
        if (!window.checked) {
            window.checked = true;
            $(this).css('opacity','0.5');
            $('#check_button').css('opacity','0.5');
            $(this).addClass("light_button");
            // Show quit dialog
            generic_session_controller.show_quit_dialog();
        }
    }).on("animationend", function (e) {
        $(this).removeClass("light_button");
    });
}

// ---------------------------------
// Give Covalent Formula Question
// ---------------------------------
function build_give_covalent_formula (compound,flags) {
    // create prompt.
    var promptString = "Enter the chemical formula for<br/><b>"+compound.name+"</b>.";
    $('#session_container').append('<div class="prompt_container nomen">'+promptString+'</div>');
    // create response space.
    $('#session_container').append('<div class="response_container nomen"></div>');
    $('.response_container').append('<div class="response_init nomen">Compose the correct formula from the pieces below.</div>');
    // create fragment tiles.
    $('#session_container').append('<div class="tiles_container nomen"></div>');
    // choose a set of 7 random elements, including the ones that constitute the solution.
    var all_elements = window.pt;
    var tile_elements = [];
    for (var i=0; i<compound.elements.length; i++) {
        tile_elements.push(compound.elements[i].element_symbol);
    }
    for (var i=0; i<(9-compound.elements.length); i++) {
        var found_flag = false;
        while (found_flag === false) {
            var picked_element = all_elements[getRandomInt(all_elements.length)];
            if (tile_elements.indexOf(picked_element.element_symbol) < 0) {
                tile_elements.push(picked_element.element_symbol);
                found_flag = true;
            }
        }
    }
    shuffle(tile_elements);
    tile_elements.push("1","2","3","4","5","6","7","8","9","0");
    for (var i=0; i<19; i++) {
        $('.tiles_container').append('<div class="tile active_tile nomen">'+tile_elements[i]+'</div>');
    }
    $('.tile').click( function(e) {
        e.preventDefault();
        if ($(this).hasClass('active_tile') && !window.checked) {
            if ($(this).text() != '(' && $(this).text() != ')') $(this).removeClass('active_tile').addClass('inactive_tile');
            if ($('.response_container').find('.response_init').length) $('.response_container').empty();
            var appendString = '<div class="tile active_tile response_tile_new nomen">'+$(this).html()+'</div>';
            if (parseInt($(this).text()) > -1) appendString = '<div class="tile active_tile response_tile_new nomen"><sub>'+$(this).html()+'</sub></div>';
            $('.response_container').append(appendString);
            $('.response_tile_new').click( function (e) {
                e.preventDefault();
                e.stopPropagation();
                $('.tiles_container').find('.tile:contains("'+$(this).text()+'")').removeClass('inactive_tile').addClass('active_tile');
                $(this).remove();
                if ($('.response_container').find('.tile').length == 0) $('.response_container').append('<div class="response_init nomen">Compose the correct formula from the pieces below.</div>');
            });
            $('.response_tile_new').removeClass('response_tile_new').addClass('response_tile');
        }
    });
    $('.tiles_container').append('<a id="quit_button" class="std_button nomen" href="">Quit</a>');
    $('.tiles_container').append('<a id="check_button" class="std_button nomen" href="">Check</a>');
    $('#check_button').click( function(e) {
        e.preventDefault();
        if (!window.checked) {
            window.checked = true;
            $(this).css('opacity','0.5');
            $('#quit_button').css('opacity','0.5');
            $(this).addClass("light_button");
            // Get formula from blocks
            var formula = "";
            $('.response_tile').each( function(index) { formula += $(this).html();});
            if (compound.molecular_formula == formula) generic_session_controller.approve();
            else generic_session_controller.incorrect(generate_feedback(compound.molecular_formula,"generic"))
        }
    }).on("animationend", function (e) {
        $(this).removeClass("light_button");
    });
    $('#quit_button').click( function(e) {
        e.preventDefault();
        if (!window.checked) {
            window.checked = true;
            $(this).css('opacity','0.5');
            $('#check_button').css('opacity','0.5');
            $(this).addClass("light_button");
            // Show quit dialog
            generic_session_controller.show_quit_dialog();
        }
    }).on("animationend", function (e) {
        $(this).removeClass("light_button");
    });
}

// ---------------------------------
// Choose Ionic or Covalent Question
// ---------------------------------
function build_give_ionic_or_covalent_mc (compound,flags) {
    // create prompt.
    // need to figure out whether we have an ionic or covalent compound before writing prompt.
    var theFormula = "";
    var theAnswer = "";
    if (compound.hasOwnProperty('ionic_formula')) {
        theFormula = compound.ionic_formula;
        theAnswer = "Ionic";
    } else if (compound.hasOwnProperty('molecular_formula')) {
        theFormula = compound.molecular_formula;
        theAnswer = "Covalent";
    }
    var promptString = "Choose whether the compound below is ionic or covalent?<br/><b>"+theFormula+"</b>";
    $('#session_container').append('<div class="prompt_container nomen">'+promptString+'</div>');
    // create choices.
    var choices = ["Ionic","Covalent"];
    for (var i=0; i<choices.length; i++) {
        $('#session_container').append('<a id="choice_'+i+'" class="mc_button" href="">'+choices[i]+'</a>');
        $('#choice_'+i).click( function(e) {
            e.preventDefault();
            if (!window.checked) {
                window.checked = true;
                if ($(this).text() == theAnswer) {
                    $(this).css('background-color','#00a900');
                    generic_session_controller.approve();
                } else {
                    $(this).css('background-color','#9e0000');
                    generic_session_controller.incorrect(generate_feedback(theAnswer,"ionic_or_covalent"));
                }
            }
        });
    }
    $('#session_container').append('<a id="quit_button" class="std_button nomen" href="">Quit</a>');
    $('#quit_button').click( function(e) {
        e.preventDefault();
        if (!window.checked) {
            window.checked = true;
            $(this).css('opacity','0.5');
            $('#check_button').css('opacity','0.5');
            $(this).addClass("light_button");
            // Show quit dialog
            generic_session_controller.show_quit_dialog();
        }
    }).on("animationend", function (e) {
        $(this).removeClass("light_button");
    });
}

function generate_feedback (answer,context) {
    var s = "";
    if (context == "generic") {
        if (answer.name != null) {
            console.log("found ionic answer!");
            // dealing with a question where the user typed in a name (might have an alternate option).
            if (answer.name != answer.alternate) {
                s = 'The correct answer was <b>' + answer.name + '</b>.<br/>(<b>'+answer.alternate+'</b> also works here.)';
            } else {
                s = 'The correct answer was <b>' + answer.name + '</b>.';
            }
        } else {
            console.log("found a single string answer.");
            // dealing with a single-string answer.
            s = 'The correct answer was <b>' + answer + '</b>.';
        }
    } else if (context == "ionic_or_covalent") {
        if (answer == "Covalent") s = "Remember, ionic compounds must contain either a metal cation or a polyatomic cation (like ammonium).";
        else s = "Remember, covalent compounds generally occur between nonmetals; you also need to be careful about spotting polyatomic ions!";
    }
    return s;
}

function generate_warning (answer,context) {
    if (context == "covalent_name") {
        var s = 'This answer is the correct systematic name, but this compound is always called <b>' + answer + '</b>.';
    }
    return s;
}

// ---------------------------------
// Generate Ionic Compound
// ---------------------------------
function generate_ionic_compound(flags) {
    var name = "";
    // Join the periodic table and polyatomic ion lists
    var all_ions = window.pt.concat(window.polyatomics);
    // Filter this large list based on flags
    all_ions = ionic_filter_flags(all_ions,flags);
    // AND... for now, remove hydrogen as an option
    all_ions = all_ions.filter(element => (!(element.element_name == "hydrogen")));
    // AND AND... for now, remove beryllium as an option
    all_ions = all_ions.filter(element => (!(element.element_name == "beryllium")));
    // Get arrays of ions.
    var cation_array = all_ions.filter(element => (element.ions !== "" && JSON.parse(element.ions).some(ion_i => ion_i > 0)));
    var anion_array = all_ions.filter(element => (element.ions !== "" && JSON.parse(element.ions).some(ion_i => ion_i < 0)));
    // Pick a cation.
    var myCation = cation_array[getRandomInt(cation_array.length)];
    // Filter the anion list so that we're only choosing something with an appropriate difference in electronegativity.
    var filtered_anions = anion_array.filter(element => (!element.hasOwnProperty('electronegativity') || (Math.abs(element.electronegativity - myCation.electronegativity) > 1.0)));
    // Filter out polyatomics with hydrogen if hydrogen was chosen as the cation.
    if (myCation.element_name == "hydrogen") filtered_anions = filtered_anions.filter(element => (!element.hasOwnProperty('polyatomic')));
    var myAnion = filtered_anions[getRandomInt(filtered_anions.length)];
    // If chosen cation can have multiple charges, choose one.
    var cation_positive_charges = JSON.parse(myCation.ions).filter(ion_i => ion_i > 0);
    var cation_charge = cation_positive_charges[0];
    var roman_numeral = "";
    if (cation_positive_charges.length > 1 || (flags.indexOf("PROVIDE_D_BLOCK_ROMAN") > -1 && (myCation.element_group > 2 && myCation.element_group < 13)) || (flags.indexOf("PROVIDE_POST_TRANSITION_ROMAN") > -1 && (myCation.element_group >= 13))) {
        cation_charge = JSON.parse(myCation.ions)[getRandomInt(JSON.parse(myCation.ions).length)];
        roman_numeral = "(" + arabic_to_roman(cation_charge) + ")";
    }
    var anion_charge = JSON.parse(myAnion.ions)[0];
    // Assemble the name of the compound.
    if (roman_numeral !== "") name = myCation.element_name + roman_numeral + " " + myAnion.element_anion_name;
    else name = myCation.element_name + " " + myAnion.element_anion_name;
    // Provide an alternate name if applicable. 
    // Right now this is only implemented so we can accept answers with missing roman numerals 
    // for transition/post-transition metals with only one common oxidation state.
    var alternate_name = name;
    if (roman_numeral != "" && cation_positive_charges.length == 1) alternate_name = myCation.element_name + " " + myAnion.element_anion_name;
    
    // Determine the appropriate ionic formula.
    var lcm_charges = lcm_two_numbers(Math.abs(cation_charge),Math.abs(anion_charge));
    var cation_factor = lcm_charges / Math.abs(cation_charge);
    var anion_factor = lcm_charges / Math.abs(anion_charge);
    var reduced_factors = reduce(cation_factor,anion_factor);
    var cation_sub = (reduced_factors[0] == 1) ? '' : '<sub>'+reduced_factors[0]+'</sub>';
    var anion_sub = (reduced_factors[1] == 1) ? '' : '<sub>'+reduced_factors[1]+'</sub>';
    var cation_symbol = myCation.element_symbol;
    var anion_symbol = myAnion.element_symbol;
    if (myCation.hasOwnProperty('polyatomic') && cation_sub !== '' ) cation_symbol = '(' + myCation.element_symbol + ')';
    if (myAnion.hasOwnProperty('polyatomic') && anion_sub !== '' ) anion_symbol = '(' + myAnion.element_symbol + ')';
    var ionic_formula = cation_symbol + cation_sub + anion_symbol + anion_sub;
    return {"name" : name, "alternate_name" : alternate_name, "ionic_formula" : ionic_formula, "cation" : myCation, "cation_sub" : cation_sub, "anion" : myAnion, "anion_sub" : anion_sub};
    
}

// ---------------------------------
// Generate Covalent Compound
// ---------------------------------
function generate_covalent_compound(flags) {
    // Get eligible nonmetals
    var nonmetals = ["H","B","C","N","O","F","Si","P","S","Cl","Se","Br","Kr","I","Xe"];
    var nonmetal_array = window.pt.filter(element => nonmetals.indexOf(element.element_symbol) > -1);
    // Pick a nonmetal from the list at random
    var myCenter = nonmetal_array[getRandomInt(nonmetal_array.length)];
    //myCenter = nonmetal_array[4];
    // Find a terminal atom to pair with. 
    // Need to choose from a reduced list of options here; can't pick something
    // that won't fill its octet without bonding to more than one atom.
    var terminal_array = nonmetal_array.filter(element => element.electronegativity >= myCenter.electronegativity && element.element_group >= 15 && element.element_group < 18);
    // Remove a few more atoms, problematic as terminal groups because the
    // compounds involving them don't actually exist
    terminal_array = terminal_array.filter(element => ["P","Se"].indexOf(element.element_symbol) == -1);
    // ...and finally, severely restrict the options for terminal atoms if the
    // center is a noble gas.
    if (myCenter.element_group == 18) terminal_array = terminal_array.filter(element => element.element_group == 17);
    // Add hydrogen back in.
    terminal_array.push(window.pt[0]);
    //terminal_array = terminal_array.filter(element => element.element_symbol == "H");
    
    found_acceptable_pairing = false;
    while (!found_acceptable_pairing) {
        var myTerminal = terminal_array[getRandomInt(terminal_array.length)];
    
        // Start working on the appropriate ratio of atoms, by determining max bonds to central atom.
        var max_bonds_to_center = 0;
        // Check first if the central element is in the second period (i.e. must obey strict octet rule).
        if (myCenter.atomic_number == 1) max_bonds_to_center = 1;
        else if (myCenter.atomic_number > 2 && myCenter.atomic_number < 10) {
            // If the element is in the second period, restrict bonds to (missing valence + 1) so we end up
            // with only neutral atoms and +1 cations.
            var max_bonds_to_center = 8 - get_valence_electrons(myCenter) + 1;
            if (max_bonds_to_center > 4) max_bonds_to_center = 4;
            // If the element is Be or B, restrict further
            if (myCenter.element_symbol == "Be") max_bonds_to_center= 2;
            if (myCenter.element_symbol == "B") max_bonds_to_center = 3;
        // Otherwise, if the element is heavier than the second period, allow up to 6 groups.
        } else if (myCenter.atomic_number > 10) { 
            if (myCenter.element_symbol == myTerminal.element_symbol) {
                max_bonds_to_center = 2;
            } else {
                max_bonds_to_center = 6;
            }
        }
        // If the terminal atom is a hydrogen and the center is a halogen, limit to 1.
        if (myCenter.element_group == 17 && myTerminal.element_symbol == "H") max_bonds_to_center = 1;
    
        // Set minimum bonded groups as well for some second-period elements.
        var min_bonds_to_center = 1;
        if (myCenter.element_symbol == "Be") min_bonds_to_center = 2;
        if (myCenter.element_symbol == "B") min_bonds_to_center = 3;
        if (myCenter.element_symbol == "C") min_bonds_to_center = 2;
    
    
        // Pick a random number of bonded groups within the appropriate range.
        var bond_number = getRandomInt(max_bonds_to_center+1 - min_bonds_to_center) + min_bonds_to_center;
        var bonded_groups = [];
        for (var i=0; i<bond_number; i++) bonded_groups.push(myTerminal);
        // Now, count total valence electrons.
        var total_valence = get_valence_electrons(myCenter) + (bond_number * get_valence_electrons(myTerminal));
        var total_electrons = total_valence;
        // If total valence is odd and we're in the nitrogen group specifically, we can offer the option of subtracting one to make a +1 cation.
        if (myCenter.element_group == 15) {
            total_electrons = total_electrons - 1;
        }
    
        // Now simulate the LDS drawing procedure and subtraction strategy.
        var remaining_electrons = total_electrons;
        // Draw single bonds to terminal atoms.
        remaining_electrons -= 2 * bond_number;
        // Add lone pairs to terminal atoms until each is satisfied.
        var needed_terminal_LPs = 0;
        for (var i=0;i<bonded_groups.length;i++) if (bonded_groups[i].element_symbol != "H") needed_terminal_LPs += 6;
        remaining_electrons -= needed_terminal_LPs;
        if (remaining_electrons < 0) {
            total_electrons += -remaining_electrons;
            remaining_electrons = 0;
        }
        // Now assess the central atom.
        var needed_center_electrons = 8 - 2*bond_number - remaining_electrons;
        if (myCenter.element_symbol == "H") needed_center_electrons = 2 - 2*bond_number - remaining_electrons;
        if (myCenter.element_symbol == "Be") needed_center_electrons = 4 - 2*bond_number - remaining_electrons;
        if (myCenter.element_symbol == "B") needed_center_electrons = 6 - 2*bond_number - remaining_electrons;
    
        // If we ended up with a negative number in that calculation, we have more than enough electrons to complete
        // an octet. That's fine if the element is in Period 3 or below, otherwise have to remove the leftovers.
        if (needed_center_electrons < 0 && myCenter.atomic_number < 10) total_electrons += needed_center_electrons;
        else if (needed_center_electrons > 0) {
            // We can take up to 4 electrons from each terminal atom that isn't hydrogen (for double/triple bonds),
            // but if that still isn't enough, we have to add electrons to the structure.
            //
            // The issue here is that we don't have anything built in to assess formal charges... and there really
            // isn't a firm rule on what passes for acceptable anyway. For now, I think it's safe to say that
            // no compound in the set we've built should ever be drawn with a double bond or more to a halogen.
            var available_for_bonding = 0;
            for (var i=0;i<bonded_groups.length;i++) if (bonded_groups[i].element_symbol != "H" && bonded_groups[i].element_group != 17) available_for_bonding += 4;
            if (needed_center_electrons - available_for_bonding > 0) total_electrons += (needed_center_electrons - available_for_bonding);
        }
        // Finally after all that, add an electron if we ended up with an odd number
        var total_electrons = (total_electrons % 2 == 0) ? total_electrons : total_electrons+1;
    
        var total_charge = total_valence - total_electrons;
        // After all is said and done, just verify that the charge isn't out of control. Needs to be in the range of -2 to +1, with -3 only allowed if oxygen is terminal.
        // If that isn't the case, redo this whole portion.
        if (total_charge >= -2 && total_charge <= 1) found_acceptable_pairing = true;
        else if (total_charge == -3 && myTerminal.element_symbol == "O") found_acceptable_pairing = true;
    
        // Now, need to clean up the formula. And... this follows a bunch of weird conventions, so here we go.
        // First, need to make a list of atoms involved.
        var all_elements = [];
        var all_subscripts = [];
        if (myCenter.element_symbol == myTerminal.element_symbol) {
            // If the center and terminal atoms are the same, we have a diatomic molecule.
            all_elements.push(myCenter);
            all_subscripts.push(bond_number + 1);
        } else {
            // Otherwise, determine if rearrangement needs to happen based on conventions for hydrogen.
            if (myTerminal.element_symbol == "H") {
                if (myCenter.element_group == 17 || (myCenter.element_group == 16 && !(myCenter.element_symbol == "O" && total_charge == "-1"))) {
                    all_elements.push(myTerminal,myCenter);
                    all_subscripts.push(bond_number,1);
                } else {
                    all_elements.push(myCenter,myTerminal);
                    all_subscripts.push(1, bond_number);
                }
            } else if (myCenter.element_symbol == "H") {
                if (myTerminal.element_symbol == "O" && total_charge == -1) {
                    all_elements.push(myTerminal,myCenter);
                    all_subscripts.push(bond_number,1);
                } else if (myTerminal.element_symbol == "N") {
                    all_elements.push(myTerminal,myCenter);
                    all_subscripts.push(bond_number,1);
                } else {
                    all_elements.push(myCenter,myTerminal);
                    all_subscripts.push(1, bond_number);
                }
            // Also rearrange if it came out that the terminal atom is less electronegative, unless it's oxygen (or hydrogen but that's already taken care of).
            } else if (myCenter.electronegativity > myTerminal.electronegativity ) {
                all_elements.push(myTerminal,myCenter);
                all_subscripts.push(bond_number,1);
            } else {
                all_elements.push(myCenter,myTerminal);
                all_subscripts.push(1, bond_number);
            }
        }
        
        // To avoid a perponderance of weird organic ions, preclude having any charges on carbon centers unless they're oxides.
        if ((all_elements[0].element_symbol == "C") && total_charge != 0 && all_elements.filter(element => element.element_symbol == "O").length == 0) found_acceptable_pairing = false;
        
        // Final checks based on flags
        if (flags.indexOf("NEUTRAL_ONLY") > -1 && total_charge != 0) found_acceptable_pairing = false;
    }
    
    // Assemble a formula and name based on what we've found.
    var formula = "";
    for (var i=0; i<all_elements.length; i++) {
        formula += all_elements[i].element_symbol;
        if (all_subscripts[i] > 1) formula += '<sub>'+all_subscripts[i]+'</sub>';
    }
    
    // Now, assemble a systematic name.
    var name = "";
    for (var i=0; i<all_elements.length; i++) {
        if (i != 0) name += " ";
        if (all_subscripts[i] == 1 && i == 0) name += all_elements[i].element_name;
        else if (all_subscripts[i] > 1 && i == 0) name += get_numerical_prefix(all_elements[i].element_name,all_subscripts[i]) + all_elements[i].element_name;
        else if (i > 0) name += get_numerical_prefix(all_elements[i].element_name,all_subscripts[i]) + all_elements[i].element_anion_name;
    }
    
    // Add the common name if there is one.
    var systematic_alternate = name;
    if (window.common_covalents.filter(compound => compound.systematic_name == name).length > 0) {
        systematic_alternate = name;
        name = window.common_covalents.filter(compound => compound.systematic_name == name)[0].common_name;
    }
    
    
    var total_charge_notation = "";
    if (Math.abs(total_charge) > 1) total_charge_notation += Math.abs(total_charge);
    if (total_charge > 0) total_charge_notation += "+";
    else if (total_charge < 0) total_charge_notation += "–";
    var molecular_formula = formula; 
    if (total_charge_notation != "") molecular_formula += '<sup>'+total_charge_notation+'</sup>';
    //molecular_formula = formula + '<sup>'+total_charge_notation+'</sup>' + "<br/>"+myCenter.element_symbol+"<br/>"+myTerminal.element_symbol+"<br/>Max bonds to center: "+max_bonds_to_center+"<br/>Needed terminal LPs: "+needed_terminal_LPs + "<br/>Total valence: "+total_valence+"<br/>Total electrons: "+total_electrons +"<br/>Total charge: "+total_charge + "<br/>Remaining electrons: "+remaining_electrons+"<br/>"+name;

    //return {"name" : "ammonia", "systematic_alternate" : "nitrogen trihydride", "molecular_formula" : 'NH<sub>3</sub>', "elements" : all_elements};
    return {"name" : name, "systematic_alternate" : systematic_alternate, "molecular_formula" : molecular_formula, "elements" : all_elements};
}

// ---------------------------------
// Generate Organic Covalent Compound
// ---------------------------------
function generate_organic_compound(flags) {
    // Get eligible nonmetals
    var nonmetals = ["H","Be","B","C","N","O","F","Si","P","S","Cl","Se","Br","Kr","I","Xe"];
    var nonmetal_array = window.pt.filter(element => nonmetals.indexOf(element.element_symbol) > -1);
    // Pick a nonmetal from the list at random
    var myCenter = nonmetal_array[getRandomInt(nonmetal_array.length)];
    //myCenter = nonmetal_array[4];
    // Find a terminal atom to pair with. 
    // Need to choose from a reduced list of options here; can't pick something
    // that won't fill its octet without bonding to more than one atom.
    var terminal_array = nonmetal_array.filter(element => element.electronegativity >= myCenter.electronegativity && element.element_group >= 15 && element.element_group < 18);
    // Remove a few more atoms, problematic as terminal groups because the
    // compounds involving them don't actually exist
    terminal_array = terminal_array.filter(element => ["P","Se"].indexOf(element.element_symbol) == -1);
    // ...and finally, severely restrict the options for terminal atoms if the
    // center is a noble gas.
    if (myCenter.element_group == 18) terminal_array = terminal_array.filter(element => element.element_group == 17);
    // Add hydrogen back in.
    terminal_array.push(window.pt[0]);
    //terminal_array = terminal_array.filter(element => element.element_symbol == "H");
    
    found_acceptable_pairing = false;
    while (!found_acceptable_pairing) {
        var myTerminal = terminal_array[getRandomInt(terminal_array.length)];
    
        // Start working on the appropriate ratio of atoms, by determining max bonds to central atom.
        var max_bonds_to_center = 0;
        // Check first if the central element is in the second period (i.e. must obey strict octet rule).
        if (myCenter.atomic_number == 1) max_bonds_to_center = 1;
        else if (myCenter.atomic_number > 2 && myCenter.atomic_number < 10) {
            // If the element is in the second period, restrict bonds to (missing valence + 1) so we end up
            // with only neutral atoms and +1 cations.
            var max_bonds_to_center = 8 - get_valence_electrons(myCenter) + 1;
            if (max_bonds_to_center > 4) max_bonds_to_center = 4;
            // If the element is Be or B, restrict further
            if (myCenter.element_symbol == "Be") max_bonds_to_center= 2;
            if (myCenter.element_symbol == "B") max_bonds_to_center = 3;
        // Otherwise, if the element is heavier than the second period, allow up to 6 groups.
        } else if (myCenter.atomic_number > 10) { 
            if (myCenter.element_symbol == myTerminal.element_symbol) {
                max_bonds_to_center = 2;
            } else {
                max_bonds_to_center = 6;
            }
        }
        // If the terminal atom is a hydrogen and the center is a halogen, limit to 1.
        if (myCenter.element_group == 17 && myTerminal.element_symbol == "H") max_bonds_to_center = 1;
    
        // Set minimum bonded groups as well for some second-period elements.
        var min_bonds_to_center = 1;
        if (myCenter.element_symbol == "Be") min_bonds_to_center = 2;
        if (myCenter.element_symbol == "B") min_bonds_to_center = 3;
        if (myCenter.element_symbol == "C") min_bonds_to_center = 2;
    
    
        // Pick a random number of bonded groups within the appropriate range.
        var bond_number = getRandomInt(max_bonds_to_center+1 - min_bonds_to_center) + min_bonds_to_center;
        var bonded_groups = [];
        for (var i=0; i<bond_number; i++) bonded_groups.push(myTerminal);
        // Now, count total valence electrons.
        var total_valence = get_valence_electrons(myCenter) + (bond_number * get_valence_electrons(myTerminal));
        var total_electrons = total_valence;
        // If total valence is odd and we're in the nitrogen group specifically, we can offer the option of subtracting one to make a +1 cation.
        if (myCenter.element_group == 15) {
            total_electrons = total_electrons - 1;
        }
    
        // Now simulate the LDS drawing procedure and subtraction strategy.
        var remaining_electrons = total_electrons;
        // Draw single bonds to terminal atoms.
        remaining_electrons -= 2 * bond_number;
        // Add lone pairs to terminal atoms until each is satisfied.
        var needed_terminal_LPs = 0;
        for (var i=0;i<bonded_groups.length;i++) if (bonded_groups[i].element_symbol != "H") needed_terminal_LPs += 6;
        remaining_electrons -= needed_terminal_LPs;
        if (remaining_electrons < 0) {
            total_electrons += -remaining_electrons;
            remaining_electrons = 0;
        }
        // Now assess the central atom.
        var needed_center_electrons = 8 - 2*bond_number - remaining_electrons;
        if (myCenter.element_symbol == "H") needed_center_electrons = 2 - 2*bond_number - remaining_electrons;
        if (myCenter.element_symbol == "Be") needed_center_electrons = 4 - 2*bond_number - remaining_electrons;
        if (myCenter.element_symbol == "B") needed_center_electrons = 6 - 2*bond_number - remaining_electrons;
    
        // If we ended up with a negative number in that calculation, we have more than enough electrons to complete
        // an octet. That's fine if the element is in Period 3 or below, otherwise have to remove the leftovers.
        if (needed_center_electrons < 0 && myCenter.atomic_number < 10) total_electrons += needed_center_electrons;
        else if (needed_center_electrons > 0) {
            // We can take up to 4 electrons from each terminal atom that isn't hydrogen (for double/triple bonds),
            // but if that still isn't enough, we have to add electrons to the structure.
            //
            // The issue here is that we don't have anything built in to assess formal charges... and there really
            // isn't a firm rule on what passes for acceptable anyway. For now, I think it's safe to say that
            // no compound in the set we've built should ever be drawn with a double bond or more to a halogen.
            var available_for_bonding = 0;
            for (var i=0;i<bonded_groups.length;i++) if (bonded_groups[i].element_symbol != "H" && bonded_groups[i].element_group != 17) available_for_bonding += 4;
            if (needed_center_electrons - available_for_bonding > 0) total_electrons += (needed_center_electrons - available_for_bonding);
        }
        // Finally after all that, add an electron if we ended up with an odd number
        var total_electrons = (total_electrons % 2 == 0) ? total_electrons : total_electrons+1;
    
        var total_charge = total_valence - total_electrons;
        // After all is said and done, just verify that the charge isn't out of control. Needs to be in the range of -2 to +1, with -3 only allowed if oxygen is terminal.
        // If that isn't the case, redo this whole portion.
        if (total_charge >= -2 && total_charge <= 1) found_acceptable_pairing = true;
        else if (total_charge == -3 && myTerminal.element_symbol == "O") found_acceptable_pairing = true;
    
        // Now, need to clean up the formula. And... this follows a bunch of weird conventions, so here we go.
        // First, need to make a list of atoms involved.
        var all_elements = [];
        var all_subscripts = [];
        if (myCenter.element_symbol == myTerminal.element_symbol) {
            // If the center and terminal atoms are the same, we have a diatomic molecule.
            all_elements.push(myCenter);
            all_subscripts.push(bond_number + 1);
        } else {
            // Otherwise, determine if rearrangement needs to happen based on conventions for hydrogen.
            if (myTerminal.element_symbol == "H") {
                if (myCenter.element_group == 17 || (myCenter.element_group == 16 && !(myCenter.element_symbol == "O" && total_charge == "-1"))) {
                    all_elements.push(myTerminal,myCenter);
                    all_subscripts.push(bond_number,1);
                } else {
                    all_elements.push(myCenter,myTerminal);
                    all_subscripts.push(1, bond_number);
                }
            } else if (myCenter.element_symbol == "H") {
                if (myTerminal.element_symbol == "O" && total_charge == -1) {
                    all_elements.push(myTerminal,myCenter);
                    all_subscripts.push(bond_number,1);
                } else if (myTerminal.element_symbol == "N") {
                    all_elements.push(myTerminal,myCenter);
                    all_subscripts.push(bond_number,1);
                } else {
                    all_elements.push(myCenter,myTerminal);
                    all_subscripts.push(1, bond_number);
                }
            // Also rearrange if it came out that the terminal atom is less electronegative, unless it's oxygen (or hydrogen but that's already taken care of).
            } else if (myCenter.electronegativity > myTerminal.electronegativity ) {
                all_elements.push(myTerminal,myCenter);
                all_subscripts.push(bond_number,1);
            } else {
                all_elements.push(myCenter,myTerminal);
                all_subscripts.push(1, bond_number);
            }
        }
        
        // To avoid a perponderance of weird organic ions, preclude having any charges on carbon centers unless they're oxides.
        if ((all_elements[0].element_symbol == "C") && total_charge != 0 && all_elements.filter(element => element.element_symbol == "O").length == 0) found_acceptable_pairing = false;
        
        // Final checks based on flags
        if (flags.indexOf("NEUTRAL_ONLY") > -1 && total_charge != 0) found_acceptable_pairing = false;
    }
    
    // Assemble a formula and name based on what we've found.
    var formula = "";
    for (var i=0; i<all_elements.length; i++) {
        formula += all_elements[i].element_symbol;
        if (all_subscripts[i] > 1) formula += '<sub>'+all_subscripts[i]+'</sub>';
    }
    
    // Now, assemble a systematic name.
    var name = "";
    for (var i=0; i<all_elements.length; i++) {
        if (i != 0) name += " ";
        if (all_subscripts[i] == 1 && i == 0) name += all_elements[i].element_name;
        else if (all_subscripts[i] > 1 && i == 0) name += get_numerical_prefix(all_elements[i].element_name,all_subscripts[i]) + all_elements[i].element_name;
        else if (i > 0) name += get_numerical_prefix(all_elements[i].element_name,all_subscripts[i]) + all_elements[i].element_anion_name;
    }
    
    // Add the common name if there is one.
    var systematic_alternate = "";
    if (window.common_covalents.filter(compound => compound.systematic_name == name).length > 0) {
        systematic_alternate = name;
        name = window.common_covalents.filter(compound => compound.systematic_name == name)[0].common_name;
    }
    
    
    var total_charge_notation = "";
    if (Math.abs(total_charge) > 1) total_charge_notation += Math.abs(total_charge);
    if (total_charge > 0) total_charge_notation += "+";
    else if (total_charge < 0) total_charge_notation += "–";
    var molecular_formula = formula; 
    if (total_charge_notation != "") molecular_formula += '<sup>'+total_charge_notation+'</sup>';
    //molecular_formula = formula + '<sup>'+total_charge_notation+'</sup>' + "<br/>"+myCenter.element_symbol+"<br/>"+myTerminal.element_symbol+"<br/>Max bonds to center: "+max_bonds_to_center+"<br/>Needed terminal LPs: "+needed_terminal_LPs + "<br/>Total valence: "+total_valence+"<br/>Total electrons: "+total_electrons +"<br/>Total charge: "+total_charge + "<br/>Remaining electrons: "+remaining_electrons+"<br/>"+name;

    //return {"name" : "ammonia", "systematic_alternate" : "nitrogen trihydride", "molecular_formula" : 'NH<sub>3</sub>', "elements" : all_elements};
    return {"name" : name, "systematic_alternate" : systematic_alternate, "molecular_formula" : molecular_formula, "elements" : all_elements};
}

// ---------------------------------
// Generate Polyatomic Ion
// ---------------------------------
function generate_polyatomic_ion(flags) {
    var name = "";
    // load the polyatomic ion list
    var all_polyatomics = window.polyatomics;
    // Filter this large list based on flags
    polyatomic_array = polyatomic_filter_flags(all_polyatomics,flags);
    // Pick a polyatomic.
    var myPolyatomic = polyatomic_array[getRandomInt(polyatomic_array.length)];
    // Get the charge on the polyatomic.
    var polyatomic_charge = JSON.parse(myPolyatomic.ions)[0];
    if (polyatomic_charge == "-1") polyatomic_charge = "–";
    else if (parseInt(polyatomic_charge) < -1) polyatomic_charge = Math.abs(parseInt(polyatomic_charge)) + '–'; 
    else if (polyatomic_charge == "1") polyatomic_charge = "+";
    else if (parseInt(polyatomic_charge) > 1) polyatomic_charge = polyatomic_charge + '+';
    // Get the name of the polyatomic.
    if (myPolyatomic.hasOwnProperty('element_name')) name = myPolyatomic.element_name;
    else name = myPolyatomic.element_anion_name;
    // Determine the appropriate formula.
    var polyatomic_formula = myPolyatomic.element_symbol + '<sup>' + polyatomic_charge + '</sup>';
    return {"name" : name, "polyatomic_formula" : polyatomic_formula, "ion" : myPolyatomic};
    
}

function ionic_filter_flags(ion_array, flags) {
    var ions = ion_array;
    if (flags.indexOf("CUTOFF_ARGON") > -1) {
        ions = ions.filter(i => (!i.hasOwnProperty('atomic_number') || (i.atomic_number <= 18)));
    }
    if (flags.indexOf("CUTOFF_KRYPTON") > -1) {
        ions = ions.filter(i => (!i.hasOwnProperty('atomic_number') || (i.atomic_number <= 36)));
    }
    if (flags.indexOf("CUTOFF_XENON") > -1) {
        ions = ions.filter(i => (!i.hasOwnProperty('atomic_number') || (i.atomic_number <= 54)));
    }
    if (flags.indexOf("NO_POLYATOMICS") > -1) {
        ions = ions.filter(i => (!i.hasOwnProperty('polyatomic')));
    }
    
    return ions;
}

function polyatomic_filter_flags(ion_array, flags) {
    var ions = ion_array;
    if (flags.indexOf("STARTER_SET_ONLY") > -1) {
        var starters = ["hydroxide","ammonium","cyanide","carbonate","nitrate","phosphate","sulfate","chlorate"];
        ions = ions.filter(i => (starters.indexOf(i.element_name) > -1 || starters.indexOf(i.element_anion_name) > -1 ));
    }
    return ions;
}

function get_valence_electrons (myElement) {
    var valence = 0;
    if (myElement.element_symbol == "H") valence = 1;
    else if (myElement.element_group < 3) valence = myElement.element_group;
    else if (myElement.element_group >= 3 && myElement.element_group < 13) valence = 2;
    else if (myElement.element_group >= 13) valence = myElement.element_group - 10;
    return valence;
}

function arabic_to_roman (arabic) {
    var roman = "";
    switch (arabic) {
    case 1:
        roman = "I";
        break;
    case 2:
        roman = "II";
        break;
    case 3: 
        roman = "III";
        break;
    case 4:
        roman = "IV";
        break;
    case 5:
        roman = "V";
        break;
    case 6:
        roman = "VI";
        break;
    case 7:
        roman = "VII";
        break;
    case 8:
        roman = "VIII";
        break;
    case 9:
        roman = "IX";
        break;
    case 10:
        roman = "X";
        break;
    }
    return roman;
}

function get_numerical_prefix(myRoot, arabic) {
    var prefix = "";
    switch (arabic) {
    case 1:
        prefix = "mono";
        break;
    case 2:
        prefix = "di";
        break;
    case 3: 
        prefix = "tri";
        break;
    case 4:
        prefix = "tetra";
        break;
    case 5:
        prefix = "penta";
        break;
    case 6:
        prefix = "hexa";
        break;
    case 7:
        prefix = "hepta";
        break;
    case 8:
        prefix = "octa";
        break;
    case 9:
        prefix = "nona";
        break;
    case 10:
        prefix = "deca";
        break;
    case 11:
        prefix = "undeca";
        break;
    case 12:
        prefix = "dodeca";
        break;
    } 
    if (["a","e","o","u"].indexOf(myRoot[0]) > -1 && ["a","o"].indexOf(prefix[prefix.length-1]) > -1) {
        prefix = prefix.substring(0,prefix.length-1);
    }
    return prefix;
}