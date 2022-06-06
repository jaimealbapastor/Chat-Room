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

function display_msg(msg, sender_name, time, is_response, is_first_msg) {
    const container = document.querySelector("section.chat .messages-chat");

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
    if (!is_response && is_first_msg) {
        // const name_label = document.querySelector("section.discussions .message-active .name").cloneNode(true);
        const name_label = document.createElement("p");
        name_label.innerHTML = sender_name;
        message.appendChild(name_label);
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

    time_tag.innerHTML = time;
    container.appendChild(time_tag);
}

function display_panel_add() {
    // <div class="discussion">
    let panel_add = document.createElement("div");
    panel_add.classList.add("discussion");
    panel_add.classList.add("add-channel");
    panel_add.onclick = () => {
        // TODO add discussion to database 
    };

    // TODO add textarea
    let texarea = document.createElement("input");
    texarea.type = "text";
    texarea.classList.add("write-message");
    texarea.placeholder = "Create channel...";

    // upload image
    let img = document.createElement("input");
    img.type = "file";


    // add image
    let icon = document.createElement("img");
    icon.src = "database/images/add.png";

    // let photo = document.createElement("div");
    // photo.className = "photo";
    // photo.style.backgroundImage = "url(database/images/add.png)";

    // fit together the elements 
    panel_add.appendChild(texarea);
    panel_add.appendChild(icon);
    document.querySelector("section.discussions").appendChild(panel_add);
}

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
    simpleAjax("php/ajax/get/chat-messages.php", "post", `chat-id=${discussion.getAttribute("chat-id")}`, request => {
        if (request.responseText) {
            let messages = JSON.parse(request.responseText);
            let last_id = client_id;

            for (let i = 0; i < messages.length; ++i) { // TODO verificar foreach

                [id, sender_name, date, msg] = messages[i].split(";"); // añadir let
                date = new Date(Date.parse(date));

                display_msg(msg, sender_name, toHHMM(date), (id == client_id), (id != last_id));
                last_id = id;
            }
        }
    }, on_failure)
}

function display_discussion(chat, chat_id, client_id) {
    // -> display a single chat on the side

    // <div class="discussion message-active">
    let discussion = document.createElement("div");
    discussion.classList.add("discussion");
    discussion.setAttribute("chat-id", chat_id);
    discussion.onclick = () => { open_chat(discussion, client_id) }; // TODO aqui

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

    if (chat["is_channel"]) {
        // TODO hacer esto
        name.innerHTML = chat["name"];
        photo.style.backgroundImage = "url(" + group_img + ")";

    } else {
        // select the other user's profile photo
        let param;
        if (chat["members"][0] != client_id) param = `user-id=${chat["members"][0]}`;
        else param = `user-id=${chat["members"][1]}`;

        simpleAjax("php/ajax/get/user-info.php", "post", param, request => {
            let contact = JSON.parse(request.responseText);

            name.innerHTML = contact.name;
            photo.style.backgroundImage = "url(" + img_folder + "user.png)";
        }, on_failure);
    }

    let param = "chat-id=" + chat_id;
    simpleAjax("php/ajax/get/last-msg-time.php", "post", param, request => {
        let [id, name, time, text] = request.responseText.split(";");

        if (text !== undefined) message.innerHTML = text;
        timer.innerHTML = "0 sec";
        if (time !== undefined) {
            timer.setAttribute("time", time);
            timer.innerHTML = diff_time(Date.parse(time), Date.now());
        }
    }, on_failure)

    // fit together the elements 
    discussion.appendChild(photo);
    desc_contact.appendChild(name);
    desc_contact.appendChild(message);
    discussion.appendChild(desc_contact);
    discussion.appendChild(timer);
    document.querySelector("section.discussions").appendChild(discussion);

    //TODO change chat-id <- not secures

}
function load_chatroom(client_id) {
    // -> load the whole chatroom

    // display panel to add channel
    display_panel_add();

    // get chats in which client participates
    simpleAjax("php/ajax/get/all-chats.php", "post", "", request => {

        // display existing chats on the left side
        const chats = JSON.parse(request.responseText);
        Object.keys(chats).forEach(key => {
            //if (chats[key]["members"].includes(client_id)) // TODO add if

            display_discussion(chats[key], key, client_id);
        });

    }, on_failure);

}