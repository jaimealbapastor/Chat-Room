<?php

session_start();

$file = "../../../database/chats-info.json";

if (isset($_POST["chat-id"])) {
    $id = $_POST["chat-id"];

    $chats = json_decode(file_get_contents($file, true), true);
    if (key_exists($id, $chats)) {
        $chats[$id][] = $_SESSION["client"];
    }
    file_put_contents($file, json_encode($chats));
    echo json_encode($chats);
}
exit();
