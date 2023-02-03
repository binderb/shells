<?php
    session_start();
    
    // Attempt MySQL server connection.
    $conn = mysqli_connect("localhost", "", "", "");

    $userID = isset($_SESSION["password_reset_id"]) ? $_SESSION["password_reset_id"] : "";
    $session_email = isset($_SESSION["password_reset_email"]) ? $_SESSION["password_reset_email"] : "";
    $provided_email = isset($_POST["email"]) ? $_POST["email"] : "";
    $new_password = isset($_POST["pswd"]) ? $_POST["pswd"] : "";
    session_destroy();
    
    if ($session_email == "" || $provided_email == "" || $userID == "" || $new_password == "") {
        echo "invalid_access_nologin";
        exit();
    } elseif ($session_email != $provided_email) {
        echo "email_match_fail";
        exit();
    }
    
    if ($new_password != "") {
        $new_password = password_hash($new_password,PASSWORD_DEFAULT);
    } else {
        echo "invalid_access_nologin";
        exit();
    }
    
    $reset_password = "UPDATE user_table SET pswd = ? WHERE userID = ?";
    if ($stmt = $conn->prepare($reset_password)) {
        $stmt->bind_param("si",$new_password,$userID);
        $stmt->execute();
        echo "password_reset_success";
    } else {
        echo "connection_error";
    }
    
    // Close connection
    mysqli_close($conn);

?>