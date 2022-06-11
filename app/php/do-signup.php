<?php
session_start();

unset($_SESSION["badsignin"]);
unset($_SESSION["badsignup"]);

$database = "../database/";
$users_file = $database . "users.csv";
$users = file($users_file, FILE_IGNORE_NEW_LINES);

$name = ucfirst(strtolower($_POST["name"]));

// vérifier mot de passe
if ($_POST["password1"] != $_POST["password2"]) $_SESSION["badsignup"] = "Passwords don't match.";
if (strlen($_POST["password1"]) < 4) $_SESSION["badsignup"] = "The password must be at least 4 characters.";

// vérifier si le login est déjà utilisé
foreach ($users as $line) {
    $data = explode(";", $line);    // [name, email, pwd]
    if ($_POST["email"] == $data[1]) {
        $_SESSION["badsignup"] = "This email already exists.";
        break;
    }

    if ($name == $data[0]) {
        $_SESSION["badsignup"] = "This name already exists. ";
        break;
    }
}

if (!isset($_SESSION["badsignup"])) {
    // ajouter nom au fichier csv

    $user_id = $name; // on pourrait utiliser la fonction uniqid
    $email = $_POST["email"];
    $pwd = md5($_POST["password1"]);
    $users[] = "$user_id;$email;$pwd";

    file_put_contents($users_file, implode("\n", $users));
    $_SESSION["client"] = $user_id;

    // ajouter channel info
    $chats = json_decode(file_get_contents($database . "chats-info.json", true), true);
    $chats["Welcome"][] = $user_id;
    file_put_contents($database . "chats-info.json", json_encode($chats));

    header("Location: ../index.php");
} else {
    header("Location: signin-up.php");
}

exit();
