const img_folder = "database/images/"
const group_img = img_folder + "group.png";

function void_f() { }

function on_failure(request) {
    document.getElementById("msg-test").innerHTML = "Ajax failure: " + request.responseText;
    document.getElementById("msg-test").style.visibility = "visible";
}
function test(txt) {
    document.getElementById("msg-test").innerHTML = "Testing: " + txt;
    document.getElementById("msg-test").style.visibility = "visible";
}
function toHHMM(date) {
    function checkTime(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
    return checkTime(date.getHours()) + ":" + checkTime(date.getMinutes());
}

function display_msg(msg, time, container, is_response, is_first_msg) {
    // delete time tag
    if (!is_first_msg) {
        if (container.lastChild !== null && container.lastChild.classList.contains("time")) {
            container.lastChild.remove();
        }
    }

    // create html for message

    // <div class="message">
    let message = document.createElement("div");
    message.classList.add("message");
    if (is_response || !is_first_msg) message.classList.add("text-only");

    //<div class="photo" style="background-image: url();">
    if (!is_response) {
        let photo = document.querySelector("section.discussions .message-active .photo").cloneNode(true);
        message.appendChild(photo);
    }

    // <p class="text">
    let text = document.createElement("p");
    text.className = "text";
    text.innerHTML = msg;

    // <div class="response">
    if (is_response) {
        let response = document.createElement("div");
        response.className = "response";
        response.appendChild(text);
        message.appendChild(response);
    } else {
        message.appendChild(text);
    }

    container.appendChild(message);

    // time
    let time_tag = document.createElement("p");
    time_tag.classList.add("time");
    if (is_response) time_tag.classList.add("response-time");
    let date = new Date();
    date.setTime(Date.parse(time))
    time_tag.innerHTML = toHHMM(date);
    container.appendChild(time_tag);
}

function load_chatroom(user_id) {

    open_chat = (discussion, client_id) => {
        // Select active chat
        let prev_selec = document.querySelector(".discussions div.message-active");
        if (prev_selec !== null) prev_selec.classList.remove("message-active");
        discussion.classList.add("message-active");

        // Display user profile on top
        document.querySelector("section.chat .header-chat p.name").innerHTML = discussion.querySelector(".name").innerHTML;

        // Display old messages
        let chat = document.querySelector("section.chat .messages-chat");
        chat.innerHTML = "";
        simpleAjax("php/get-data.php", "post", `function=m&chat-id=${discussion.getAttribute("chat-id")}`, request => {
            if (request.responseText) {
                let messages = JSON.parse(request.responseText);
                let last_id = client_id;

                for (let i = 0; i < messages.length; ++i) { // TODO verificar foreach
                    [id, time, msg] = messages[i].split(";");
                    display_msg(msg, time, chat, (id == client_id), (id != last_id));
                    last_id = id;
                }
            }


        }, on_failure)

    }

    function diff_time(dt1, dt2) {
        let diff = (dt2 - dt1) / 1000; //sec
        if (diff < 60) return Math.round(diff) + " sec";
        if (diff < 3600) return Math.round(diff / 60) + " min";
        if (diff < 3600 * 24) return Math.round(diff / 3600) + " h";
        if (diff < 3600 * 24 * 7) return Math.round(diff / (3600 * 24)) + " days";
        if (diff < 3600 * 24 * 30) return Math.round(diff / (3600 * 24 * 7)) + " weeks";
        if (diff < 3600 * 24 * 365) return Math.round(diff / (3600 * 24 * 30)) + " months";
        return Math.round(diff / (3600 * 24 * 365)) + " years";
    }

    display_chats = request => {
        let user = JSON.parse(request.responseText);    // TODO change let -> const

        let user_hidden_tag = document.getElementById("user-id");
        user_hidden_tag.setAttribute("profile-img", user["profile-img"]);

        // display existing chats on the left side
        user["chats"].forEach(chat_id => {
            simpleAjax("php/get-data.php", "post", `function=c&chat-id=${chat_id}`, request => {
                let chat = JSON.parse(request.responseText);

                // <div class="discussion message-active">
                let discussion = document.createElement("div");
                discussion.classList.add("discussion");
                discussion.setAttribute("chat-id", chat_id);
                discussion.onclick = () => { open_chat(discussion, user["user-id"], user["profile-img"]) };

                // <div class="photo" style="background-image: url();">
                let photo = document.createElement("div");
                photo.className = "photo";

                // <div class="desc-contact"></div>
                let desc_contact = document.createElement("div");
                desc_contact.className = "desc-contact";

                // <p class="name">Dave Corlew</p>
                let name = document.createElement("p");
                name.className = "name";

                // <p class="message">Hello, how are you ?</p>
                let message = document.createElement("p");
                message.className = "message";

                // <div class="timer">42 min</div>
                let timer = document.createElement("div");
                timer.className = "timer";

                if (chat["is_group"]) {
                    // TODO hacer esto
                    name.innerHTML = chat["name"];

                    if (chat["img"] == "") photo.style.backgroundImage = "url(" + group_img + ")";
                    else photo.style.backgroundImage = "url(" + chat["img"] + ")";

                } else {
                    // select the other user's profile photo
                    let param;
                    if (chat["members"][0] != user_id) param = `function=i&user-id=${chat["members"][0]}`;
                    else param = `function=i&user-id=${chat["members"][1]}`;

                    simpleAjax("php/get-data.php", "post", param, request => {
                        let contact = JSON.parse(request.responseText);

                        name.innerHTML = contact["personal"]["first-name"] + " " + contact["personal"]["last-name"];
                        photo.style.backgroundImage = "url(" + img_folder + contact["profile-img"] + ")";

                        if (contact["online"]) {
                            // <div class="online"></div>
                            let online = document.createElement("div");
                            online.className = "online";
                            photo.appendChild(online);
                        }
                    }, on_failure);
                }

                let param = "function=l&chat-id=" + chat_id;
                simpleAjax("php/get-data.php", "post", param, request => {
                    [id, time, text] = request.responseText.split(";");

                    if (text !== undefined) message.innerHTML = text;
                    timer.innerHTML = "0 sec";
                    if (time !== undefined) {
                        timer.innerHTML = diff_time(Date.parse(time), Date.now())
                    }
                }, on_failure)

                // fit together the elements 
                discussion.appendChild(photo);
                desc_contact.appendChild(name);
                desc_contact.appendChild(message);
                discussion.appendChild(desc_contact);
                discussion.appendChild(timer);
                document.querySelector("section.discussions").appendChild(discussion);

                //TODO change chat-id <- not secure

                //  <div class="discussion message-active">
                //      <div class="photo" style="background-image: url(../database/images/jaime-profile.jpg);">
                //          <div class="online"></div>
                //      </div>
                //      <div class="desc-contact">
                //          <p class="name">Megan Leib</p>
                //          <p class="message">9 pm at the bar if possible</p>
                //      </div>
                //      <div class="timer">12 sec</div>
                //   </div>

            }, on_failure)

        });
    }

    // get info about the user loged
    let params = `function=i&user-id=${user_id}`;
    simpleAjax("php/get-data.php", "post", params, display_chats, on_failure);
}

function set_onclick_buttons() {
    function send_message() {
        let text = document.querySelector(".write-message").value;

        if (!text) return; // check if there is text

        let chat_selected = document.querySelector(".discussions div[class='discussion message-active']");
        if (chat_selected == null) return; // check if a chat is selected

        // save in database
        let chat_id = chat_selected.getAttribute("chat-id");
        let user_id = document.getElementById("user-id").getAttribute("value");

        let params = `function=m&chat-id=${chat_id}&user-id=${user_id}&msg=${text}`;
        simpleAjax("php/put-data.php", "post", params, void_f, on_failure);

        // display message
        let container = document.querySelector("section.chat .messages-chat");
        let date = new Date;
        date.setTime(Date.now());
        date = toHHMM(date);
        display_msg(text, date, container, true, false);

        // clear typed message
        document.querySelector(".write-message").value = "";

        // change last message
        chat_selected.querySelector(".message").innerHTML = text;
    }
    // send message button
    document.querySelector(".send").onclick = send_message;
    document.querySelector(".write-message").addEventListener("keyup", e => {
        if (e.key == "Enter") {
            send_message();
        }
    })

}


window.onload = function () {
    document.getElementById("msg-test").style.color = "red";
    document.getElementById("msg-test").onclick = function () { this.style.visibility = "collapse"; }

    load_chatroom("jaime");
    set_onclick_buttons();
}


