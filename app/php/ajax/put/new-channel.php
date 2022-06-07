<?php

session_start();

$database = "../../../database/";

if (isset($_POST["name"])) {
    // -> create a new channel

    $file = $database . "chats-info.json";
    $data = json_decode(file_get_contents($file, true), true);

    $chat_id = $_POST["name"];
    // uniqid("chat", false); -> create a unique id

    $data[$chat_id] = [$_SESSION["client"]]; // add new channel to json where client is the only member

    file_put_contents($file, json_encode($data), LOCK_EX); // update chat-info.json
    file_put_contents($database . "discussions/$chat_id.csv", ""); // add csv file

    echo $chat_id;
}
exit();
