<?php

session_start();

$database = "../../../database/";

if (isset($_POST["chat-id"]) and isset($_POST["msg"])) {

    $file = $database . "discussions/{$_POST["chat-id"]}.csv";
    $today = date("Y-m-d") . "T" . date("H:i:s");
    $content = "{$_SESSION["client"]};{$_SESSION["name"]};$today;{$_POST["msg"]}\n";
    file_put_contents($file, $content, FILE_APPEND);
}
exit();
