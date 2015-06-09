<?php
//
// 先生、時間、曜日 から 場所ごとの確率と現在地の座標を取得
//
header('Content-Type: text/json; charset=utf-8');

//Ajax通信ではなく、直接URLを叩かれた場合はエラーメッセージを表示
if (
    !(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') 
    && (!empty($_SERVER['SCRIPT_FILENAME']) && 'json.php' === basename($_SERVER['SCRIPT_FILENAME']))
    ) 
{
    die ('このページは直接ロードしないでください。');
}

try {

    header('Access-Control-Allow-Origin: *');

    //　本来こっち
    $teacher_id = $_POST["teacher_id"];
    $weekday = $_POST["weekday"];
    $time = $_POST["time"];

    // テスト用
    // $teacher_id = 1;
    // $weekday = "Wednesday";
    // $time = "08:00:00";

    $mysqli = new mysqli("172.18.86.209","labUser","kawa4ken","future_prediction");

    if ($mysqli->connect_errno) {
        printf("Connect failed: %s\n", $mysqli->connect_error);
        exit();
    }
    $mysqli->query("SET NAMES 'utf8'");
    
    // probabilityテーブルから確率を取得
    $query = "select * from probability"
            ." where teacher_id = '$teacher_id'"
            ." and weekday = '$weekday'"
            ." and time = '$time'"
            ." order by probability desc";

    $result = $mysqli->query($query);
    $i=0;

    // 取得したデータを配列に格納
    while ($row = $result->fetch_array()) {
        if(($row["probability"] != 0) && ($row["beacon_id"] != 0)){
            $beacon_id_xy = $row['beacon_id']; 
            $query_xy = "select * from mst_room where id = $beacon_id_xy";
            $result_xy = $mysqli->query($query_xy);
            $row_xy = $result_xy->fetch_array();

            $json[] = array(
                'floor_id' => $row_xy['floor_id'],
                'x' => $row_xy['x'],
                'y' => $row_xy['y'],
                'width' => $row_xy['width'],
                'height'=> $row_xy['height'],
                'probability' => $row['probability'],
            );
        }
    }
    
    header('Content-Type: application/json');
    echo json_encode($json);
    $mysqli->close();

} catch (PDOException $e) {
    //例外処理
    die('Error:' . $e->getMessage());
}