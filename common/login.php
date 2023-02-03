<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <?php include('headers.php'); ?>
</head>
<body>
    <a href=""><img class="title_badge" src="/server/images/shells_image.png" width="150" height="150" /></a>
    <h1 id="title" style="margin-bottom:20px;">Shells</h1>
    <p><i>Modules for practice with gen chem!</i></p>
    <div id="responseblock"></div>
    <div id="resources">
        <form id="login_form" class="login_block">
            <div id="fields">
                <table>
                    <tbody>
                        <tr>
                            <td><p>Username:</p></td>
                            <td><input type="text" name="uname"></td>
                        </tr>
                        <tr>
                            <td><p>Password:</p></td>
                            <td><input type="password" name="pswd"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <span style="text-align:right;display:block;margin-bottom:20px;"><a class="inline_link" href="/common/forgot.php">Forgot your password?</a></span>
            <input type="submit" class="std_button" value="Submit"><br/><br/>
            First time here?<br/>
            <a class="inline_link" href="/common/new_user.php">Create a profile</a><br/>- or -<br/>
            <a class="inline_link" href="/player">Continue as Guest</a>
        </form>
    </div>
    <?php include('small_footer.php'); ?>
    <script type="text/javascript">
        $("#login_form").submit(function(e) {
            e.preventDefault();
            var errors = "";
            if ($("input[name=uname]").val() == "") errors += "<br/>\u2014 Please provide a username.";
            if ($("input[name=pswd]").val() == "") errors += "<br/>\u2014 Please provide a password.";
            $("#responseblock").css("display","inline-block");
            if (errors != "") {
                $("#responseblock").css("background-color","#f3645a");
                $("#responseblock").css("padding","15px");
                $("#responseblock").html("<b>Invalid Entry:</b><br/>"+errors);
            } else {
                $("#responseblock").css("background-color","#60b369");
                $("#responseblock").css("padding","15px");
                $("#responseblock").html("<b>Logging In...</b>");
                $.post("login_user.php", $("#login_form").serialize(), function(data) {
                    if (data == "username_not_found") {
                        $("#responseblock").css("background-color","#f3645a");
                        $("#responseblock").html("<b>Error:</b><br/>The provided username is not associated with any existing account.");
                    } else if (data == "wrong_password") {
                        $("#responseblock").css("background-color","#f3645a");
                        $("#responseblock").html("<b>Error:</b><br/>Incorrect password.");
                    } else if (data == "login_success_admin") {
                        window.location.replace('/player');
                    } else if (data == "login_success_student") {
                        window.location.replace('/player');
                    } else {
                        window.location.replace('/common/auth_response.php?result='+data);
                    }
                });
            }
        });
    </script>
</body>
</html>