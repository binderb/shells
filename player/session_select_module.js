var session_select_module = {
    
    display_menu: function () {
        window.picked = false;
        $('body').append('<div id="session_select_menu"></div>');
        
        // Login/logout and admin options
        if (session_username == "guest") {
            $('#session_select_menu').append('<div class="white_panel"><b>Guest Access</b><br/>Your progress will not be saved.<br/><a class="inline_link" href="/common/login.php">Log In</a></div>');
        } else {
            $('#session_select_menu').append('<div class="white_panel">Logged in as <b>'+session_username+'</b><span style="margin-left:20px"><a class="inline_link" href="/common/logout.php">Logout</a></span></div>');
        }
        if (session_access == "admin") build_admin_controls();
        
        
        // Build main lessons
        $('#session_select_menu').append('<h1 style="margin-top:20px;">General Chemistry: Nomenclature Modules</h1>');
        $('#session_select_menu').append('<p style="margin-top:20px;font-size:16px;">Fill up the progress bars on all modules below in order to complete the assignment.<br/>Each time you start a module, you\'ll get a new set of randomized questions that fit the category!<br/><br/>If you don\'t see the progress bars,<br/><b>be sure to log in</b>!</p>');
        $('#session_select_menu').append('<div id="main_block" style="display:block;"></div>');
        
        build_lesson_gateway({
            parent_div : "main_block",
            gateway_id : "ionic_nomenclature_basics",
            module_id  : 1,
            bar_enabled: true,
            image      : "/server/images/ionic_image.png",
            title      : "Naming Ionics 1:<br/>Basics",
            subtitle   : "Basic nomenclature. No transition metals or polyatomic ions.",
            lesson     : build_ionic_nomenclature_basics()
        });
        
        build_lesson_gateway({
            parent_div : "main_block",
            gateway_id : "ionic_nomenclature_transition_metals",
            module_id  : 2,
            bar_enabled: true,
            image      : "/server/images/ionic_image.png",
            title      : "Naming Ionics 2:<br/>More Elements",
            subtitle   : "An expanded set of monatomic ions, including transition metals.",
            lesson     : build_ionic_nomenclature_transition_metals()
        });
        
        build_lesson_gateway({
            parent_div : "main_block",
            gateway_id : "ionic_nomenclature_polyatomics",
            module_id  : 3,
            bar_enabled: true,
            image      : "/server/images/ionic_image.png",
            title      : "Naming Ionics 3:<br/>Polyatomics",
            subtitle   : "Focused practice where most questions include one or more polyatomic ions.",
            lesson     : build_ionic_nomenclature_polyatomics()
        });
        
        build_lesson_gateway({
            parent_div : "main_block",
            gateway_id : "ionic_nomenclature_full_review",
            module_id  : 4,
            bar_enabled: true,
            image      : "/server/images/ionic_image.png",
            title      : "Naming Ionics 4:<br/>Challenge Mode!",
            subtitle   : "No restrictions!",
            lesson     : build_ionic_nomenclature_full_review()
        });
        
        build_lesson_gateway({
            parent_div : "main_block",
            gateway_id : "covalent_nomenclature_inorganic_basics",
            module_id  : 5,
            bar_enabled: true,
            image      : "/server/images/covalent_image.png",
            title      : "Naming Covalents 1:<br/>Inorganic Basics",
            subtitle   : "Practice naming simple inorganic covalent compounds.",
            lesson     : build_covalent_nomenclature_inorganic_basics()
        });
        
        build_lesson_gateway({
            parent_div : "main_block",
            gateway_id : "nomenclature_ionic_or_covalent",
            module_id  : 6,
            bar_enabled: true,
            image      : "/server/images/generic_image.png",
            title      : "Nomenclature:<br/>Ionic or Covalent?",
            subtitle   : "Practice determining how to classify a given formula.",
            lesson     : build_nomenclature_ionic_or_covalent()
        });
        
        // Build supplementary lessons
        $('#session_select_menu').append('<h1 style="margin-top:20px;">Extra Practice:</h1>');
        $('#session_select_menu').append('<p style="margin-top:20px;font-size:16px;">Here are some additional modules to help you study. They are NOT required for points.</p>');
        $('#session_select_menu').append('<div id="practice_block" style="display:block;"></div>');
        
        build_lesson_gateway({
            parent_div : "practice_block",
            gateway_id : "polyatomic_practice_1",
            module_id  : -1,
            bar_enabled: false,
            image      : "https://example.org/images/chemImage_square.png",
            title      : "Polyatomic Names:<br/>Starter Set",
            subtitle   : "Review the names and formulas of the eight basic polyatomic ions.",
            lesson     : build_polyatomic_lesson_1()
        });
        
        build_lesson_gateway({
            parent_div : "practice_block",
            gateway_id : "polyatomic_practice_2",
            module_id  : -1,
            bar_enabled: false,
            image      : "https://example.org/images/chemImage_square.png",
            title      : "Polyatomic Names:<br/>Derivatives!",
            subtitle   : "Practice all the variations on polyatomic names.",
            lesson     : build_polyatomic_lesson_2()
        });
        
        
        
        /*var polyatomic_1_string = '<a id="polyatomic_1" class="resource_block" href=""><img class="title_badge badge_border" src="https://example.org/images/chemImage_square.png" width="100" height="100"><h4>Polyatomic Names:<br/>Starter Set</h4><p>Review the names and formulas of the eight basic polyatomic ions.</p></a>';
        $('#practice_block').append(polyatomic_1_string);
        $('#polyatomic_1').click( function(e) {
            e.preventDefault();
            if (!window.picked) {
                window.picked = true;
                current_module = -1;
                current_module_image = $(this).find('.title_badge').attr('src');
                $('#session_select_menu').css('opacity','0.0');
                $('#session_select_menu').on("transitionend", function (e) {
                    $(this).remove();
                    var lesson_params = build_polyatomic_lesson_1();
                    generic_session_controller.start_session(lesson_params.builders,lesson_params.content,lesson_params.flags);
                });
            } 
        });
            
        var polyatomic_2_string = '<a id="polyatomic_2" class="resource_block" href=""><img class="title_badge badge_border" src="https://example.org/images/chemImage_square.png" width="100" height="100"><h4>Polyatomic Names:<br/>Derivatives!</h4><p>Practice all the variations on polyatomic names.</p></a>';
        $('#practice_block').append(polyatomic_2_string);
        $('#polyatomic_2').click( function(e) {
            e.preventDefault();
            if (!window.picked) {
                window.picked = true;
                current_module = -1;
                current_module_image = $(this).find('.title_badge').attr('src');
                $('#session_select_menu').css('opacity','0.0');
                $('#session_select_menu').on("transitionend", function (e) {
                    $(this).remove();
                    var lesson_params = build_polyatomic_lesson_2();
                    generic_session_controller.start_session(lesson_params.builders,lesson_params.content,lesson_params.flags);
                });
            } 
        });
        $('#session_select_menu').append('</div>');
        $('#session_select_menu').append('<div id="practice_block" style="display:block;">');
        
        var lesson1_string = '<a id="session_1" class="resource_block" href=""><img class="title_badge badge_border" src="https://example.org/images/ionic_image.png" width="100" height="100"><span id="module_mastery_container"></span><h4>Naming Ionics 1:<br/>Basics</h4><p>Basic nomenclature. No transition metals or polyatomic ions.</p></a>';
        $('#session_select_menu').append(lesson1_string);
        if (session_username != "guest") { 
            $('#session_1').find('#module_mastery_container').append('<div id="mastery_1" class="module_mastery"><div class="module_mastery_value"></div></div>');
            if (session_currents[session_modules.indexOf(1)] !== null) {
                var percent_1 = session_currents[session_modules.indexOf(1)] / session_fulls[session_modules.indexOf(1)];
                $('#mastery_1').find('.module_mastery_value').css('width',percent_1*100+'%');
            }
        }
        $('#session_1').click( function(e) {
            e.preventDefault();
            if (!window.picked) {
                window.picked = true;
                current_module = 1;
                current_module_image = $(this).find('.title_badge').attr('src');
                $('#session_select_menu').css('opacity','0.0');
                $('#session_select_menu').on("transitionend", function (e) {
                    $(this).remove();
                    var lesson_params = buildLesson1();
                    generic_session_controller.start_session(lesson_params.builders,lesson_params.content,lesson_params.flags);
                });
            } 
        });
        var lesson2_string = '<a id="session_2" class="resource_block" href=""><img class="title_badge badge_border" src="https://example.org/images/ionic_image.png" width="100" height="100"><span id="module_mastery_container"></span><h4>Naming Ionics 2:<br/>More Elements</h4><p>An expanded set of monatomic ions, including transition metals.</p></a>';
        $('#session_select_menu').append(lesson2_string);
        if (session_username != "guest") {
            $('#session_2').find('#module_mastery_container').append('<div id="mastery_2" class="module_mastery"><div class="module_mastery_value"></div></div>');
            if (session_currents[session_modules.indexOf(2)] !== null) {
                var percent_2 = session_currents[session_modules.indexOf(2)] / session_fulls[session_modules.indexOf(2)];
                $('#mastery_2').find('.module_mastery_value').css('width',percent_2*100+'%');
            }
        }
        $('#session_2').click( function(e) {
            e.preventDefault();
            if (!window.picked) {
                window.picked = true;
                current_module = 2;
                current_module_image = $(this).find('.title_badge').attr('src');
                $('#session_select_menu').css('opacity','0.0');
                $('#session_select_menu').on("transitionend", function (e) {
                    $(this).remove();
                    var lesson_params = buildLesson2();
                    generic_session_controller.start_session(lesson_params.builders,lesson_params.content,lesson_params.flags);
                });
            } 
        });
        var lesson3_string = '<a id="session_3" class="resource_block" href=""><img class="title_badge badge_border" src="https://example.org/images/ionic_image.png" width="100" height="100"><span id="module_mastery_container"></span><h4>Naming Ionics 3:<br/>Polyatomics</h4><p>Focused practice where most questions include one or more polyatomic ions.</p></a>';
        $('#session_select_menu').append(lesson3_string);
        if (session_username != "guest") {
            $('#session_3').find('#module_mastery_container').append('<div id="mastery_3" class="module_mastery"><div class="module_mastery_value"></div></div>');
            if (session_currents[session_modules.indexOf(3)] !== null) {
                var percent_3 = session_currents[session_modules.indexOf(3)] / session_fulls[session_modules.indexOf(3)];
                $('#mastery_3').find('.module_mastery_value').css('width',percent_3*100+'%');
            }
        }
        $('#session_3').click( function(e) {
            e.preventDefault();
            if (!window.picked) {
                window.picked = true;
                current_module = 3;
                current_module_image = $(this).find('.title_badge').attr('src');
                $('#session_select_menu').css('opacity','0.0');
                $('#session_select_menu').on("transitionend", function (e) {
                    $(this).remove();
                    var lesson_params = buildLesson3();
                    generic_session_controller.start_session(lesson_params.builders,lesson_params.content,lesson_params.flags);
                });
            } 
        });
        var lesson4_string = '<a id="session_4" class="resource_block" href=""><img class="title_badge badge_border" src="https://example.org/images/ionic_image.png" width="100" height="100"><span id="module_mastery_container"></span><h4>Naming Ionics 4:<br/>Challenge Mode!</h4><p>No restrictions!</p></a>';
        $('#session_select_menu').append(lesson4_string);
        if (session_username != "guest") {
            $('#session_4').find('#module_mastery_container').append('<div id="mastery_4" class="module_mastery"><div class="module_mastery_value"></div></div>');
            if (session_currents[session_modules.indexOf(4)] !== null) {
                var percent_4 = session_currents[session_modules.indexOf(4)] / session_fulls[session_modules.indexOf(4)];
                $('#mastery_4').find('.module_mastery_value').css('width',percent_4*100+'%');
            }
        }
        $('#session_4').click( function(e) {
            e.preventDefault();
            if (!window.picked) {
                window.picked = true;
                current_module = 4;
                current_module_image = $(this).find('.title_badge').attr('src');
                $('#session_select_menu').css('opacity','0.0');
                $('#session_select_menu').on("transitionend", function (e) {
                    $(this).remove();
                    var lesson_params = buildLesson4();
                    generic_session_controller.start_session(lesson_params.builders,lesson_params.content,lesson_params.flags);
                });
            } 
        });
        
        $('#session_select_menu').append('<div id="practice_block" style="display:block;">');
        $('#session_select_menu').append('</div>');
        
        var covalent_lesson_1_string = '<a id="covalent_1" class="resource_block" href=""><img class="title_badge badge_border" src="/server/images/covalent_image.png" width="100" height="100"><span id="module_mastery_container"></span><h4>Covalents 1:<br/>Inorganic Basics</h4><p>Practice naming simple inorganic covalent compounds.</p></a>';
        $('#session_select_menu').append(covalent_lesson_1_string);
        if (session_username != "guest") {
            $('#covalent_1').find('#module_mastery_container').append('<div id="mastery_5" class="module_mastery"><div class="module_mastery_value"></div></div>');
            if (session_currents[session_modules.indexOf(5)] !== null) {
                var percent_5 = session_currents[session_modules.indexOf(5)] / session_fulls[session_modules.indexOf(5)];
                $('#mastery_5').find('.module_mastery_value').css('width',percent_5*100+'%');
            }
        }
        $('#covalent_1').click( function(e) {
            e.preventDefault();
            if (!window.picked) {
                window.picked = true;
                current_module = 5;
                current_module_image = $(this).find('.title_badge').attr('src');
                $('#session_select_menu').css('opacity','0.0');
                $('#session_select_menu').on("transitionend", function (e) {
                    $(this).remove();
                    var lesson_params = build_covalent_lesson_1();
                    generic_session_controller.start_session(lesson_params.builders,lesson_params.content,lesson_params.flags);
                });
            } 
        });
        
        var covalent_or_ionic_string = '<a id="covalent_2" class="resource_block" href=""><img class="title_badge badge_border" src="/server/images/covalent_image.png" width="100" height="100"><span id="module_mastery_container"></span><h4>Covalents 2:<br/>Ionic or Covalent?</h4><p>Practice determining how to classify a given formula.</p></a>';
        $('#session_select_menu').append(covalent_or_ionic_string);
        if (session_username != "guest") {
            $('#covalent_2').find('#module_mastery_container').append('<div id="mastery_6" class="module_mastery"><div class="module_mastery_value"></div></div>');
            if (session_currents[session_modules.indexOf(6)] !== null) {
                var percent_6 = session_currents[session_modules.indexOf(6)] / session_fulls[session_modules.indexOf(6)];
                $('#mastery_6').find('.module_mastery_value').css('width',percent_6*100+'%');
            }
        }
        $('#covalent_2').click( function(e) {
            e.preventDefault();
            if (!window.picked) {
                window.picked = true;
                current_module = 6;
                current_module_image = $(this).find('.title_badge').attr('src');
                $('#session_select_menu').css('opacity','0.0');
                $('#session_select_menu').on("transitionend", function (e) {
                    $(this).remove();
                    var lesson_params = build_covalent_lesson_2();
                    generic_session_controller.start_session(lesson_params.builders,lesson_params.content,lesson_params.flags);
                });
            } 
        });
        
        $('#session_select_menu').append('</div>');*/
        
        // Visible to admin only
        if (session_access == "admin") {
            
            $('#session_select_menu').append('<h1 style="margin-top:20px;">Hidden Modules:</h1>');
            $('#session_select_menu').append('<div id="dev_block" style="display:block;"></div>');
            
            build_lesson_gateway({
				parent_div : "dev_block",
				gateway_id : "dim_analysis_1",
				module_id  : -1,
				bar_enabled: false,
				image      : "https://example.org/images/chemImage_square.png",
				title      : "DimAnalysis",
				subtitle   : "Work in progress.",
				lesson     : build_dimanalysis_test_lesson()
			});
            
//             var dimanalysis_string = '<a id="dimanalysis" class="resource_block" href=""><img class="title_badge badge_border" src="/server/images/covalent_image.png" width="100" height="100"><span id="module_mastery_container"></span><h4>Dimensional Analysis</h4></a>';
//             $('#dev_block').append(dimanalysis_string);
            /*if (session_username != "guest") {
                $('#dimanalysis').find('#module_mastery_container').append('<div id="mastery_6" class="module_mastery"><div class="module_mastery_value"></div></div>');
                if (session_currents[session_modules.indexOf(6)] !== null) {
                    var percent_6 = session_currents[session_modules.indexOf(6)] / session_fulls[session_modules.indexOf(6)];
                    $('#mastery_6').find('.module_mastery_value').css('width',percent_6*100+'%');
                }
            }*/
            /*$('#dimanalysis').click( function(e) {
                e.preventDefault();
                if (!window.picked) {
                    window.picked = true;
                    window.current_module = -1;
                    window.current_module_image = $(this).find('.title_badge').attr('src');
                    $('#session_select_menu').css('opacity','0.0');
                    $('#session_select_menu').on("transitionend", function (e) {
                        $(this).remove();
                        load('stoich_builder.js');
                        //var lesson_params = build_dimanalysis_test_module();
                        //generic_session_controller.start_session(lesson_params.builders,lesson_params.content,lesson_params.flags);
                    });
                }
            });*/
            
            
            var orbitals_string = '<a id="orbitals" class="resource_block" href=""><img class="title_badge badge_border" src="/server/images/covalent_image.png" width="100" height="100"><span id="module_mastery_container"></span><h4>Orbitals</h4></a>';
            $('#dev_block').append(orbitals_string);
            $('#orbitals').click( function(e) {
                e.preventDefault();
                if (!window.picked) {
                    window.picked = true;
                    window.current_module = -1;
                    window.current_module_image = $(this).find('.title_badge').attr('src');
                    $('#session_select_menu').css('opacity','0.0');
                    $('#session_select_menu').on("transitionend", function (e) {
                        $(this).remove();
                        
                        var lesson_params = build_orbitals_test_lesson();
                        generic_session_controller.start_session(lesson_params.builders,lesson_params.content,lesson_params.flags);
                    });
                }
            });
            
            
            
        }
        
        $('#session_select_menu').addClass('notransition');
        $('#session_select_menu').css({'opacity':'0.0'});
        $('#session_select_menu').redraw();
        $('#session_select_menu').removeClass('notransition');
        $('#session_select_menu').css({'opacity':'1.0'});
        
    },
    
}

// -----------------------------------------------------
// BUILDER FUNCTIONS
// -----------------------------------------------------

function build_lesson_gateway (params) {
    var gateway_string = '<a id="'+params.gateway_id+'" class="resource_block" href=""><img class="title_badge badge_border" src="'+params.image+'" width="100" height="100"><span id="module_mastery_container"></span><h4>'+params.title+'</h4><p>'+params.subtitle+'</p></a>';
    $('#session_select_menu').append(gateway_string);
    if (session_username != "guest" && params.bar_enabled) { 
        $('#'+params.gateway_id).find('#module_mastery_container').append('<div id="'+params.gateway_id+'_mastery" class="module_mastery"><div class="module_mastery_value"></div></div>');
        var completed = 0;
        var full_completion = window.session_fulls[window.session_modules.indexOf(params.module_id)];
        if (window.session_currents[window.session_modules.indexOf(params.module_id)] !== null) {
            completed = window.session_currents[window.session_modules.indexOf(params.module_id)];
            var mastery_percent = completed / full_completion;
            $('#'+params.gateway_id+'_mastery').find('.module_mastery_value').css('width',mastery_percent*100+'%');
        }
        $('#'+params.gateway_id).find('.module_mastery').append('<div class="mastery_text">'+completed+'/'+full_completion+'</div>');
        if (completed == full_completion) {
            var gold_image_url = params.image.split('.png')[0] + '_gold.png';
            $('#'+params.gateway_id).find('img').attr('src',gold_image_url);
            $('#'+params.gateway_id).find('img').css('border-color','#ca7700');
            $('#'+params.gateway_id).find('.mastery_text').css('color','#ca7700');
        }
    }
    $('#'+params.gateway_id).click( function(e) {
        e.preventDefault();
        if (!window.picked) {
            window.picked = true;
            window.current_module = params.module_id;
            window.current_module_image = params.image;
            $('#session_select_menu').css('opacity','0.0');
            $('#session_select_menu').on("transitionend", function (e) {
                $(this).remove();
                var lesson_params = params.lesson;
                generic_session_controller.start_session(lesson_params.builders,lesson_params.content,lesson_params.flags);
            });
        } 
    });
}

function build_ionic_nomenclature_basics () {
    var builder_list = [];
    var content_list = [];
    var flags_list = [];
    for (var i=0;i<6;i++) {
        if (i < 3) builder_list.push(build_give_ionic_formula);
        else builder_list.push(build_give_ionic_name);
        var flags_i = ["CUTOFF_ARGON","NO_POLYATOMICS","PROVIDE_D_BLOCK_ROMAN","PROVIDE_POST_TRANSITION_ROMAN"];
        flags_list.push(flags_i);
        var unique = false;
        while (!unique) {
            var compound_i = generate_ionic_compound(flags_i);
            if (!containsObjectWithName(compound_i,content_list)) { unique = true; content_list.push(compound_i); }
        }
    }
    shuffle(builder_list);
    var param_array = {"builders":builder_list, "content":content_list, "flags":flags_list };
    return param_array;
}

function build_ionic_nomenclature_transition_metals () {
    var builder_list = [];
    var content_list = [];
    var flags_list = [];
    for (var i=0;i<8;i++) {
        if (i < 4) builder_list.push(build_give_ionic_formula);
        else builder_list.push(build_give_ionic_name);
        var flags_i = ["CUTOFF_XENON","NO_POLYATOMICS","PROVIDE_D_BLOCK_ROMAN","PROVIDE_POST_TRANSITION_ROMAN"];
        flags_list.push(flags_i);
        var unique = false;
        while (!unique) {
            var compound_i = generate_ionic_compound(flags_i);
            if (!containsObjectWithName(compound_i,content_list)) { unique = true; content_list.push(compound_i); }
        }
    }
    shuffle(builder_list);
    var param_array = {"builders":builder_list, "content":content_list, "flags":flags_list };
    return param_array;
}

function build_ionic_nomenclature_polyatomics () {
    var builder_list = [];
    var content_list = [];
    var flags_list = [];
    for (var i=0;i<8;i++) {
        if (i < 4) builder_list.push(build_give_ionic_formula);
        else builder_list.push(build_give_ionic_name);
        var flags_i = ["CUTOFF_ARGON","PROVIDE_D_BLOCK_ROMAN","PROVIDE_POST_TRANSITION_ROMAN"];
        flags_list.push(flags_i);
        var unique = false;
        while (!unique) {
            var compound_i = generate_ionic_compound(flags_i);
            if (!containsObjectWithName(compound_i,content_list)) { unique = true; content_list.push(compound_i); }
        }
    }
    shuffle(builder_list);
    var param_array = {"builders":builder_list, "content":content_list, "flags":flags_list };
    return param_array;
}

function build_ionic_nomenclature_full_review () {
    var builder_list = [];
    var content_list = [];
    var flags_list = [];
    for (var i=0;i<10;i++) {
        if (i < 5) builder_list.push(build_give_ionic_formula);
        else builder_list.push(build_give_ionic_name);
        var flags_i = ["CUTOFF_XENON","PROVIDE_D_BLOCK_ROMAN","PROVIDE_POST_TRANSITION_ROMAN"];
        flags_list.push(flags_i);
        var unique = false;
        while (!unique) {
            var compound_i = generate_ionic_compound(flags_i);
            if (!containsObjectWithName(compound_i,content_list)) { unique = true; content_list.push(compound_i); }
        }
    }
    shuffle(builder_list);
    var param_array = {"builders":builder_list, "content":content_list, "flags":flags_list };
    return param_array;
}

function build_covalent_nomenclature_inorganic_basics () {
    var builder_list = [];
    var content_list = [];
    var flags_list = [];
    for (var i=0;i<6;i++) {
        if (i < 3) builder_list.push(build_give_covalent_formula);
        else builder_list.push(build_give_covalent_name);
        var flags_i = ["NEUTRAL_ONLY"];
        flags_list.push(flags_i);
        var unique = false;
        while (!unique) {
            var compound_i = generate_covalent_compound(flags_i);
            if (!containsObjectWithName(compound_i,content_list)) { unique = true; content_list.push(compound_i); }
        }
    }
    shuffle(builder_list);
    var param_array = {"builders":builder_list, "content":content_list, "flags":flags_list };
    return param_array;
}

function build_nomenclature_ionic_or_covalent () {
    var builder_list = [];
    var content_list = [];
    var flags_list = [];
    for (var i=0;i<6;i++) {
        builder_list.push(build_give_ionic_or_covalent_mc);
        if (i < 3) {
            var flags_i = ["NEUTRAL_ONLY"];
            flags_list.push(flags_i);
            var unique = false;
            while (!unique) {
                var compound_i = generate_covalent_compound(flags_i);
                if (!containsObjectWithName(compound_i,content_list)) { unique = true; content_list.push(compound_i); }
            }
        } else {
            var flags_i = ["CUTOFF_XENON","PROVIDE_D_BLOCK_ROMAN"];
            flags_list.push(flags_i);
            var unique = false;
            while (!unique) {
                var compound_i = generate_ionic_compound(flags_i);
                if (!containsObjectWithName(compound_i,content_list)) { unique = true; content_list.push(compound_i); }
            }
        }
    }
    shuffle(content_list);
    var param_array = {"builders":builder_list, "content":content_list, "flags":flags_list };
    return param_array;
}

function build_polyatomic_lesson_1 () {
    var builder_list = [];
    var content_list = [];
    var flags_list = [];
    for (var i=0;i<1;i++) {
        for (var i=0;i<8;i++) {
            //if (i < 5) builder_list.push(build_give_polyatomic_name_mc);
            //else builder_list.push(build_give_ionic_name);
            builder_list.push(build_give_polyatomic_name_mc);
            var flags_i = ["STARTER_SET_ONLY"];
            flags_list.push(flags_i);
            var unique = false;
            while (!unique) {
                var ion_i = generate_polyatomic_ion(flags_i);
                if (!containsObjectWithName(ion_i,content_list)) { unique = true; content_list.push(ion_i); }
            }
        }
    }
    shuffle(builder_list);
    var param_array = {"builders":builder_list, "content":content_list, "flags":flags_list };
    return param_array;
}

function build_polyatomic_lesson_2 () {
    var builder_list = [];
    var content_list = [];
    var flags_list = [];
    for (var i=0;i<1;i++) {
        for (var i=0;i<10;i++) {
            builder_list.push(build_give_polyatomic_name_mc);
            var flags_i = [""];
            flags_list.push(flags_i);
            var unique = false;
            while (!unique) {
                var ion_i = generate_polyatomic_ion(flags_i);
                if (!containsObjectWithName(ion_i,content_list)) { unique = true; content_list.push(ion_i); }
            }
        }
    }
    shuffle(builder_list);
    var param_array = {"builders":builder_list, "content":content_list, "flags":flags_list };
    return param_array;
}

function build_dimanalysis_test_lesson () {
    var builder_list = [];
    var content_list = [];
    var flags_list = [];
    for (var i=0;i<1;i++) {
    	builder_list.push(build_dimanalysis);
        var flags_i = [];
        flags_list.push(flags_i);
        var content_i = [];
        content_list.push(content_i);
        // var unique = false;
//         while (!unique) {
//             var compound_i = generate_ionic_compound(flags_i);
//             if (!containsObjectWithName(compound_i,content_list)) { unique = true; content_list.push(compound_i); }
//         }
    }
    shuffle(builder_list);
    var param_array = {"builders":builder_list, "content":content_list, "flags":flags_list };
    return param_array;
}

function build_orbitals_test_lesson () {
    var builder_list = [];
    var content_list = [];
    var flags_list = [];
    for (var i=0;i<1;i++) {
        for (var i=0;i<1;i++) {
            builder_list.push(build_give_orbital_type_mc);
            var flags_i = [""];
            flags_list.push(flags_i);
            content_list.push(generate_quantum_numbers(flags_i));
            /*var unique = false;
            while (!unique) {
                var ion_i = generate_polyatomic_ion(flags_i);
                if (!containsObjectWithName(ion_i,content_list)) { unique = true; content_list.push(ion_i); }
            }*/
        }
    }
    shuffle(builder_list);
    var param_array = {"builders":builder_list, "content":content_list, "flags":flags_list };
    return param_array;
}

function build_admin_controls () {
    $('#session_select_menu').append('<div class="white_panel"><a class="inline_link" href="/admin/user_stats_page.php">View Class Stats</a></div>');
}

session_select_module.display_menu();

//var lesson_params = build_covalent_lesson_1();
//generic_session_controller.start_session(lesson_params.builders,lesson_params.content,lesson_params.flags);