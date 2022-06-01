
const group_img = "../database/images/group.png";

function on_failure(request) {
    document.getElementById("msg-test").innerHTML = "Ajax failure: " + request.responseText;
    document.getElementById("msg-test").style.color = "red";
}

function load_chats(user_id) {

    function open_chat() {
        // Darken active chat
        let prev_selec = document.querySelector("#plist li[class='clearfix active']");
        if (prev_selec !== null) prev_selec.classList.remove("active");
        this.classList.add("active");

        // Display user profile on top
        document.querySelector("#top-info-chat img").src = this.querySelector("img").src;
        document.querySelector("#top-info-chat h6").innerHTML = this.querySelector(".name").innerHTML;
        document.querySelector("#top-info-chat small").innerHTML = this.querySelector(".status").innerHTML;


    }

    display_chats = request => {
        let user = JSON.parse(request.responseText);

        user["chats"].forEach(chat_id => {
            simpleAjax("get-data.php", "post", `function=c&chat-id=${chat_id}`, request => {
                let chat = JSON.parse(request.responseText);

                // <li class='clearfix' chat-id='$chat_id'>
                let li = document.createElement("li");
                li.classList.add("clearfix");
                li.setAttribute("chat-id", chat_id);
                li.onclick = open_chat;

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
                        img.src = "../database/images/" + other_user["profile-img"];
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

                //TODO añadir "active" detras de clearfix
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
    load_chats("jaime");

}


