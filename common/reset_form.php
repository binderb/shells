<!DOCTYPE html>
<html>
<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    
	<?php include('headers.php'); ?>
</head>
<body>
    <img class="title_badge" src="/server/images/shells_image.png" width="150" height="150" />
    <h1 id="title">Password Reset</h1>
    <p>Please enter your Augsburg email below, along with your new desired password.<br/>Passwords must be at least 8 characters long.</p>
    <div id="responseblock" style="display:none;"></div>
    <div id="resources">
        <form id="reset_password_form" class="login_block">
            <div id="fields">
                <table>
                    <tbody>
                        <tr>
                            <td><p>Augsburg<br/>Email: </p></td>
                            <td><input type="text" name="email"></td>
                        </tr>
                        <tr>
                            <td><p>New Password: </p></td>
                            <td><input type="password" name="pswd"></td>
                        </tr>
                        <tr>
                            <td><p>Re-type<br/>New Password: </p></td>
                            <td><input type="password" name="pswd2"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <input type="submit" class="std_button" value="Submit">
        </form>
    </div>
    <?php include('small_footer.php'); ?>
</body>
<script type="text/javascript">
    $("#reset_password_form").submit(function(e) {
        e.preventDefault();
        var errors = "";
        if ($("input[name=email]").val() == "") errors += "<br/>\u2014 Please provide the email address associated with your account.";
        if ($("input[name=pswd]").val() == "" || $("input[name=pswd]").val().length < 8) errors += "<br/>\u2014 Please provide a password with at least 8 characters.";
        if ($("input[name=pswd]").val() != "" && $("input[name=pswd]").val() != $("input[name=pswd2]").val()) errors += "<br/>\u2014 Passwords do not match.";
        $("#responseblock").css("display","inline-block");
        if (errors != "") {
            $("#responseblock").css("background-color","#f3645a");
            $("#responseblock").css("padding","15px");
            $("#responseblock").html("<b>Invalid Entry:</b></span><br/>"+errors);
        } else {
            $("#responseblock").css("background-color","#60b369");
            $("#responseblock").css("padding","15px");
            $("#responseblock").html("<b>Working...</b>");
            $.post("reset_password.php", $("#reset_password_form").serialize(), function(data) {
                if (data == "email_match_fail") {
                    $("#responseblock").css("background-color","#f3645a");
                    $("#responseblock").css("padding","15px");
                    $("#responseblock").html("<b>Error:</b><br/>Provided email does not match the one tied to this reset link.");
                } else {
                    window.location = '/auth_response.php?result='+data;   
                }
            });
        }
    });
</script>
</html>