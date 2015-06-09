<?php
//現在地取得
header('Content-Type: text/json; charset=utf-8');

// //Ajax通信ではなく、直接URLを叩かれた場合はエラーメッセージを表示
// if (
//     !(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') 
//     && (!empty($_SERVER['SCRIPT_FILENAME']) && 'json.php' === basename($_SERVER['SCRIPT_FILENAME']))
//     ) 
// {
//     die ('このページは直接ロードしないでください。');
// }

try {
    $teacher_id = $_POST["teacher_id"];

    // データベース接続
    $mysqli = new mysqli("172.18.86.209","labUser","kawa4ken","future_prediction");

    if ($mysqli->connect_errno) {
        printf("Connect failed: %s\n", $mysqli->connect_error);
        exit();
    }
    $mysqli->query("SET NAMES 'utf8'");
    
    $query = "select * from trn_location_info where id = (select max(id) from trn_location_info where teacher_id = $teacher_id);";
    $result = $mysqli->query($query);
    
    // 取得したデータを配列に格納
    while ($row = $result->fetch_array()){
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
        );
    }
    header('Content-Type: application/json');
    echo json_encode( $json );
    $mysqli->close();
}
catch (PDOException $e)
{
    //例外処理
    die('Error:' . $e->getMessage());
}

?>