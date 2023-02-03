<?php
    
    session_start();
    
    // Attempt MySQL server connection.
    $conn = mysqli_connect("localhost", "", "", "");
    $conn->set_charset("utf8");
    
    // Check the active state of the user associated with the provided activation key
    $fetch_data = "SELECT progress.userID, progress.moduleID, progress.current_mastery, users.first, users.last, users.class, modules.full_mastery, modules.module_title, modules.image_url FROM (user_progress progress JOIN user_table users ON (users.userID = progress.userID)) JOIN module_table modules ON (modules.moduleID = progress.moduleID) ORDER BY users.last, users.first, modules.moduleID";
    if ($stmt = $conn->prepare($fetch_data)) {
        $stmt->execute();
        $result = $stmt->get_result();
        $user_data = array();
        while ($row = $result->fetch_assoc())  $user_data[] = $row;
    } else {
        echo "error";
    }
    $stmt->close();
    $conn->close();
    
    echo '<script type="text/javascript">window.user_data = ' . json_encode($user_data) . ';</script>';


?>