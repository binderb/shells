<?php
    session_start();
    session_unset();
    session_destroy();
    header('Location: http://example.org/app_shells/common/login.php');
?>