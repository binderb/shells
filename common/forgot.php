<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <?php include('headers.php'); ?>
</head>
<body>
    <a href=""><img class="title_badge" src="/server/images/shells_image.png" width="150" height="150" /></a>
    <h1 id="title">Password Reset</h1>
    <p>Please enter your Augsburg email below.<br/>A link will be sent there, and you can reset your password by following it.</p>
    <div id="responseblock" style="display:none;"></div>
    <div id="resources">
        <form id="send_reset_form" class="login_block">
            <div id="fields">
                <table>
                    <tbody>
                        <tr>
                            <td><p>Augsburg<br/>Email: </p></td>
                            <td><input type="text" name="email"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <input type="submit" class="std_button" value="Submit"><br/><br/>
        </form>
    </div>
    <?php include('small_footer.php'); ?>
    <script type="text/javascript">
        $("#send_reset_form").submit(function(e) {
            e.preventDefault();
            var errors = "";
            if (!$("input[name=email]").val().endsWith("@augsburg.edu")) errors += "<br/>\u2014 Please use a valid Augsburg email address.";
            $("#responseblock").css("display","inline-block");
            if (errors != "") {
                $("#responseblock").css("background-color","#f3645a");
                $("#responseblock").css("padding","15px");
                $("#responseblock").html("<b>Invalid Entry:</b><br/>"+errors);
            } else {
                $("#responseblock").css("display","inline-block");
                $("#responseblock").css("background-color","#60b369");
                $("#responseblock").css("padding","15px");
                $("#responseblock").html("<b>Working...</b>");
                $.post("send_reset.php", $("#send_reset_form").serialize(), function(data) {
                    if (data == "email_not_registered") {
                        $("#responseblock").css("background-color","#f3645a");
                        $("#responseblock").html("<b>Error:</b><br/>Provided email does not match any profiles on record.");
                    } else {
                        window.location = '/common/auth_response.php?result='+data;   
                    }
                });
            }
        });
    </script>
</body>
</html>