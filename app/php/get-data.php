<?php
// this file is called by simpleAjax and has multiple purposes
// determined by the 'function' parameter:
// i -> get user info
// m -> get chat messages from a chat
// c -> get information of a chat

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
    // TODO codigo erroneo

    $file = "../database/chats/chats-info.json";
    $json = json_decode(file_get_contents($file, true), true);
    if (isset($json[$_POST["chat-id"]])) {
        echo json_encode($json[$_POST["chat-id"]]);
    }
} elseif ($_POST["function"] == "c" && isset($_POST["chat-id"])) {
    // -> get information of a chat

    $file = "../database/chats/chats-info.json";
    $json = json_decode(file_get_contents($file, true), true);
    if (isset($json[$_POST["chat-id"]])) {
        echo json_encode($json[$_POST["chat-id"]]);
    }
}


exit();
