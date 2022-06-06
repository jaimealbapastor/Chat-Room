function void_f() { }

function on_failure(request) {
    document.getElementById("msg-test").innerHTML = "Ajax failure: " + request.responseText;
    document.getElementById("msg-test").style.visibility = "visible";
}

function toHHMM(date) {
    // -> formats time to HH:MM
    function checkTime(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
    return checkTime(date.getHours()) + ":" + checkTime(date.getMinutes());
}

function timeDiff(dt1, dt2) {
    // -> calculates the difference between 2 dates and returns a string
    const diff = (dt2 - dt1) / 1000; //sec
    if (diff < 60) return Math.round(diff) + " sec";
    if (diff < 3600) return Math.round(diff / 60) + " min";
    if (diff < 3600 * 24) return Math.round(diff / 3600) + " h";
    if (diff < 3600 * 24 * 7) return Math.round(diff / (3600 * 24)) + " days";
    if (diff < 3600 * 24 * 30) return Math.round(diff / (3600 * 24 * 7)) + " weeks";
    if (diff < 3600 * 24 * 365) return Math.round(diff / (3600 * 24 * 30)) + " months";
    return Math.round(diff / (3600 * 24 * 365)) + " years";
}

function msgHtml(msg, sender_name, time, is_response, is_first_msg) {
    const container = document.querySelector("section.chat .messages-chat");

    // delete previous time tag
    if (!is_first_msg) {
        if (container.lastChild !== null && container.lastChild.classList.contains("time")) {
            container.lastChild.remove();
        }
    }

    // create html for message

    // <div class="message">
    const message = document.createElement("div");
    message.classList.add("message");
    if (is_response || !is_first_msg) message.classList.add("text-only");

    //<div class="photo" style="background-image: url();">
    if (!is_response && is_first_msg) {
        const name_label = document.createElement("p");
        name_label.innerHTML = sender_name;
        message.appendChild(name_label);
    }

    // <p class="text">
    const text = document.createElement("p");
    text.className = "text";
    text.innerHTML = msg;

    // <div class="response">
    if (is_response) {
        const response = document.createElement("div");
        response.className = "response";
        response.appendChild(text);
        message.appendChild(response);
    } else {
        message.appendChild(text);
    }

    container.appendChild(message);

    // time
    const time_tag = document.createElement("p");
    time_tag.classList.add("time");
    if (is_response) time_tag.classList.add("response-time");

    time_tag.innerHTML = time;
    container.appendChild(time_tag);
}

function pannelAddChannel() {
    // <div class="discussion">
    const panel_add = document.createElement("div");
    panel_add.classList.add("discussion");
    panel_add.classList.add("add-channel");

    const textarea = document.createElement("input");
    textarea.type = "text";
    textarea.classList.add("write-message");
    textarea.placeholder = "Create channel...";

    // add image
    const icon = document.createElement("img");
    icon.src = "database/images/add.png";
    icon.onclick = () => {
        if (textarea.value) {
            const name = textarea.value;

            simpleAjax("php/ajax/put/new-channel.php", "post", "name=" + name + "&img= ", request => {
                const chat_id = request.responseText;
                const chat = { "is_channel": true, "name": name, "img": "" };
                const client_id = document.getElementById("client-id").getAttribute("value");

                simpleAjax("php/ajax/get/user-info.php", "post", "user-id=" + client_id, request => {
                    const client = JSON.parse(request.responseText);
                    sideChatHtml(chat, chat_id, client);
                }, on_failure);

            }, on_failure);
            textarea.value = "";
        }
    }

    // fit together the elements 
    panel_add.appendChild(textarea);
    panel_add.appendChild(icon);
    document.querySelector("section.discussions").appendChild(panel_add);
}

function oldMsg(discussion, client_id) {
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

                msgHtml(msg, sender_name, toHHMM(date), (id == client_id), (id != last_id));
                last_id = id;
            }
        }
    }, on_failure)
}

function updateNewMsg(discussion, client_id) {
    // Display new messages
    let chat = document.querySelector("section.chat .messages-chat");
    const nb_old = chat.querySelectorAll(".message").length;

    simpleAjax("php/ajax/get/chat-messages.php", "post", `chat-id=${discussion.getAttribute("chat-id")}`, request => {
        if (request.responseText) {
            let messages = JSON.parse(request.responseText);
            let last_id = client_id;

            for (let i = nb_old; i < messages.length; ++i) { // TODO verificar foreach

                [id, sender_name, date, msg] = messages[i].split(";"); // añadir let
                date = new Date(Date.parse(date));

                msgHtml(msg, sender_name, toHHMM(date), (id == client_id), (id != last_id));
                last_id = id;
            }
        }
    }, on_failure)
}

openChat = (discussion, client_id) => {
    // Select active chat
    let prev_selec = document.querySelector(".discussions div.message-active");
    if (prev_selec !== null) prev_selec.classList.remove("message-active");
    discussion.classList.add("message-active");

    // Display user profile on top
    document.querySelector("section.chat .header-chat p.name").innerHTML = discussion.querySelector(".name").innerHTML;

    oldMsg(discussion, client_id);
}

function sideChatHtml(chat, chat_id, client_id) {
    // -> display a single chat on the side

    // <div class="discussion message-active">
    let discussion = document.createElement("div");
    discussion.classList.add("discussion");
    discussion.setAttribute("chat-id", chat_id);
    discussion.onclick = () => { openChat(discussion, client_id) };

    // <div class="photo" style="background-image: url();">
    let photo = document.createElement("div");
    photo.className = "photo";
    photo.style.backgroundImage = "url(" + group_img + ")";

    // <div class="desc-contact"></div>
    let desc_contact = document.createElement("div");
    desc_contact.className = "desc-contact";

    // <p class="name">Dave Corlew</p>
    let name = document.createElement("p");
    name.className = "name";
    name.innerHTML = chat["name"];

    // <p class="message">Hello, how are you ?</p>
    let message = document.createElement("p");
    message.className = "message";

    // <div class="timer">42 min</div>
    let timer = document.createElement("div");
    timer.className = "timer";

    let param = "chat-id=" + chat_id;
    simpleAjax("php/ajax/get/last-msg-time.php", "post", param, request => {
        let [id, name, time, text] = request.responseText.split(";");

        if (text !== undefined) message.innerHTML = text;
        timer.innerHTML = "0 sec";
        if (time !== undefined) {
            timer.setAttribute("time", time);
            timer.innerHTML = timeDiff(Date.parse(time), Date.now());
        }
    }, on_failure)

    // fit together the elements 
    discussion.appendChild(photo);
    desc_contact.appendChild(name);
    desc_contact.appendChild(message);
    discussion.appendChild(desc_contact);
    discussion.appendChild(timer);
    document.querySelector("section.discussions").appendChild(discussion);

}

function checkActiveSideChats(client_id) {
    simpleAjax("php/ajax/get/all-chats.php", "post", "", request => {
        const chats = JSON.parse(request.responseText);

        Object.keys(chats).forEach(key => {
            if (!Object.keys(all_chats).includes(key)) {
                all_chats[key] = chats[key];

            } if (!Object.keys(active_chats).includes(key) && chats[key].members.includes(client_id)) {
                active_chats[key] = chats[key];
            }
        });
    }, on_failure);
}

function loadChatroom(client_id) {
    // -> load the whole chatroom

    // display panel to add channel
    pannelAddChannel();

    // fill chat lists in which client participates
    checkActiveSideChats(client_id);


    // wait for lists to fill out
    window.setTimeout(() => {

        // display existing chats on the left side
        Object.keys(active_chats).forEach(key => {
            sideChatHtml(active_chats[key], key, client_id);
        });
    }, 100)

}