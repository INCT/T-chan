<?php
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
    header('Content-Type: text/json; charset=utf-8');

    $mysqli = new mysqli("172.18.86.209","labUser","kawa4ken","future_prediction");

    if ($mysqli->connect_errno) {
        printf("Connect failed: %s\n", $mysqli->connect_error);
        exit();
    }
    $mysqli->query("SET NAMES 'utf8'");
    
    $query = 'select * from mst_teacher';
    $result = $mysqli->query($query);
    
    // 取得したデータを配列に格納
    while ($row = $result->fetch_array()){
        $users[] = array(
            'id'=> $row['id'],
            'name' => $row['name'],
        );
    }
    header('Content-Type: application/json');
    echo json_encode( $users );
    $mysqli->close();
}
catch (PDOException $e)
{
    //例外処理
    die('Error:' . $e->getMessage());
}