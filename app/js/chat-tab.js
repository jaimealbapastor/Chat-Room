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

function set_onclick_buttons(client_id) {
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
        msgHtml(text, client_name, toHHMM(date), true, false);

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

    // search bar
    const search_bar = document.querySelector(".searchbar input");
    search_bar.addEventListener("keyup", e => {
        let filter = search_bar.value.toLowerCase();
        console.log("here")
        if (filter) {
            document.querySelectorAll(".discussions .discussion[chat-id]").forEach(chat => {
                let name = chat.querySelector(".name").innerHTML.toLowerCase();
                if (!name.includes(filter)) {
                    chat.style.display = "none";
                } else {
                    chat.style.display = "flex";

                }
            });

        } else {
            document.querySelectorAll(".discussions .discussion[chat-id]").forEach(chat => {
                chat.style.display = "flex";
            })
        }
    });

    // menu buttons
    function selectMenu(selector) {

        const button = document.querySelector(selector);
        document.querySelector(".items .item-active").classList.remove("item-active");
        button.classList.add("item-active");
    }

    document.getElementById("maison").onclick = () => {
        selectMenu("#maison");
        loadChatroom(client_id);
    }
    document.getElementById("all-chats").onclick = () => {
        selectMenu("#all-chats");
    }
}

function checkNewMsg() {
    const discussion = document.querySelector(".discussions div.message-active");
    if (discussion != null) {
        const client_id = document.getElementById("client-id").value;
        updateNewMsg(discussion, client_id);
    }
}

const active_chats = [];
const all_chats = [];

window.onload = function () {
    // Ajax error tag
    document.getElementById("msg-test").style.color = "red";
    document.getElementById("msg-test").onclick = function () { this.style.visibility = "collapse"; }

    const client_id = document.getElementById("client-id").getAttribute("value");
    loadChatroom(client_id);
    set_onclick_buttons();

    window.setInterval(function () {
        document.querySelectorAll(".discussion .timer[time]").forEach(timer => {
            timer.innerHTML = timeDiff(Date.parse(timer.getAttribute("time")), Date.now());
        });
    }, 1000);

    window.setInterval(checkNewMsg, 1000);

    document.getElementById("signout").onclick = function () {
        window.location.href = "php/signout.php";
    }
}


