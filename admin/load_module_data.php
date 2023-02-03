<?php
    session_start();
    
    // Attempt MySQL server connection.
    $conn = mysqli_connect("localhost", "", "", "");
    $conn->set_charset("utf8");
    
    // Check the active state of the user associated with the provided activation key
    $fetch_data = "SELECT * FROM module_table";
    if ($stmt = $conn->prepare($fetch_data)) {
        $stmt->execute();
        $result = $stmt->get_result();
        $module_data = array();
        while ($row = $result->fetch_assoc())  $module_data[] = $row;
    } else {
        echo "error";
    }
    $stmt->close();
    $conn->close();
    
    echo '<script type="text/javascript">window.module_data = ' . json_encode($module_data) . ';</script>';


?>