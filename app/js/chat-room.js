const img_folder = "../database/images/"
const group_img = img_folder + "group.png";

function on_failure(request) {
    document.getElementById("msg-test").innerHTML = "Ajax failure: " + request.responseText;
    document.getElementById("msg-test").style.visibility = "visible";
}
function test(txt) {
    document.getElementById("msg-test").innerHTML = "Testing: " + txt;
    document.getElementById("msg-test").style.visibility = "visible";
}

function load_chatroom(user_id) {

    open_chat = (side_chat, user) => {
        // Darken active chat
        let prev_selec = document.querySelector("#plist li[class='clearfix active']");
        if (prev_selec !== null) prev_selec.classList.remove("active");
        side_chat.classList.add("active");

        // Display user profile on top
        document.querySelector("#top-info-chat img").src = side_chat.querySelector("img").src;
        document.querySelector("#top-info-chat h6").innerHTML = side_chat.querySelector(".name").innerHTML;
        document.querySelector("#top-info-chat small").innerHTML = side_chat.querySelector(".status").innerHTML;

        // Display old messages
        let ul = document.querySelector(".chat-history ul.m-b-0");
        ul.innerHTML = "";
        simpleAjax("get-data.php", "post", `function=m&chat-id=${side_chat.getAttribute("chat-id")}`, request => {
            if (request.responseText) {
                let messages = JSON.parse(request.responseText);

                messages.forEach(msg => {
                    [id, time, msg] = msg.split(";");
                    // create html for message
                    let is_my_msg = (id == user_id);

                    // <li class="clearfix">
                    let li = document.createElement("li");
                    li.classList.add("clearfix");

                    // <div class="message-data text-right">
                    let msg_data = document.createElement("div");
                    msg_data.classList.add("message-data"); // ICI IMPORTANT -------
                    if (is_my_msg) msg_data.classList.add("text-right");

                    // <span class="message-data-time">10:10 AM, Today</span>
                    let data_time = document.createElement("span");
                    data_time.className = "message-data-time";
                    data_time.innerHTML = time; // TODO formatear hora
                    msg_data.appendChild(data_time);

                    // <img src="..." alt="avatar"></img>
                    if (is_my_msg) {
                        let img = document.createElement("img");
                        img.src = img_folder + user["profile-img"];
                        img.alt = "avatar";
                        msg_data.appendChild(img);
                    }
                    // <div class="message other-message float-right"></div>
                    let msg_tag = document.createElement("div");
                    if (is_my_msg) msg_tag.className = "message other-message float-right";
                    else msg_tag.className = "message my-message";
                    msg_tag.innerHTML = msg;

                    // fit together the elements
                    li.appendChild(msg_data);
                    li.appendChild(msg_tag);
                    ul.appendChild(li);
                })
            }


        }, on_failure)

    }

    display_chats = request => {
        let user = JSON.parse(request.responseText);

        let user_hidden_info = document.getElementById("user-id");
        user_hidden_info.setAttribute("profile-img", user["profile-img"]);

        // display existing chats on the left side
        user["chats"].forEach(chat_id => {
            simpleAjax("get-data.php", "post", `function=c&chat-id=${chat_id}`, request => {
                let chat = JSON.parse(request.responseText);

                // <li class='clearfix' chat-id='$chat_id'>
                let li = document.createElement("li");
                li.classList.add("clearfix");
                li.setAttribute("chat-id", chat_id);
                li.onclick = () => { open_chat(li, user) };

                // <img src = '$img' alt = 'avatar'>
                let img = document.createElement("img");
                img.alt = "avatar";

                // <div class='about'>
                let about = document.createElement("div");
                about.className = "about";

                // <div class='name'>$UserName</div>
                let name = document.createElement("div");
                name.className = "name";

                // <div class='status'>$status</div>
                let status = document.createElement("div");
                status.className = "status";

                if (chat["is_group"]) {
                    name.innerHTML = chat["name"];
                    if (chat["img"] == "") img.src = group_img;

                    else img.src = chat["img"];
                    status.innerHTML = chat["description"];

                } else {
                    // <i class='fa fa-circle {$user["status"]}'></i>
                    let i = document.createElement("i");
                    i.className = "fa fa-circle";
                    status.appendChild(i);

                    // select the other user's profile pic
                    let param;
                    if (chat["members"][0] != user_id) param = `function=i&user-id=${chat["members"][0]}`;
                    else param = `function=i&user-id=${chat["members"][1]}`;

                    simpleAjax("get-data.php", "post", param, request => {
                        let other_user = JSON.parse(request.responseText);

                        name.innerHTML = other_user["personal"]["first-name"] + " " + other_user["personal"]["last-name"];
                        img.src = img_folder + other_user["profile-img"];
                        i.classList.add(other_user["status"]);

                        if (other_user["status"] == "online") status.innerHTML += "online";
                        else status.innerHTML += " left " + other_user["last-connection"];// TODO change into: left x minutes ago
                    }, on_failure)
                }

                // fit together the elements 
                about.appendChild(name);
                about.appendChild(status);
                li.appendChild(img);
                li.appendChild(about);
                document.getElementById("side-chats").appendChild(li);

                //TODO change chat-id <- not secure

                //  <li class='clearfix' chat-id='$chat_id'> 
                //      <img src = '$img' alt = 'avatar'>
                //      <div class='about'>
                //          <div class='name'>$name</div>
                //          <div class='status'> <i class='fa fa-circle $user["status"]'></i> $status </div>
                //      </div>
                //  </li >

            }, on_failure)

        });
    }

    // get info about the user loged
    let params = `function=i&user-id=${user_id}`;
    simpleAjax("get-data.php", "post", params, display_chats, on_failure);
}


window.onload = function () {
    document.getElementById("msg-test").style.color = "red";
    document.getElementById("msg-test").onclick = function () { this.style.visibility = "collapse"; }

    load_chatroom("jaime");
}


