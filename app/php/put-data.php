<?php
// this file is called by simpleAjax and has multiple purposes
// determined by the 'f' (function) parameter:
// m -> add a message to a chat
// g -> create a new channel
// d -> delete a channel
// c -> create a new chat
// p -> add a person to a chanel

session_start();

$database = "../database/";

function post_exist($param_list)
{
    $exist = true;
    foreach ($param_list as $param) {
        $exist = $exist && isset($_POST[$param]);
    }
    return $exist;
}

if (!isset($_POST["f"])) exit();

if ($_POST["f"] == "m" && post_exist(["chat-id", "msg"])) {
    // -> add a message to a chat

    $file = $database . "discussions/{$_POST["chat-id"]}.csv";
    $today = date("Y-m-d") . "T" . date("H:i:s");
    $content = "{$_SESSION["client"]};$today;{$_POST["msg"]}\n";
    file_put_contents($file, $content, FILE_APPEND);
} elseif ($_POST["f"] == "g" && post_exist(["name", "img"])) {
    // -> create a new channel

    $file = $database . "chats-info.json";
    $data = json_decode(file_get_contents($file, true), true);

    $chat_id = uniqid("chat", false); // create a unique id

    $new_channel = [];
    $new_channel["is_channel"] = true;
    $new_channel["name"] = $_POST["name"];
    $new_channel["img"] = $_POST["img"];
    $new_channel["members"] = [$_SESSION["client"]];

    $data[$chat_id] = $new_channel; // add new channel to json

    file_put_contents($file, json_encode($data), LOCK_EX); // update chat-info.json
    file_put_contents($database . "discussions/$chat_id.csv", ""); // add csv file

    $users_file = $database . "users.json";
    $users = json_decode(file_get_contents($users_file, true), true);
    $users[$_SESSION["client"]]["chats"][] = $chat_id;  // add discussion to user's chats
    file_put_contents($users_file, json_encode($users));

    echo $chat_id;
} elseif ($_POST["f"] == "d" && post_exist(["name", "img"])) {
    // TODO delete channel
} else {
    echo "not function selected";
}
exit();
