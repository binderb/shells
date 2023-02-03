<?php

    // Attempt MySQL server connection.
    $conn = mysqli_connect("localhost", "", "", "");

    // Strings must be escaped to prevent SQL injection attack.
    $email = isset($_POST["email"]) ? $_POST["email"] : "";
    $uname = isset($_POST["uname"]) ? $_POST["uname"] : "";
    $fname = isset($_POST["fname"]) ? $_POST["fname"] : "";
    $lname = isset($_POST["lname"]) ? $_POST["lname"] : "";
    $pswd = isset($_POST["pswd"]) ? password_hash($_POST["pswd"],PASSWORD_DEFAULT) : "";
    $class = isset($_POST["class_section"]) ? $_POST["class_section"] : "";
    
    if ($email == "" || $uname == "" || $fname == "" || $lname == "" || $pswd == "") {
        echo "invalid_access_nologin";
        exit();
    }
    //$class = "CHM115A - Spring 2020";
    $streak = 0;
    $activity = "";
    $longest_streak = 0;
    $longest_date = "";
    $access = "student";
    $active = 0;
    $activation_key = md5($uname + time());
    $activation_timestamp = time();
    
    // Check if email or username exists in system already
    $email_exists_check = "SELECT email FROM user_table WHERE email = ?";
    if ($stmt = $conn->prepare($email_exists_check)) {
        $stmt->bind_param("s",$email);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows() > 0) { 
            echo "email_exists";
            exit();
        }
    } else {
        echo "connection_error";
        exit();
    }
    $username_exists_check = "SELECT username FROM user_table WHERE username = ?";
    if ($stmt = $conn->prepare($username_exists_check)) {
        $stmt->bind_param("s",$uname);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows() > 0) { 
            echo "username_exists";
            exit();
        }
    } else {
        echo "connection_error";
        exit();
    }
    
    // Add row to users table, with an inactive flag on the account
    $create_user_row = "INSERT INTO user_table (email, username, first, last, class, pswd, streak, activity, longeststreak, longestdate, access, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $user_id = -1;
    if ($stmt = $conn->prepare($create_user_row)) {
        $stmt->bind_param("ssssssisissi", $email,$uname,$fname,$lname,$class,$pswd,$streak,$activity,$longest_streak,$longest_date,$access,$active);
        $stmt->execute();
        $user_id = $conn->insert_id;
    } else {
        echo "connection_error";
        exit();
    }
    if ($user_id != -1) {
        // Store activation key
        $store_activation_key = "INSERT INTO activation_keys (userID,key_string,key_timestamp) VALUES (?,?,?)";
        if ($stmt = $conn->prepare($store_activation_key)) {
            $stmt->bind_param("iss", $user_id,$activation_key,$activation_timestamp);
            $stmt->execute();
            
            // Compose email with activation link to provided email address
            $to      = $email;
            $subject = "Shells Profile Created!";
            $message = "Thanks for creating a profile on Shells! Activate your profile by following the link below:<br/><br/>".
                       "/common/activate.php?key=".$activation_key."<br/><br/>".
                       "After activating your profile, you should be able to log in to view practice. ".
                       "Please let Dr. Binder know if you have any issues with this! Email him directly, rather than responding to this email; this message is an automated response sent by the server. <b>The provided link will expire in 24 hours!</b><br/><br/>".
                       "Sincerely,<br/>~Ben Binder";
            $headers[] = 'From: BinderLab <noreply@example.org>';
            $headers[] = 'X-Mailer: PHP/' . phpversion();
            $headers[] = 'MIME-Version: 1.0';
            $headers[] = 'Content-type: text/html; charset=iso-8859-1';
            mail($to, $subject, $message, implode("\r\n", $headers));
            echo "creation_success";
        } else {
            echo "connection_error";
            exit();
        }
    }

    // Close connection
    mysqli_close($conn);

?>
