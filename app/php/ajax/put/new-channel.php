<?php

session_start();

$database = "../../../database/";

if (isset($_POST["name"]) and isset($_POST["img"])) {
    // -> create a new channel

    $file = $database . "chats-info.json";
    $data = json_decode(file_get_contents($file, true), true);

    $chat_id = uniqid("chat", false); // create a unique id

    $new_channel = [];
    $new_channel["is_channel"] = true;
    $new_channel["name"] = $_POST["name"];
    $new_channel["img"] = $_POST["img"];
    $new_channel["members"] = [$_SESSION["client"]];

    $data[$chat_id] = $new_channel; // add new channel to json

    file_put_contents($file, json_encode($data), LOCK_EX); // update chat-info.json
    file_put_contents($database . "discussions/$chat_id.csv", ""); // add csv file

    $users_file = $database . "users.json";
    $users = json_decode(file_get_contents($users_file, true), true);
    $users[$_SESSION["client"]]["chats"][] = $chat_id;  // add discussion to user's chats
    file_put_contents($users_file, json_encode($users));

    echo $chat_id;
}
exit();