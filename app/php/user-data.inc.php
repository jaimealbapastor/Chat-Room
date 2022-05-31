<?php
// returns a chain of characters equal to $str
// but all characters are lowercase except the
// first one in uppercase
function normalize($str)
{
    $str = strtolower($str);
    return strtoupper($str[0]) . substr($str, 1);
}

// returs the html code for a user in the scroll
// list of people under the search bar
// $user: object
function html_scroll_user($user)
{
    $name = $user["personal"]["first-name"] . " " . $user["personal"]["last-name"];
    $img = "../database/images/" . $user["profile-img"];

    $time = $user["last-connection"]; // TODO change into: left x minutes ago

    //TODO añadir "active" detras de clearfix
    return "<li class='clearfix'> 
                <img src='$img' alt='avatar'>
                <div class='about'>
                    <div class='name'>$name</div>
                    <div class='status'> <i class='fa fa-circle {$user["status"]}'></i> left $time </div>
                </div>
            </li>";
}
