<?php
    session_start();
    
    // Attempt MySQL server connection.
    $conn = mysqli_connect("localhost", "binderl1_web_app", "hIvdex-tapnov-sapjy6", "binderl1_chemistry_database");
    $conn->set_charset("utf8");
    
    // Check the active state of the user associated with the provided activation key
    $fetch_all = "SELECT * FROM periodic_table";
    if ($stmt = $conn->prepare($fetch_all)) {
        $stmt->execute();
        $result = $stmt->get_result();
        //echo var_dump($result->fetch_assoc());
        $pt_data = array();
        while ($row = $result->fetch_assoc())  {
            //echo var_dump($row);
	        $pt_data[] = $row;
        }
    } else {
    }
    $stmt->close();
    $conn->close();
    
    echo '<script type="text/javascript">window.pt = ' . json_encode($pt_data) . ';</script>';
    
?>