window.sorted_user_data = [];
var unique_classes = [];

var sorters = {
    byname : function(a,b) {
        var theValue = ((a.last.toLowerCase() < b.last.toLowerCase()) ? -1 : ((a.last.toLowerCase() > b.last.toLowerCase()) ? 1 : 0));
        if (!theValue) theValue = ((a.first.toLowerCase() < b.first.toLowerCase()) ? -1 : ((a.first.toLowerCase() > b.first.toLowerCase()) ? 1 : 0));
        return theValue;
    }
};

for (var i=0; i<window.user_data.length; i++) {
    if (window.sorted_user_data.filter(entry => entry.userID == window.user_data[i].userID).length == 0) {
        window.sorted_user_data.push({
            'userID'       : window.user_data[i].userID,
            'first'        : window.user_data[i].first,
            'last'         : window.user_data[i].last,
            'class'        : window.user_data[i].class,
            'moduleIDs'    : [],
            'progress'     : []
        });
    }
    window.sorted_user_data.filter(entry => entry.userID == window.user_data[i].userID)[0].moduleIDs.push(window.user_data[i].moduleID);
    window.sorted_user_data.filter(entry => entry.userID == window.user_data[i].userID)[0].progress.push(window.user_data[i].current_mastery);
    if (unique_classes.filter(entry => entry == window.user_data[i].class).length == 0) unique_classes.push(window.user_data[i].class);
}
window.filtered_class_list = window.sorted_user_data;
unique_classes.sort();

$('body').append('<div id="user_panel" class="white_panel" style="width:calc(100% - 60px);"></div>');
$('#user_panel').append('<div id="panel_controls" class="white_panel" style="width:calc(90% - 60px);text-align:left;"></div>');

// build panel controls
var s = '<span style="font-weight:900;margin:10px;">Class Section:</span><select id="section" name="class_section" style="margin:10px;"><option value="All">All</option>';
for (var i=0; i<unique_classes.length; i++) {
    s += '<option value="'+unique_classes[i]+'">'+unique_classes[i]+'</option>';
}
s +='</select>';
$('#panel_controls').append(s);
$('#section').change( function(e) {
    window.filtered_class_list = window.sorted_user_data.filter(entry => entry.class == this.options[e.target.selectedIndex].text);
    if (this.options[e.target.selectedIndex].text == "All") window.filtered_class_list = window.sorted_user_data;
    build_class_list(window.filtered_class_list);
    $('#student_total').text(window.filtered_class_list.length);
});
$('#panel_controls').append('<span style="font-weight:900;margin:10px;">Total Users:</span><div id="student_total" style="display:inline">'+window.sorted_user_data.length+'</div>');
$('#panel_controls').append('<a id="download_csv" class="lite_button" style="margin:10px;margin-left:20px;" href="">CSV File</a>');
$('#download_csv').click( function(e) {
    e.preventDefault();
    window.filtered_class_list.sort(sorters.byname);
    var student_data = [];
    var full_sum = 0;
    for (var i=0; i<window.module_data.length; i++) full_sum += window.module_data[i].full_mastery;
    for (var i=0; i<window.filtered_class_list.length; i++) {
        var student_i = {
            'first'        : window.filtered_class_list[i].first,
            'last'         : window.filtered_class_list[i].last,
            'overall'      : "",
            'moduleIDs'    : [],
            'percents'     : [],
        }
        var progress_sum = 0;
        for (var j=0;j<window.module_data.length;j++) {
            student_i.moduleIDs.push(window.module_data[j].moduleID);
            var full_i = window.module_data[j].full_mastery;
            if (window.filtered_class_list[i].moduleIDs.indexOf(window.module_data[j].moduleID) > -1) {
                var progress_i = window.filtered_class_list[i].progress[window.filtered_class_list[i].moduleIDs.indexOf(window.module_data[j].moduleID)];
                progress_sum += parseInt(progress_i);
                student_i.percents.push((parseFloat(progress_i) / parseFloat(full_i) * 100).toFixed(2));
            } else {
                student_i.percents.push(0);
            }
        }
        var overall_percent = (progress_sum / full_sum * 100).toFixed(2);
        student_i.overall = overall_percent;
        student_data.push(student_i);
    }
    
    $('body').append('<form id="csv_form" action="generate_csv.php" method="POST"><input type="hidden" name="csv_data" value=""></form>');
    $('input[name="csv_data"]').val(JSON.stringify(student_data));
    //console.log(JSON.stringify(window.filtered_class_list));
    $('#csv_form').submit();
});

// build class list div
$('#user_panel').append('<div id="class_list" style="text-align:left"></div>');
var s = "";
build_class_list(window.sorted_user_data);
$('#class_list').append(s);

function build_class_list (students) {
    students.sort(sorters.byname);
    var s = '<table id="assignments_table" style="width:100%;font-size:clamp(7px, 1.4vw, 16px);table-layout:default;">';
    s += '<tr><td><b>Name</b></td><td><b>Overall</b></td><td><b>Progress</b></td></tr>';
    var full_sum = 0;
    for (var i=0; i<window.module_data.length; i++) full_sum += window.module_data[i].full_mastery;
    for (var i=0; i<students.length; i++) {
        var progress_sum = 0;
        s += '<tr>';
        var module_string = '';
        for (var j=0;j<window.module_data.length;j++) {
            var module_image = window.module_data[j].image_url;
            var medallion_border = '#00C';
            var full_i = window.module_data[j].full_mastery;
            if (students[i].moduleIDs.indexOf(window.module_data[j].moduleID) > -1) {
                var progress_i = students[i].progress[students[i].moduleIDs.indexOf(window.module_data[j].moduleID)];
                progress_sum += parseInt(progress_i);
                if (progress_i >= full_i) {
                    module_image = module_image.split('.png')[0] + '_gold.png';
                    medallion_border = '#ca7700';
                }
                var module_percent = (parseFloat(progress_i) / parseFloat(full_i) *100).toFixed(0);
                module_string += '<div class="special-text" style="margin:10px;display:inline-block;width:40px;height:40px;border-radius:40px;border:2px solid '+medallion_border+';background-image:url('+module_image+');background-size:40px 40px;background-repeat:no-repeat;line-height:40px;color:white;text-align:center;font-weight:900;">';
                module_string += (parseInt(module_percent) >= 100 ? '&nbsp;' : module_percent+'%');
                //module_string += '<span class="special-text__tooltip">'+window.module_data[j].module_title+'</span>';
                module_string += '</div>';
            } else {
                module_string += '<div class="special-text" style="margin:10px;display:inline-block;width:40px;height:40px;border-radius:40px;border:2px dashed '+medallion_border+';line-height:40px;color:white;text-align:center;font-weight:900;">';
                module_string += '&nbsp;';
                //module_string += '<span class="special-text__tooltip">'+window.module_data[j].module_title+'</span>';
                module_string += '</div>';
            }
        }
        var overall_percent = (progress_sum / full_sum * 100).toFixed(2) + '%';
        s += '<td>' + students[i].first + ' ' + students[i].last + '</td><td>' + overall_percent + '</td><td>' + module_string + '</td>';
        s += '</tr>';
    }
    s += '</table>';
    $('#class_list').html(s);
}