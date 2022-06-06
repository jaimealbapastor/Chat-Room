<?php
// this file is called by simpleAjax and has multiple purposes
// determined by the 'f' (function) parameter:
// m -> add a message to a chat
// g -> create a new channel
// d -> delete a channel
// c -> create a new chat
// p -> add a person to a chanel

session_start();

$database = "../../../database/";

if (isset($_POST["chat-id"]) and isset($_POST["msg"])) {

    $file = $database . "discussions/{$_POST["chat-id"]}.csv";
    $today = date("Y-m-d") . "T" . date("H:i:s");
    $content = "{$_SESSION["client"]};$today;{$_POST["msg"]}\n";
    file_put_contents($file, $content, FILE_APPEND);
}
exit();
