<?php
// this file returns the information of a user

if (isset($_POST["user-id"])) {
    $file = "../../../database/users.csv";
    $user = [];
    foreach (file($file, FILE_IGNORE_NEW_LINES) as $line) {
        $data = explode(";", $line);
        if ($data[0] == $_POST["user-id"]) {
            $user["user-id"] = $data[0];
            $user["email"] = $data[1];
            // $user["pwd"] = $data[2];
            $user["name"] = $data[3];

            echo json_encode($user);
            exit();
        }
    }
    echo json_encode(["user-id" => $_POST["user-id"], "name" => "unknown"]);
}
exit();
