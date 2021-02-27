<?php
function database(){
    $severName = "45.77.38.248";
    $username = "abcdfe054";
    $password = "abcdfe054";
    $dbName = "fd_p_db";
    $objCon = mysqli_connect($severName,$username,$password,$dbName);
    mysqli_set_charset($objCon,"utf8");
    return $objCon ;
}

function statusConnectionDB(){
    $conn = database();
    if(!$conn){
        $data = array("status"=>"fail","msg"=>mysqli_connect_error());
        echo json_encode($data);
        mysqli_close($conn);
    }
    else{
        mysqli_close($conn);
        $data = array("status"=>"Success","msg"=>"Connected succesfully !");
        echo json_encode($data);
    }
}

?>