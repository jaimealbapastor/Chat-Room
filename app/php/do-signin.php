<?php
session_start();
unset($_SESSION["badsignin"]);
unset($_SESSION["badsignup"]);

$name = ucfirst(strtolower($_POST["name"]));

foreach (file("../database/users.csv", FILE_IGNORE_NEW_LINES) as $line) {
    $data = explode(";", $line);    // -> [user_id, email, pwd]

    if ($name == $data[0] or $name == $data[1]) { // check email or name

        if (md5($_POST["password"]) == $data[2]) {
            $_SESSION["client"] = $data[0];
            header("Location: ../index.php");
            exit();
        }
    }
}
$_SESSION["badsignin"] = "Name/Email or Password incorrect";
header("Location: signin-up.php");
exit();
