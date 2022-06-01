<?php
// TODO do signup
session_start();
$_SESSION["user"] = "jaime";
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Chat app</title>

    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- CSS imported -->
    <link rel="stylesheet" href="../css/chat-room.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />

    <script type="text/javascript" src="../js/simpleajax.js"></script>
    <script type="text/javascript" src="../js/chat-room.js"></script>

</head>

<body>

    <div class="container">
        <div id="login">
            <?php echo "Loged as: {$_SESSION["user"]}"; ?>
        </div>
        <div id="msg-test">
        </div>
        <div class="row clearfix">
            <div class="col-lg-12">
                <div class="card chat-app">

                    <!-- People list-->
                    <div id="plist" class="people-list">

                        <!-- user loged -->
                        <div class="user-profile">
                            <?php
                            echo "<span id='user-id' value='{$_SESSION["user"]}'/>";
                            ?>
                        </div>

                        <!-- Search bar -->
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fa fa-search"></i></span>
                            </div>
                            <input type="text" class="form-control" placeholder="Search...">
                        </div>

                        <!-- Users -->
                        <ul class="list-unstyled chat-list mt-2 mb-0" id="side-chats">
                            <!-- here is going to be the list of chats -->
                        </ul>
                    </div>

                    <!-- Chat -->
                    <div class="chat">

                        <!-- Chat header -->
                        <div class="chat-header clearfix">
                            <div class="row">

                                <div class="col-lg-6">
                                    <a href="javascript:void(0);" data-toggle="modal" data-target="#view_info">
                                        <img src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="avatar">
                                    </a>
                                    <div class="chat-about">
                                        <h6 class="m-b-0">Aiden Chavez</h6>
                                        <small>Last seen: 2 hours ago</small>
                                    </div>
                                </div>

                                <div class="col-lg-6 hidden-sm text-right">
                                    <a href="javascript:void(0);" class="btn btn-outline-secondary"><i class="fa fa-camera"></i></a>
                                    <a href="javascript:void(0);" class="btn btn-outline-primary"><i class="fa fa-image"></i></a>
                                    <a href="javascript:void(0);" class="btn btn-outline-info"><i class="fa fa-cogs"></i></a>
                                    <a href="javascript:void(0);" class="btn btn-outline-warning"><i class="fa fa-question"></i></a>
                                </div>
                            </div>
                        </div>

                        <!-- Chat history -->
                        <div class="chat-history">
                            <ul class="m-b-0">
                                <li class="clearfix">
                                    <div class="message-data text-right">
                                        <span class="message-data-time">10:10 AM, Today</span>
                                        <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar">
                                    </div>
                                    <div class="message other-message float-right"> Hi Aiden, how are you? How is the project coming along? </div>
                                </li>
                                <li class="clearfix">
                                    <div class="message-data">
                                        <span class="message-data-time">10:12 AM, Today</span>
                                    </div>
                                    <div class="message my-message">Are we meeting today?</div>
                                </li>
                                <li class="clearfix">
                                    <div class="message-data">
                                        <span class="message-data-time">10:15 AM, Today</span>
                                    </div>
                                    <div class="message my-message">Project has been already finished and I have results to show you.</div>
                                </li>
                            </ul>
                        </div>

                        <!-- Type message -->
                        <div class="chat-message clearfix">
                            <div class="input-group mb-0">
                                <div class="input-group-prepend">
                                    <span class="input-group-text"><i class="fa fa-send"></i></span>
                                </div>
                                <input type="text" class="form-control" placeholder="Enter text here...">
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</body>

</html>