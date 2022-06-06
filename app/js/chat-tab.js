const img_folder = "database/images/"
const group_img = img_folder + "group.png";

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function set_onclick_buttons() {
    function send_message() {

        const text = document.querySelector(".footer-chat .write-message").value;

        if (!text) return; // check if there is text

        const chat_selected = document.querySelector(".discussions div[class='discussion message-active']");
        if (chat_selected == null) return; // check if a chat is selected

        // save in database
        const chat_id = chat_selected.getAttribute("chat-id");
        let params = `chat-id=${chat_id}&msg=${text}`;
        simpleAjax("php/ajax/put/add-message.php", "post", params, void_f, on_failure);

        // display message
        const container = document.querySelector("section.chat .messages-chat");
        let date = new Date(Date.now());
        const client_name = document.getElementById("client-id").getAttribute("name");
        display_msg(text, client_name, toHHMM(date), true, false);

        // clear typed message
        document.querySelector(".footer-chat .write-message").value = "";

        // change last message
        chat_selected.querySelector(".message").innerHTML = text;
        chat_selected.querySelector(".timer").setAttribute("time", new Date(Date.now()).toUTCString());
    }

    // send message button
    document.querySelector(".send").onclick = send_message;
    document.querySelector("section.chat .write-message").addEventListener("keyup", e => {
        if (e.key == "Enter") {
            send_message();
        }
    });

    // create channel
    waitForElm(".add-channel img").then(elem => {
        elem.onclick = function () {
            let input = document.querySelector(".add-channel input.write-message");
            // TODO add image

            if (input.value) {
                let name = input.value;
                simpleAjax("php/ajax/put/new-channel.php", "post", "name=" + name + "&img= ", request => {
                    let chat_id = request.responseText;
                    let chat = { "is_channel": true, "name": name, "img": "" };
                    let client_id = document.getElementById("client-id").getAttribute("value");
                    simpleAjax("php/ajax/get/user-info.php", "post", "user-id=" + client_id, request => {
                        let client = JSON.parse(request.responseText);
                        display_discussion(chat, chat_id, client);
                    }, on_failure);
                }, on_failure);
                input.value = "";
            }
        }
    });
}

function check_new_messages() {
    simpleAjax("php/ajax/get/all-chats.php", "post",)
}


window.onload = function () {
    document.getElementById("msg-test").style.color = "red";
    document.getElementById("msg-test").onclick = function () { this.style.visibility = "collapse"; }

    let client_id = document.getElementById("client-id").getAttribute("value");
    load_chatroom(client_id);
    set_onclick_buttons();

    window.setInterval(function () {
        document.querySelectorAll(".discussion .timer[time]").forEach(timer => {
            timer.innerHTML = diff_time(Date.parse(timer.getAttribute("time")), Date.now());
        });
    }, 1000);

    document.getElementById("signout").onclick = function () {
        window.location.href = "php/signout.php";
    }
}


