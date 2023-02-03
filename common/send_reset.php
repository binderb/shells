<?php

    $link_email = isset($_POST["email"]) ? $_POST["email"] : "";
    
    if ($link_email != "") {
        
        // Attempt MySQL server connection.
        $conn = mysqli_connect("localhost", "", "", "");

        $userEmail = "";
        $reset_key = md5($link_email + time());
        $reset_timestamp = time();
        
        $check_user_email = "SELECT email,userID FROM user_table WHERE email = ?";
        if ($stmt = $conn->prepare($check_user_email)) {
            $stmt->bind_param("s",$link_email);
            $stmt->execute();
            $stmt->store_result();
            $stmt->bind_result($userEmail,$userID);
            $stmt->fetch();
        } else {
            echo "connection_error";
            exit();
        }
        if ($userEmail != "") {
            $store_reset_key = "INSERT INTO password_reset_keys (userID,key_string,key_timestamp) VALUES (?,?,?)";
            if ($stmt = $conn->prepare($store_reset_key)) {
                $stmt->bind_param("iss", $userID,$reset_key,$reset_timestamp);
                $stmt->execute();
        
                // Compose email with activation link to provided email address
                $to      = $userEmail;
                $subject = "Shells Password Reset Link";
                $message = "You are receiving this email because you requested a password reset link for your Shells profile. Reset your password by following the link below:<br/><br/>".
                           "/common/reset_access.php?key=".$reset_key."<br/><br/>".
                           "Please let Dr. Binder know if you have any issues with this! Email him directly, rather than responding to this email; this message is an automated response sent by the server. <b>The provided link will expire in 24 hours!</b><br/><br/>".
                           "If you did not request this message and believe it was sent in error, let Dr. Binder know!<br/><br/>".
                           "Sincerely,<br/>~Ben Binder";
                $headers[] = 'From: BinderLab <noreply@example.org>';
                $headers[] = 'X-Mailer: PHP/' . phpversion();
                $headers[] = 'MIME-Version: 1.0';
                $headers[] = 'Content-type: text/html; charset=iso-8859-1';
                $mail_status = mail($to, $subject, $message, implode("\r\n", $headers));
                echo "send_reset_success";
            } else {
                echo "connection_error";
            }
        } else {
            echo "email_not_registered";
        }
        
        // Close connection
        mysqli_close($link);
    } else {
        echo "invalid_access_nologin";
    }
    
?>