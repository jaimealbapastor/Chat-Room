<?php
// this file returns all the chats

$file = "../../../database/chats-info.json";
echo file_get_contents($file, true);

exit();
