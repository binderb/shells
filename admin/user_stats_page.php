<?php
    session_start();
    if (!isset($_SESSION["access"]) || $_SESSION["access"] != "admin") {
        header('Location: /common/auth_response.php?result=invalid_access');
    }
?>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <?php include('../common/headers.php'); ?>
    <?php include('load_user_data.php'); ?>
    <?php include('load_module_data.php'); ?>
</head>
<body>
    <script type="text/javascript" src="build_admin_panel.js"></script>
</body>
</html>