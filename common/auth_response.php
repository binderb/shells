<!DOCTYPE html>
<html>
<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <?php include('headers.php'); ?>
</head>
<body>
    <a href=""><img class="title_badge" src="/server/images/shells_image.png" width="150" height="150" /></a>
    <?php
        $message_type = $_GET["result"];
        if ($message_type == 'creation_success') {
            include('../server/create_success_message.html');
        } elseif ($message_type == "activation_success") {
            include('../server/activation_success_message.html');
        } elseif ($message_type == "invalid_access") {
            include('../server/invalid_access_message.html');
        } elseif ($message_type == "invalid_access_nologin") {
            include('../server/invalid_access_nologin_message.html');
        } elseif ($message_type == "connection_error") {
            include('../server/connection_error_message.html');
        } elseif ($message_type == "no_response") {
            include('../server/no_response_message.html');
        } elseif ($message_type == "user_exists") {
            include('../server/user_exists_message.html');
        } elseif ($message_type == "key_not_found") {
            include('../server/key_not_found_message.html');
        } elseif ($message_type == "key_expired") {
            include('../server/key_expired_message.html');
        } elseif ($message_type == "resend_activation_success") {
            include('../server/resend_activation_success_message.html');
        } elseif ($message_type == "already_active") {
            include('../server/already_active_message.html');
        } elseif ($message_type == "send_reset_success") {
            include('../server/send_reset_success_message.html');
        } elseif ($message_type == "reset_key_expired") {
            include('../server/reset_key_expired_message.html');
        } elseif ($message_type == "reset_key_not_found") {
            include('../server/reset_key_not_found_message.html');
        } elseif ($message_type == "password_reset_success") {
            include('../server/password_reset_success_message.html');
        } elseif ($message_type == "user_not_activated") {
            include('../server/user_not_activated_message.html');
        } elseif ($message_type == "assignment_not_found") {
            include('../server/assignment_not_found_message.html');
        }
        include('small_footer.php');
    ?>
</body>
</html>