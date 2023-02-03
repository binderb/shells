<?php
    $my_data = json_decode($_POST["csv_data"],true);
    $s = "First,Last,Overall";
    foreach ($my_data[0]["moduleIDs"] as $module) {
        $s = $s . ',' . 'Module ' . $module;
    }
    $s = $s . "<br/>";
    foreach ($my_data as $data_i) {
        $s = $s . $data_i['first'] . ',' . $data_i['last'] . ',' . $data_i['overall'];
        foreach ($data_i["percents"] as $percent_i) {
            $s = $s . ',' . $percent_i;
        }
        $s = $s . "<br/>";
    }
    echo $s;
?>