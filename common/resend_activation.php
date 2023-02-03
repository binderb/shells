<?php
    session_start();
    $userID = isset($_SESSION["resend_activation_id"]) ? $_SESSION["resend_activation_id"] : "";
    session_destroy();
    
    if ($userID != "") {
        
        // Attempt MySQL server connection.
        $conn = mysqli_connect("localhost", "", "", "");

        $userEmail = "";
        $new_activation_key = md5($userID + time());
        $new_activation_timestamp = time();
        
        $get_user_email = "SELECT email FROM user_table WHERE userID = ?";
        if ($stmt = $conn->prepare($get_user_email)) {
            $stmt->bind_param("i",$userID);
            $stmt->execute();
            $stmt->store_result();
            $stmt->bind_result($userEmail);
            $stmt->fetch();
        } else {
            echo "connection_error";
            exit();
        }
        if ($userID != "") {
            $store_activation_key = "INSERT INTO activation_keys (userID,key_string,key_timestamp) VALUES (?,?,?)";
            if ($stmt = $conn->prepare($store_activation_key)) {
                $stmt->bind_param("iss", $userID,$new_activation_key,$new_activation_timestamp);
                $stmt->execute();
        
                // Compose email with activation link to provided email address
                $to      = $userEmail;
                $subject = "Shells Activation Link";
                $message = "You are receiving this email because you requested a fresh activation link for your Shells profile. Activate your profile by following the link below:<br/><br/>".
                           "/common/activate.php?key=".$new_activation_key."<br/><br/>".
                           "After activating your profile, you should be able to log in to view practice. ".
                           "Please let Dr. Binder know if you have any issues with this! Email him directly, rather than responding to this email; this message is an automated response sent by the server. <b>The provided link will expire in 24 hours!</b><br/><br/>".
                           "If you did not request this message and believe it was sent in error, let Dr. Binder know!<br/><br/>".
                           "Sincerely,<br/>~Ben Binder";
                $headers[] = 'From: BinderLab <noreply@example.org>';
                $headers[] = 'X-Mailer: PHP/' . phpversion();
                $headers[] = 'MIME-Version: 1.0';
                $headers[] = 'Content-type: text/html; charset=iso-8859-1';
                $mail_status = mail($to, $subject, $message, implode("\r\n", $headers));
                echo "resend_activation_success";
            } else {
                echo "connection_error";
            }
        } else {
            echo "connection_error";
        }
        
        // Close connection
        mysqli_close($conn);
    } else {
        echo "invalid_access_nologin";
    }
    
?>