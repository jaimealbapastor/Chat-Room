<?php
session_start();

if (isset($_SESSION["client"])) {
    header("Location: ../index.php");
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="../css/signin-up.css">
    <script type="text/javascript" src="../js/signin-up.js"></script>
    <title>SignIn-SignUp</title>
</head>

<body>
    <h2>
        <?php
        if (isset($_SESSION["badsignup"])) {
            if ($_SESSION["badsignup"] == "1") echo "The email already exists";
            elseif ($_SESSION["badsignup"] == "2") echo "The name already exists";
        } elseif (isset($_SESSION["badsignup"])) {
            echo "Name/Email or Password incorrect";
        } else echo "Welcome to the Chat Application!";
        ?>
    </h2>
    <div class="container<?php if (isset($_SESSION["badsignup"])) echo " right-panel-active" ?>" id="container">
        <div class="form-container sign-up-container">
            <form action="do-signup.php" method="post">
                <h1>Create Account</h1>

                <input type="text" name="name" placeholder="Name" />
                <input type="text" name="email" placeholder="Email" />
                <input type="password" name="password" placeholder="Password" />
                <button id="submit-signup">Sign Up</button>
            </form>
        </div>
        <div class="form-container sign-in-container">
            <form action="do-signin.php" method="post">
                <h1>Sign in</h1>

                <input type=" text" name="name" placeholder="Name or Email" />
                <input type="password" name="password" placeholder="Password" />
                <!-- <a href="#">Forgot your password?</a> -->
                <button id="submit-signin">Sign In</button>
            </form>
        </div>
        <div class="overlay-container">
            <div class="overlay">
                <div class="overlay-panel overlay-left">
                    <h1>Welcome Back!</h1>
                    <p>
                        To keep connected with us please login with your personal info
                    </p>
                    <button class="ghost" id="signIn">Sign In</button>
                </div>
                <div class="overlay-panel overlay-right">
                    <h1>Hello, Friend!</h1>
                    <p>Enter your personal details and start journey with us</p>
                    <button class="ghost" id="signUp">Sign Up</button>
                </div>
            </div>
        </div>
    </div>

</body>

</html>