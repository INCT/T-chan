<?php

// Androidからteacher_idとbeacon_idを受け取りデータベースに日時を記録する

header('Content-Type: text/json; charset=utf-8');

$mysqli = new mysqli("172.18.86.209","labUser","kawa4ken","future_prediction");

if ($mysqli->connect_errno) {
    printf("Connect failed: %s\n", $mysqli->connect_error);
    exit();
}

$mysqli->query("SET NAMES 'utf8'");

//先生のidとビーコンのidの値 POST
$teacher_id  = (int)$_POST["teacher_id"];
$beacon_id   = (int)$_POST["beacon_id"];

// 曜日の取得
$weekday = date("l");

// 1.新規の先生/ビーコンの場合，値を挿入して終了
$new_id_check_query = "SELECT COUNT(*) FROM trn_location_info where teacher_id = $teacher_id and beacon_id = $beacon_id";
$result = $mysqli->query($new_id_check_query);
$row = $result->fetch_array();

if (!$row[0]) {

	echo "新規\n";

	$insert_query = "INSERT INTO `trn_location_info`"
	              ." VALUES(NULL,$teacher_id,$beacon_id,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'$weekday')";
	if(!$mysqli->query($insert_query)){
		echo "クエリの実行失敗\n";
	}else{
		echo "成功\n";
	}
	exit();
}

// 2.最後に挿入したレコードを判定し 一分以内に挿入されていたならスルー
// $read_last_query = "SELECT * FROM trn_location_info where recode_time = (SELECT MAX(recode_time) FROM trn_location_info) and recode_date = (SELECT MAX(recode_date) FROM trn_location_info) and id = (SELECT MAX(id) FROM trn_location_info)";
$read_last_query = "SELECT * FROM trn_location_info where id = (SELECT MAX(id) FROM trn_location_info)"
				 ." and teacher_id = $teacher_id and beacon_id = $beacon_id";

$last_data = $mysqli->query($read_last_query);
if(!$last_data) {
	echo "read_last_query実行失敗";
} else {
	$row = $last_data->fetch_array();
	$last_date = $row['recode_date'];
	$now_date  = date("Y-m-d");

	$last_time = $row['recode_time'];
	$str = str_replace(":","",$last_time);
	$db_last = (int) substr( $str , 0 , 4);

	$now_time = (int)date("Hi");

	print_r($row);

	echo "<比較>";
	echo strtotime($now_date);
	echo "と";
	echo strtotime($last_date);
	echo "<比較>\n";

	//次の日以降ならば必ずinsert	
	if (strtotime($now_date) > strtotime($last_date)) {
		echo "next day\n";

		$insert_query = "INSERT INTO `trn_location_info`"
		              ." VALUES(NULL,$teacher_id,$beacon_id,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'$weekday')";
		if(!$mysqli->query($insert_query)){
			echo " クエリの実行失敗\n";
		}else{
			echo " 成功\n";
		}

	} else {
		echo "today\n";

		// 直前に挿入したレコードの時間が同じならinsertしない(分単位)
		if($now_time > $db_last){
			echo "new\n";
			$insert_query = "INSERT INTO `trn_location_info`"
			              ." VALUES(NULL,$teacher_id,$beacon_id,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'$weekday')";
			if(!$mysqli->query($insert_query)){
				echo "クエリの実行失敗\n";
			}else{
				echo "成功\n";
			}
		} else{
			echo "old\n";
		}
	}
	
}

$mysqli->close(); 

?>