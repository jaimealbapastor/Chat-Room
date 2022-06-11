<?php

session_start();

$file = "../../../database/chats-info.json";

if (isset($_POST["chat-id"])) {
    $id = $_POST["chat-id"];

    $chats = json_decode(file_get_contents($file, true), true);

    if (($key = array_search($_SESSION["client"], $chats[$id])) !== false) {
        unset($chats[$id][$key]);
    }
    file_put_contents($file, json_encode($chats));
}
exit();
