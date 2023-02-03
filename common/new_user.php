<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<?php include('headers.php'); ?>
</head>
<body>
    <a href=""><img class="title_badge" src="/server/images/shells_image.png" width="150" height="150" /></a>
    <h1 id="title">Shells</h1>
    <h4 id="title">New User Profile:</h4>
    <div id="responseblock" ></div>
    <div id="resources">
        <form id="create_user_form" class="login_block">
            <div id="fields">
                <table>
                    <tbody>
                        <tr>
                            <td><p>Augsburg<br/>Email: </p></td>
                            <td><input type="text" name="email"></td>
                        </tr>
                        <tr>
                            <td><p>Username: </p></td>
                            <td><input type="text" name="uname"></td>
                        </tr>
                        <tr>
                            <td><p>First Name: </p></td>
                            <td><input type="text" name="fname"></td>
                        </tr>
                        <tr>
                            <td><p>Last Name: </p></td>
                            <td><input type="text" name="lname"></td>
                        </tr>
                        <tr>
                            <td><p>Password: </p></td>
                            <td><input type="password" name="pswd"></td>
                        </tr>
                        <tr>
                            <td><p>Section: </p></td>
                            <td>
                                <select name="class_section">
                                    <option value="">--- Choose a Section ---</option>
                                    <option value="F21 CHM115-C (Instructor)">F21 CHM115-C (Instructor)</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <input type="submit" class="std_button" value="Submit">
        </form>
    </div>
    <?php include('small_footer.php'); ?>
    <script type="text/javascript">
    $("#create_user_form").submit(function(e) {
        e.preventDefault();
        var errors = "";
        if (!$("input[name=email]").val().endsWith("@augsburg.edu")) errors += "<br/>\u2014 Please use a valid Augsburg email address.";
        if ($("input[name=uname]").val() == "") errors += "<br/>\u2014 Please provide a username.";
        if ($("input[name=fname]").val() == "") errors += "<br/>\u2014 Please provide your first name when signing up.";
        if ($("input[name=lname]").val() == "") errors += "<br/>\u2014 Please provide your last name when signing up.";
        if ($("input[name=pswd]").val() == "" || $("input[name=pswd]").val().length < 8) errors += "<br/>\u2014 Please provide a password with at least 8 characters.";
        if ($("select[name=class_section]").val() == "") errors += "<br/>\u2014 Please choose a class section.";
        $("#responseblock").css("display","inline-block");
        if (errors != "") {
            $("#responseblock").css("background-color","#f3645a");
            $("#responseblock").css("padding","15px");
            $("#responseblock").html("<b>Invalid Entry:</b><br/>"+errors);
        } else {
            $("#responseblock").css("background-color","#60b369");
            $("#responseblock").css("padding","15px");
            $("#responseblock").html("<b>Working...</b>");
            $.post("create_user.php", $("#create_user_form").serialize(), function(data) {
                if (data == "username_exists") {
                    $("#responseblock").css("background-color","#f3645a");
                    $("#responseblock").html("<b>Error:</b><br/>A profile with this username already exists. Please choose a different username.");
                } else if (data == "email_exists") {
                    $("#responseblock").css("background-color","#f3645a");
                    $("#responseblock").html("<b>Error:</b><br/>A profile with this email address already exists. If you've forgotten your password, you can reset it from the login page.");
                } else {
                    window.location.replace('/common/auth_response.php?result='+data);
                }
            });
        }
    });
</script>
</body>
</html>

