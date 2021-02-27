<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Method: GET");
header("Content-Type: application/json; charset=UTF-8");
require "../model/MDDorm.php";

if (!(isset($_GET["dorm_id"]))){
    echo json_encode(array("sts" =>"ok","data" =>getAllDorm()));
}
else{
    echo json_encode(array("sts" =>"ok","data" =>getDorm($_GET["dorm_id"])));
}

?>