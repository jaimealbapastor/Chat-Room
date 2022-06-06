<?php
// this file returns the last message of a chat and the time it was sent

if (isset($_POST["chat-id"])) {
    $file = "../../../database/discussions/{$_POST["chat-id"]}.csv";
    if (file_exists($file)) {
        $array = file($file, FILE_IGNORE_NEW_LINES);
        $i = count($array) - 1;
        while ($i >= 0 && !$array[$i]) {
            $i--;
        }
        if ($i >= 0 && $array[$i]) echo $array[$i];
    }
}
exit();
