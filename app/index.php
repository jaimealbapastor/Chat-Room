<?php
session_start();
if (!isset($_SESSION["client"])) header("Location: php/signin-up.php");

?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Chat App</title>
  <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'>
  <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Montserrat'>
  <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha.6/css/bootstrap.min.css'>
  <link rel="stylesheet" href="css/index.css">

  <script type="text/javascript" src="js/simpleajax.js"></script>
  <script type="text/javascript" src="js/display.js"></script>
  <script type="text/javascript" src="js/chat-tab.js"></script>

</head>

<body>

  <body>

    <!-- user_id -->
    <div>
      <?php
      echo "<span id='client-id' value='{$_SESSION["client"]}'/>";
      ?>
    </div>
    <!-- logged as -->
    <p>
      <?php echo "Loged as: {$_SESSION["client"]}"; ?>
    </p>

    <div id="msg-test"></div>

    <div class="container">
      <div class="row">

        <!-- Navigation Menu -->
        <nav class="menu">
          <ul class="items">
            <!-- <li class="item">
              <i class="fa fa-home" aria-hidden="true"></i>
            </li> -->
            <li class="item user-tab">
              <i class="fa fa-user" aria-hidden="true"></i>
            </li>
            <li class="item chat-tab item-active">
              <i class="fa fa-commenting" aria-hidden="true"></i>
            </li>
            <li class="item create-tab">
              <i class="fa fa-pencil" aria-hidden="true"></i>
            </li>
            <!-- <li class="item">
              <i class="fa fa-file" aria-hidden="true"></i>
            </li> -->
            <li class="item" id="signout">
              <i class="fa fa-cog" aria-hidden="true"></i>
            </li>
          </ul>
        </nav>


        <section class="discussions">
          <!-- Search Bar -->
          <div class="discussion search">
            <div class="searchbar">
              <i class="fa fa-search" aria-hidden="true"></i>
              <input type="text" placeholder="Search..."></input>
            </div>
          </div>
          <!-- Discussions -->

        </section>

        <!-- Active Chat -->
        <section class="chat">

          <!-- Contact Info -->
          <div class="header-chat">
            <i class="icon fa fa-user-o" aria-hidden="true"></i>
            <p class="name"></p>
            <i class="icon clickable fa fa-ellipsis-h right" aria-hidden="true"></i>
          </div>

          <!-- Messages -->
          <div class="messages-chat">

          </div>
          <!-- send message -->
          <div class="footer-chat">
            <i class="icon fa fa-smile-o clickable" style="font-size:25pt;" aria-hidden="true"></i>
            <input type="text" class="write-message" placeholder="Type your message here"></input>
            <i class="icon send fa fa-paper-plane-o clickable" aria-hidden="true"></i>
          </div>
        </section>
      </div>
    </div>
  </body>


</body>

</html>