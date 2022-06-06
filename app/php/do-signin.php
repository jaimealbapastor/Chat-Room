<?php
session_start();
unset($_SESSION["badsignin"]);
unset($_SESSION["badsignup"]);

foreach (file("../database/users.csv", FILE_IGNORE_NEW_LINES) as $line) {
    $data = explode(";", $line);
    if ($_POST["name"] == $data[3] or $_POST["name"] == $data[1]) { // check email or name
        if (md5($_POST["password"]) == $data[2]) {
            $_SESSION["client"] = $data[0];
            header("Location: ../index.php");
            exit();
        }
    }
}
$_SESSION["badsignin"] = 1;
header("Location: signin-up.php");
exit();
