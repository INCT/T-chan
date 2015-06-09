<?php
header('Content-Type: text/json; charset=utf-8');

# データベース接続    
$dsn = 'mysql:dbname=future_prediction;host=172.18.86.209;port=3306;charset=utf8';
$user = 'labUser';
$password = 'kawa4ken';
$driver_options = array(
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_EMULATE_PREPARES => false,
);
$dbh = new PDO($dsn, $user, $password, $driver_options);

# mst_time取得
function get_time($dbh){
	$sql_get_time ="SELECT * FROM mst_time";
	foreach ($dbh->query($sql_get_time) as $row_time) {
		$time[]=$row_time['time'];
	}
	return $time;
}

# mst_weekday取得
function get_weekday($dbh){
	$weekday=array("Monday","Tuesday","Wednesday","Thursday","Friday");
	return $weekday;
}

# mst_beacon取得
function get_beacon_id($dbh){
	$sql_get_beacon = "SELECT * FROM mst_beacon";
	foreach ($dbh->query($sql_get_beacon) as $row_beacon) {
		$beacon_id[] = array(
            "id"=> $row_beacon["id"],
            "room_id" => $row_beacon["room_id"],
        );
	}
	return $beacon_id;
}

# mst_teacher取得
function get_teacher_id($dbh){
	$sql_get_teacher ="SELECT * FROM mst_teacher";
	foreach ($dbh->query($sql_get_teacher) as $row_teacher) {
		$teacher[] = array(
            "id"   => $row_teacher["id"],
            "name" => $row_teacher["name"],
        );
	}
	return $teacher;
}

# データ追加
function insert_data($dbh,$teacher_id,$beacon_id,$weekday,$time,$probability) {
    if(empty($probability) && ($probability !== 0))$probability=0;//nullチェック

	$out_time = str_replace(':','',$time);
	$flag = 0;
    
	$sql_check="SELECT * FROM probability WHERE teacher_id = $teacher_id and beacon_id = $beacon_id and weekday = '$weekday' and time = $out_time";
	foreach($dbh->query($sql_check) as $row){
		$flag=1;
        if($row["probability"]!=$probability){
            $sql_update="UPDATE probability SET probability = $probability WHERE teacher_id = $teacher_id and beacon_id = $beacon_id and weekday = '$weekday' and time = $out_time";
            if($dbh->query($sql_update)) {
                echo $sql_update;
                echo " update\n";
            } else {
                echo " update失敗\n"; 
            }
        }
	}
	if($flag == 0){
		$sql_insert = "INSERT INTO probability VALUES(NULL,$teacher_id,$beacon_id,'$weekday',$out_time,$probability)";
		if($dbh->query($sql_insert)) {
			echo " insert\n";
		} else {
            echo " insert失敗\n";
        }
	}
}

# 一番出現した回数の多い要素を返す
function get_max($array) {
    # 記録がなかった場合はnullを返す
    if (sizeof($array) == 0) {
        return null;
    }
    # 出現数を記録する配列
    $histgram = array_count_values($array);
    # 一番多く出現した要素
    $beacon_id = array_keys($histgram,max($histgram));
    # 複数出現した場合は問答無用で最初の値
    return $beacon_id[0];
}

try{
	echo "処理開始\n";

	# 開始位置取得用
	$flag=0;

    # mst_time
	$time = get_time($dbh);
	$time_count = count($time); // 時間区切り数(25) 08:00:00~20:00:00
	
	# mst_beacon
    $beacon  = get_beacon_id($dbh);
    $b_count = count($beacon); // ビーコン数(29) 0~28
	
	# mst_teacher
	$teacher_data = get_teacher_id($dbh);

	# weekday
	$week_data=get_weekday($dbh);
	#宣言終了

	#処理部分
	#先生の数ループ
	foreach ($teacher_data as $teacher){

        echo "------------------".$teacher['name']."-------------------\n";        

    	#曜日ごとにループ
    	foreach ($week_data as $week){
            $beacon_weekly_id = array();
    		#日数カウント用
    		$date_count = array();
            $date_list  = array();

            echo "===============".$week."================\n";

    		# 先生-曜日 記録された週数をループ
    		$sql_date ='select distinct record_date from `trn_location_info` WHERE `teacher_id` = "'.$teacher['id'].'" and `record_weekday` = "'.$week.'"';
    		foreach ($dbh->query($sql_date) as $day_records) {
                $date = $day_records['record_date'];
                array_push($date_list,$day_records['record_date']);

                echo "====".$date."====\n";

    			$beacon_ids = array();// beacon_ids[$output_time] beacon_idを格納していく
                $temp_ids   = array();// ５分前後に記録されたビーコンのIDを格納

    			#その日付に記録されたデータ数　ループ
    			$sql_time = 'select * from trn_location_info WHERE teacher_id = "'.$teacher['id'].'" and record_date = "'.$date.'"';
        		foreach ($dbh->query($sql_time) as $row) {//先生１人につき一日のレコード数ループする
        			foreach ($time as $output_time) {
						// 13:25 ~ 13:35
	        	    	if(strtotime($output_time."+5 min") >= strtotime($row['record_time']) && strtotime($output_time."-5 min") <= strtotime($row['record_time'])){
	                        array_push($temp_ids,$row['beacon_id']);
	                        $exist = true;
	                    # 13:36 ~
	            		} elseif (strtotime($output_time."+5 min") < strtotime($row['record_time']) || strtotime($output_time."-5 min") > strtotime($row['record_time'])) {
	                        // $beacon_ids[$output_time] = get_max($temp_ids);
	                        $temp_ids = array();
	                    }

                        if (sizeof($temp_ids)) {
						    $beacon_ids[$output_time] = get_max($temp_ids);
						}
        			}
        		}

				#取得日数カウント
				foreach ($time as $output_time) {
                    $check = $beacon_ids[$output_time];
					if (!is_null($check)) {
						$date_count[$output_time]++;
					}
                    $beacon_weekly_id[$output_time][$date] = $beacon_ids[$output_time];
				}
        	}

            echo "=========================================\n";

        	#集計処理開始
        	if(sizeof($date_count)) {
        		$beacon_data = array_fill(0,$b_count,0);
        		foreach ($time as $output_time) {
        			$beacon_data = array_fill(0,$b_count,0);

                    foreach($date_list as $date_row) {
                        for($count=0; $count<$b_count; $count++) {
                            if($beacon_weekly_id[$output_time][$date_row]===$beacon[$count]['id']){
                                $beacon_data[$count]++;
                            }
                        }
                        #確率計算処理
                        for($count=0; $count<$b_count; $count++){
                            $probability_all[$output_time][$count]=$beacon_data[$count]*100/$date_count[$output_time];
                        }
                    }
                    #DBに確率を挿入
                    for($count=0; $count<$b_count; $count++) {
                        insert_data($dbh,$teacher['id'],$beacon[$count]['id'],$week,$output_time,$probability_all[$output_time][$count]);
                    }
        		}
        	} else {
                echo "空結果\n";
        		#空結果送信処理
        		foreach ($time as $output_time) {
        			for($count=0 ; $count<$b_count ; $count++) {
        				insert_data($dbh,$teacher['id'],$beacon[$count]['id'],$week,$output_time,0);
        			}
        		}
        	}
        }

        echo "-------------------------------------------------\n";    
    }
} catch (PDOException $e) {
    print('Error:'.$e->getMessage());
    die();
}
echo "\n処理終了";
$dbh = null;

?>