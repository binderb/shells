<?php
    session_start();
    
    // Attempt MySQL server connection.
    $conn = mysqli_connect("localhost", "", "", "");

    $link_key = $_GET["key"];
    
    // Check the active state of the user associated with the provided activation key
    $key_check = "SELECT a.userID,a.username,a.active,b.key_timestamp FROM user_table a JOIN activation_keys b ON a.userID = b.userID WHERE b.key_string = ?";
    if ($stmt = $conn->prepare($key_check)) {
        $stmt->bind_param("s",$link_key);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($userID,$username,$active_status,$key_timestamp);
        if ($stmt->num_rows == 1) {
            $stmt->fetch();
            if ($active_status == 0) {
                // The user is inactive now, so check whether the key has expired before using it
                if (time() - $key_timestamp <= 86400) { //86400 = 24 hours
                    // Activate the user
                    $activate_user = "UPDATE user_table a JOIN activation_keys b ON a.userID = b.userID SET a.active = 1 WHERE b.key_string = ?";
                    if ($stmt = $conn->prepare($activate_user)) {
                        $stmt->bind_param("s",$link_key);
                        $stmt->execute();
                        header('Location: /common/auth_response.php?result=activation_success');
                    } else {
                        header('Location: /common/auth_response.php?result=connection_error');
                    }
                } else {
                    // Key expired; set a session variable with user's ID so the "key_expired" link will create a new key properly if the user elects to do so
                    $_SESSION["resend_activation_id"] = $userID;
                    header('Location: /common/auth_response.php?result=key_expired');
                }
            } else {
                header('Location: /common/auth_response.php?result=already_active');
            }
            // Delete the supplied activation key from the activation_keys database
            $delete_key = "DELETE FROM activation_keys WHERE key_string = ?";
            if ($stmt = $conn->prepare($delete_key)) {
                $stmt->bind_param("s",$link_key);
                $stmt->execute();
            } else {
                header('Location: /common/auth_response.php?result=connection_error');
            }
        } elseif ($stmt->num_rows == 0) {
            header('Location: /common/auth_response.php?result=key_not_found');
        }
    } else {
        header('Location: /common/auth_response.php?result=connection_error');
    }

?>
