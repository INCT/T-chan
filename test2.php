<?php
header('Content-Type: text/json; charset=utf-8');

$mysqli = new mysqli("172.18.86.209","labUser","kawa4ken","future_prediction");

if ($mysqli->connect_errno) {
    printf("Connect failed: %s\n", $mysqli->connect_error);
    exit();
}

$mysqli->query("SET NAMES 'utf8'");

//先生のidとビーコンのidの値 POST
$teacher_id  = 99;
$beacon_id   = 88;

// 曜日の取得
$weekday = date("l");

$insert_query = "INSERT INTO `trn_location_info`"
              ." VALUES(NULL,$teacher_id,$beacon_id,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'$weekday')";
if(!$mysqli->query($insert_query)){
	echo "クエリの実行失敗\n";
}else{
	echo "成功\n";
}

$mysqli->close(); 

?>