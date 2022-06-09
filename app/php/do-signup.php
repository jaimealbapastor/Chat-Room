<?php
session_start();

unset($_SESSION["badsignin"]);
unset($_SESSION["badsignup"]);

$users_file = "../database/users.csv";
$users = file($users_file, FILE_IGNORE_NEW_LINES);

$name = ucfirst(strtolower($_POST["name"]));

// vérifier si le login est déjà utilisé
foreach ($users as $line) {
    $data = explode(";", $line);    // [name, email, pwd]
    if ($_POST["email"] == $data[1]) {
        $_SESSION["badsignup"] = 1;
        break;
    }

    if ($name == $data[0]) {
        $_SESSION["badsignup"] = 2;
        break;
    }
}

if (!isset($_SESSION["badsignup"])) {
    // ajouter nom au fichier csv

    $user_id = $name; // on pourrait utiliser la fonction uniqid
    $email = $_POST["email"];
    $pwd = md5($_POST["password"]);
    $users[] = "$user_id;$email;$pwd";

    file_put_contents($users_file, implode("\n", $users));
    $_SESSION["client"] = $user_id;

    header("Location: ../index.php");
} else {
    header("Location: signin-up.php");
}

exit();
