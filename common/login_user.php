<?php
    session_start();
    
    $provided_username = isset($_POST["uname"]) ? $_POST["uname"] : "";
    $provided_pswd = isset($_POST["pswd"]) ? $_POST["pswd"] : "";
    
    if ($provided_username == "" || $provided_pswd == "") {
        echo "invalid_access_nologin";
        exit();
    }

    // Attempt MySQL server connection.
    $conn = mysqli_connect("localhost", "", "", "");
    
    // Query the users database for an entry with a matching username, and pull user data
    $get_profile_data = "SELECT userID,pswd,access,first,last,class,active,activity,streak FROM user_table WHERE username = ?";
    if ($stmt = $conn->prepare($get_profile_data)) {
        $stmt->bind_param("s",$provided_username);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($userID,$stored_pswd,$stored_access,$stored_first,$stored_last,$stored_class,$stored_active,$stored_activity,$stored_streak);
        if ($stmt->num_rows() == 0) {
            echo "username_not_found";
            exit();
        } else {
            $stmt->fetch();
            if ($stored_active == 0) {
                $_SESSION["resend_activation_id"] = $userID;
                echo "user_not_activated";
                exit();
            }
        }
        $stmt->close();
    } else {
        echo "connection_error";
        exit();
    }
    
    // Gather any data from the user_progress table that exists for this user, and make it into a set of JSON arrays.
    // This would also be the point when module degradation would be applied in the future.
    //$get_progress_data = "SELECT modules.moduleID,progress.current_mastery,progress.last_session,modules.full_mastery FROM module_table modules JOIN user_progress progress ON (progress.moduleID = modules.moduleID AND progress.userID = ?) ORDER BY modules.moduleID";
    $get_progress_data = "SELECT modules.moduleID,progress.current_mastery,modules.full_mastery FROM module_table modules LEFT JOIN user_progress progress ON (modules.moduleID = progress.moduleID AND progress.userID = ?) ORDER BY modules.moduleID";
    if ($stmt = $conn->prepare($get_progress_data)) {
        $stmt->bind_param("i",$userID);
        $stmt->execute();
        $stmt->store_result();
        //$stmt->bind_result($moduleID_i,$current_mastery_i,$last_session_i,$full_mastery_i);
        $stmt->bind_result($moduleID_i,$current_mastery_i,$full_mastery_i);
        $moduleIDs = [];
        $current_masterys = [];
        $last_sessions = [];
        $full_masterys = [];
        if ($stmt->num_rows() > 0) {
            while($stmt->fetch()) {
                $moduleIDs[] = $moduleID_i;
                $current_masterys[] = $current_mastery_i;
                //$last_sessions[] = $last_session_i;
                $full_masterys[] = $full_mastery_i;
            }
        } 
        $stmt->close();
    } else {
        echo "connection_error";
        exit();
    }
    
    // Verify the provided password against the stored hash
    if (password_verify($provided_pswd,$stored_pswd)) {
        // User is authenticated, so log them in
        $_SESSION["username"] = $provided_username;
        $_SESSION["firstname"] = $stored_first;
        $_SESSION["lastname"] = $stored_last;
        $_SESSION["class"] = $stored_class;
        $_SESSION["userid"] = $userID;
        $_SESSION["streak"] = $stored_streak;
        $_SESSION["last_activity"] = $stored_activity;
        $_SESSION["progress_modules"] = $moduleIDs;
        $_SESSION["progress_currents"] = $current_masterys;
        $_SESSION["progress_fulls"] = $full_masterys;
        if ($stored_access == "admin") {
            $_SESSION["access"] = "admin";
            echo "login_success_admin";
        } else if ($stored_access == "student" || $stored_access == "dev") {
            $_SESSION["access"] = $stored_access;
            echo "login_success_student";
        }
    } else {
        echo "wrong_password";
    }

    // Close connection
    mysqli_close($conn);

?>