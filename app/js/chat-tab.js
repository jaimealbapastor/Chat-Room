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
        checkNewMsg();

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
    function selectMenu(menu_elem) {
        if (!menu_elem.className.includes("item-active")) {
            document.querySelector(".items .item-active").classList.remove("item-active");
            menu_elem.classList.add("item-active");
        }
    }
    //  onclick
    const home_menu = document.getElementById("home");
    home_menu.addEventListener("click", event => {
        selectMenu(home_menu);
        loadChannels(client_id, active_chats);
        clearChat();
    });
    const all_chats_menu = document.getElementById("all-chats");
    all_chats_menu.addEventListener("click", event => {
        selectMenu(all_chats_menu);
        loadChannels(client_id, all_chats);
        clearChat();
    });

}

function checkNewMsg() {
    const discussion = document.querySelector(".discussions div.message-active");
    if (discussion != null && discussion.style.display !== "none") {

        const client_id = document.getElementById("client-id").getAttribute("value");
        updateNewMsg(discussion, client_id);
    }


    let msg_h = document.querySelectorAll(".messages-chat > .message").length * 62;
    let time_h = document.querySelectorAll(".messages-chat > .time").length * 25;
    let height = 90 + msg_h + time_h + 80 + 20;

    if (height > 500) {
        document.querySelector(".container").style.height = height + "px";
        document.querySelector(".menu").style.height = height + "px";
        document.querySelector(".discussions").style.height = height + "px";
    } else {
        document.querySelector(".container").style.height = "700px";
        document.querySelector(".menu").style.height = "700px"
        document.querySelector(".discussions").style.height = "700px"
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
    set_onclick_buttons(client_id);

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


