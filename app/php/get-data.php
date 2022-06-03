<?php
// this file is called by simpleAjax and has multiple purposes
// determined by the 'function' parameter:
// i -> get user info
// m -> get chat messages from a chat
// c -> get information of a chat
// l -> get last message and time

if (!isset($_POST["function"])) exit();

if ($_POST["function"] == "i" && isset($_POST["user-id"])) {
    // -> get user info

    $file = "../database/users.json";
    $json = json_decode(file_get_contents($file, true), true);
    if (isset($json[$_POST["user-id"]])) {
        echo json_encode($json[$_POST["user-id"]]);
    }
} elseif ($_POST["function"] == "m" && isset($_POST["chat-id"])) {
    // -> get chat mesages

    $file = "../database/chats/messages/{$_POST["chat-id"]}.csv";
    if (file_exists($file)) {
        $content = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        echo json_encode($content);
    } else {
        // TODO create file if not exists
    }
} elseif ($_POST["function"] == "c" && isset($_POST["chat-id"])) {
    // -> get information of a chat

    $file = "../database/chats/chats-info.json";
    $json = json_decode(file_get_contents($file, true), true);
    if (isset($json[$_POST["chat-id"]])) {
        echo json_encode($json[$_POST["chat-id"]]);
    }
} elseif ($_POST["function"] == "l" && isset($_POST["chat-id"])) {
    // l -> get last message and time
    $file = "../database/chats/messages/{$_POST["chat-id"]}.csv";
    $array = file($file, FILE_IGNORE_NEW_LINES);
    echo end($array);
}


exit();
