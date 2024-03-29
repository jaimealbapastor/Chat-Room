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

function clearChat() {
    document.querySelector(".chat .messages-chat").innerHTML = "";
    document.querySelector(".header-chat p.name").innerHTML = "";
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

    //  <div class='message'>
    //      <p>sender_name</p>
    //      <div class='response'>
    //          <p class='text'></p>
    //      </div>
    //  </div>
    //  <p class='time response-time'>


    const message = document.createElement("div");
    message.classList.add("message");
    if (is_response || !is_first_msg) message.classList.add("text-only");


    if (!is_response && is_first_msg) {
        const name_label = document.createElement("p");
        name_label.innerHTML = sender_name;
        message.appendChild(name_label);
    }

    const text = document.createElement("p");
    text.className = "text";
    text.innerHTML = formatMsg(msg);

    if (is_response) {
        const response = document.createElement("div");
        response.className = "response";
        response.appendChild(text);
        message.appendChild(response);
    } else {
        message.appendChild(text);
    }

    container.appendChild(message);

    const time_tag = document.createElement("p");
    time_tag.classList.add("time");
    if (is_response) time_tag.classList.add("response-time");

    time_tag.innerHTML = time;
    container.appendChild(time_tag);
}

function addChannel(textarea) {
    if (textarea.value) {
        const name = textarea.value;

        simpleAjax("php/ajax/put/new-channel.php", "post", "name=" + name, request => {
            const chat_id = request.responseText;
            const client_id = document.getElementById("client-id").getAttribute("value");

            sideChatHtml(chat_id, client_id);
        }, on_failure);

        textarea.value = "";
    }
}

function pannelAddChannel() {

    //  <div class='discussion add-channel'>
    //      <input type='text' class='write-message'>Create channel...</input>
    //      <img scr='database/images/add.png' onclick=addChannel/>
    //  </div>

    const panel_add = document.createElement("div");
    panel_add.classList.add("discussion");
    panel_add.classList.add("add-channel");

    const textarea = document.createElement("input");
    textarea.type = "text";
    textarea.classList.add("write-message");
    textarea.placeholder = "Create channel...";

    textarea.addEventListener("keyup", event => {
        if (event.key == "Enter") {
            addChannel(textarea);
        }
    });

    const icon = document.createElement("img");
    icon.src = "database/images/add.png";

    icon.onclick = () => {
        addChannel(textarea);
    }

    // fit together the elements 
    panel_add.appendChild(textarea);
    panel_add.appendChild(icon);
    document.querySelector("section.discussions .search").after(panel_add);
}

function clickHashtag(button, chat_id) {
    const discussion = document.querySelector(".discussion[chat-id='" + chat_id + "']");
    if (discussion != null) link.onclick()

}

function formatMsg(msg) {
    msg += " ";
    const closers = [];
    const i_openers = [];

    let c;
    let last = "";
    let data;
    let html;
    let i_opener;
    let i_closer;
    for (i = 0; i < msg.length; i++) {

        c = msg.charAt(i);
        if (msg.length > 200) return "falloo";

        if (closers[closers.length - 1] == last + c) {   // check if there is a convenient closer

            switch (closers.pop()) {
                // let c = last + c;    

                case "]":   // [https://www.site.com|Mon site]
                    i_opener = i_openers.pop();
                    i_closer = i;

                    data = msg.substring(i_opener + 1, i_closer).split("|");    // [https://www.site.com, Mon site]

                    if (data.length == 1) {
                        html = "<a href=" + data[0] + ">" + data[0] + "</a>";
                    } else {
                        html = "<a href=" + data[0] + ">" + data[1] + "</a>";
                    }

                    msg = msg.substring(0, i_openers) + html + msg.substring(i_closer + 1);
                    i += html.length - msg.substring(i_opener, i_closer + 1).length;

                    break;

                case "}":   // {blabla ''italique''}
                    i_opener = i_openers.pop();
                    i_closer = i;

                    data = msg.substring(i_opener + 1, i_closer);    // blabla ''italique''

                    msg = msg.substring(0, i_openers) + data + msg.substring(i_closer + 1);
                    i -= 2;

                    break;

                case "''":   // [https://www.site.com|Mon site]

                    i_opener = i_openers.pop();
                    i_closer = i;

                    html = "<i>" + msg.substring(i_opener + 2, i_closer - 1) + "</i>";    // [https://www.site.com, Mon site]
                    msg = msg.substring(0, i_opener) + html + msg.substring(i_closer + 1, msg.length);
                    i += html.length - msg.substring(i_opener, i_closer + 1).length;

                    break;
                case "'''":   // [https://www.site.com|Mon site]
                    i_opener = i_openers.pop();
                    i_closer = i;

                    html = "<b>" + msg.substring(i_opener + 3, i_closer - 2) + "</b>";    // [https://www.site.com, Mon site]
                    msg = msg.substring(0, i_opener) + html + msg.substring(i_closer + 1, msg.length);
                    i += html.length - msg.substring(i_opener, i_closer + 1).length;

                    break;
                case " ":   // #channel
                    i_opener = i_openers.pop();
                    i_closer = i;

                    data = msg.substring(i_opener, i_closer);    //chat-id
                    // let discussion = document.querySelector(`.discussion[chat-id=${data}]`);

                    html = "<div onclick='clickHashtag(this,\"" + data.substring(1) + "\")'>" + data + "</div>";
                    msg = msg.substring(0, i_openers) + html + msg.substring(i_closer);
                    i += html.length - msg.substring(i_opener, i_closer + 1).length;

                    break;
                default:
                    break;
            }
            last = "";


        } else if (closers[closers.length - 1] != "}") {   // if not, create a opener

            switch (c) {
                case "[":
                    closers.push("]");
                    i_openers.push(i);
                    last = "";

                    break;
                case "{":
                    closers.push("}");
                    i_openers.push(i);
                    last = "";
                    break;
                case "'":
                    if (last == "'''") {
                        closers.push(last);
                        i_openers.push(i - last.length);
                        last = "";
                    }

                    last += c;
                    break;
                case "#":
                    closers.push(" ");
                    i_openers.push(i);
                    last = "";
                    break;
                default:
                    // c is a character other than '
                    if (last == "''" || last == "'''") {
                        closers.push(last);
                        i_openers.push(i - last.length);
                    }
                    last = "";
                    break;
            }
        }
    }
    return msg;
}

function updateNewMsg(discussion, client_id) {
    // Display new messages
    let chat = document.querySelector("section.chat .messages-chat");
    const nb_old = chat.querySelectorAll(".message").length;

    simpleAjax("php/ajax/get/chat-messages.php", "post", "chat-id=" + discussion.getAttribute("chat-id"), request => {
        if (request.responseText) {
            let messages = JSON.parse(request.responseText);
            let last_id = client_id;

            for (let i = nb_old; i < messages.length; ++i) { // TODO verificar foreach

                [sender_id, date, msg] = messages[i].split(";"); // añadir let
                date = new Date(Date.parse(date));

                msgHtml(msg, sender_id, toHHMM(date), (sender_id == client_id), (sender_id != last_id));
                last_id = sender_id;
            }
        }
    }, on_failure);
}

function oldMsg(discussion, client_id) {
    // Display old messages
    let chat = document.querySelector("section.chat .messages-chat");
    chat.innerHTML = "";

    updateNewMsg(discussion, client_id);
}

function selectDiscussion(discussion) {
    let prev_selec = document.querySelector(".discussions div.message-active");
    if (prev_selec !== null) prev_selec.classList.remove("message-active");
    discussion.classList.add("message-active");
}

function openChat(discussion, client_id) {
    // Select active chat
    selectDiscussion(discussion);

    // Display user profile on top
    document.querySelector("section.chat .header-chat p.name").innerHTML = discussion.querySelector(".name").innerHTML;

    oldMsg(discussion, client_id);
}

function sideChatHtml(chat_id, client_id) { //----------------------------
    // -> display a single chat on the side
    const menu_selected = document.querySelector(".items .item-active");

    // <div class="discussion message-active">
    let discussion = document.createElement("div");
    discussion.classList.add("discussion");
    discussion.setAttribute("chat-id", chat_id);
    discussion.style.display = "flex";
    discussion.onclick = () => {
        if (menu_selected.id == "home") openChat(discussion, client_id);
    };

    // <div class="photo" style="background-image: url();">
    let photo = document.createElement("div");
    photo.className = "photo";
    photo.style.backgroundImage = "url(" + group_img + ")";

    // mouseover
    photo.addEventListener("mouseout", event => {
        photo.style.backgroundImage = "url(" + group_img + ")";
        photo.onclick = void_f;
    });


    if (menu_selected.id == "home") {
        photo.addEventListener("mouseover", event => {
            photo.style.backgroundImage = "url(" + img_folder + "exit.png)";

        });
        photo.addEventListener("click", event => {
            if (active_chats.includes(chat_id)) {
                active_chats.splice(active_chats.indexOf(chat_id), 1);
                simpleAjax("php/ajax/put/delete-user-in-chat.php", "post", "chat-id=" + chat_id, void_f, on_failure);
            }

            if (discussion.className = "discussion message-active") {
                discussion.classList.remove("message-active");
            }
            discussion.style.display = "none";
            clearChat();

        });

    } else if (menu_selected.id == "all-chats") {
        photo.addEventListener("mouseover", event => {
            photo.style.backgroundImage = "url(" + img_folder + "join.png)";
        });
        photo.addEventListener("click", event => {
            if (!active_chats.includes(chat_id)) {
                active_chats.push(chat_id);
                simpleAjax("php/ajax/put/user-in-chat.php", "post", "chat-id=" + chat_id, void_f, on_failure);
            }
        });
    }


    // <div class="desc-contact"></div>
    let desc_contact = document.createElement("div");
    desc_contact.className = "desc-contact";

    // <p class="name">Dave Corlew</p>
    let name = document.createElement("p");
    name.className = "name";
    name.innerHTML = chat_id;

    // <p class="message">Hello, how are you ?</p>
    let message = document.createElement("p");
    message.className = "message";

    // <div class="timer">42 min</div>
    let timer = document.createElement("div");
    timer.className = "timer";

    let param = "chat-id=" + chat_id;
    simpleAjax("php/ajax/get/last-msg-time.php", "post", param, request => {
        let [id, time, text] = request.responseText.split(";");

        if (text !== undefined) message.innerHTML = formatMsg(text);
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
    document.querySelector("section.discussions .joined-chats").appendChild(discussion);
}

function checkActiveSideChats(client_id) {
    simpleAjax("php/ajax/get/all-chats.php", "post", "", request => {
        const chats = JSON.parse(request.responseText);

        Object.keys(chats).forEach(chat_id => {
            if (!all_chats.includes(chat_id)) {
                all_chats.push(chat_id);

            } if (!active_chats.includes(chat_id) && chats[chat_id].includes(client_id)) {
                active_chats.push(chat_id);
            }
        });
    }, on_failure);
}

function loadChannels(client_id, channels) {
    // fill chat lists in which client participates
    checkActiveSideChats(client_id);

    // clear previous chats
    document.querySelector("section.discussions .joined-chats").innerHTML = "";

    // wait for lists to fill out
    window.setTimeout(() => {

        // display existing chats on the left side
        channels.forEach(chat_id => {
            sideChatHtml(chat_id, client_id);
        });
    }, 100);
}

function loadChatroom(client_id) {
    // -> load the whole chatroom

    // display panel to add channel
    pannelAddChannel();

    loadChannels(client_id, active_chats);
}