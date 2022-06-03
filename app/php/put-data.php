<?php
// this file is called by simpleAjax and has multiple purposes
// determined by the 'function' parameter:
// m -> add a message to a chat
// c -> create a new chat
// g -> create a new group
// p -> add a person to a group

function post_exist($param_list)
{
    $exist = true;
    foreach ($param_list as $param) {
        $exist = $exist && isset($_POST[$param]);
    }
    return $exist;
}

if (!isset($_POST["function"])) exit();

if ($_POST["function"] == "m" && post_exist(["chat-id", "user-id", "msg"])) {
    // -> add a message to a chat

    $file = "../database/chats/messages/{$_POST["chat-id"]}.csv";
    $today = date("Y-m-d") . "T" . date("H:i:s");
    $content = "{$_POST["user-id"]};$today;{$_POST["msg"]}\n";
    file_put_contents($file, $content, FILE_APPEND);
}
