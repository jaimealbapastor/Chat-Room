<?php
// this file returns the messages of a chat

if (isset($_POST["chat-id"])) {

    $file = "../../../database/discussions/{$_POST["chat-id"]}.csv";
    if (file_exists($file)) {
        $content = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        echo json_encode($content);
    }
}
