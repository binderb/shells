<?php
    session_start();
    
    if (!isset($_SESSION["username"])) {
        echo "invalid_access";
        goto end_update;
    } elseif ($_SESSION["username"] == "guest") {
        echo "update_success";
        goto end_update;
    }
    
    $module = isset($_POST["module"]) ? $_POST["module"] : "";
    $progress = isset($_POST["progress"]) ? $_POST["progress"] : "";
    $user_id = isset($_SESSION["userid"]) ? $_SESSION["userid"] : "";
    if ($module == "" || $progress == "" || $user_id == "") {
        echo "invalid_access_nologin";
        goto end_update;
    }
    
    date_default_timezone_set("US/central");
    $last_session = date('Y-m-d H:i:s',time());
    
    // Attempt MySQL server connection.
    $conn = mysqli_connect("localhost", "", "", "");
    
    
    // Add or update records if the module number is not -1; otherwise, code will just refresh session variables.
    if ($module != -1) {
    
        // Check if this user has saved progress on this module before.
        $responses_exist = false;
        $check_responses_exist = "SELECT * FROM user_progress WHERE (moduleID = ? AND userID = ?)";
        if ($stmt = $conn->prepare($check_responses_exist)) {
            $stmt->bind_param("ii", $module,$user_id);
            $stmt->execute();
            $stmt->store_result();
            if ($stmt->num_rows > 0) $responses_exist = true;
            $stmt->close();
        } else {
            echo "connection_error";
            goto end_update;
        }
    
        // If no progress exists for this user on this module yet, add an appropriate entry to the user_progress table.
        $manage_response = $responses_exist ? "UPDATE user_progress SET current_mastery = ?, last_session = ? WHERE (moduleID = ? AND userID = ?)" : "INSERT INTO user_progress (current_mastery, last_session, moduleID, userID) VALUES (?, ?, ?, ?)";
        if ($stmt = $conn->prepare($manage_response)) {
            $stmt->bind_param("isii", $progress,$last_session,$module,$user_id);
            $stmt->execute();
            $stmt->close();
        } else {
            echo "connection_error";
            goto end_update;
        }
    }
    
    // Finally, update all the session variables to reflect the changes made in the database.
    // This is important in case the user reloads the page while working, after they've completed something new.
    $get_progress_data = "SELECT modules.moduleID,progress.current_mastery,modules.full_mastery FROM module_table modules LEFT JOIN user_progress progress ON (modules.moduleID = progress.moduleID AND progress.userID = ?) ORDER BY modules.moduleID";
    if ($stmt = $conn->prepare($get_progress_data)) {
        $stmt->bind_param("i",$user_id);
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
        goto end_update;
    }
    $_SESSION["progress_modules"] = $moduleIDs;
    $_SESSION["progress_currents"] = $current_masterys;
    $_SESSION["progress_fulls"] = $full_masterys;
    
    // Close connection
    mysqli_close($conn);
    echo "update_success";
    
    end_update:
    
?>