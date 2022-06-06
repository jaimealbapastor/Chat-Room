<?php
// this file returns the information of a chat

if (isset($_POST["chat-id"])) {
    $file = "../../../database/chats-info.json";
    $json = json_decode(file_get_contents($file, true), true);
    if (isset($json[$_POST["chat-id"]])) {
        echo json_encode($json[$_POST["chat-id"]]);
    }
}
exit();
