const img_folder = "database/images/"
const group_img = img_folder + "group.png";



function set_onclick_buttons() {
    function send_message() {

        let text = document.querySelector(".footer-chat .write-message").value;

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
        let date = new Date(Date.now());
        display_msg(text, toHHMM(date), container, true, false);

        // clear typed message
        document.querySelector(".footer-chat .write-message").value = "";

        // change last message
        chat_selected.querySelector(".message").innerHTML = text;
        chat_selected.querySelector(".timer").setAttribute("time", new Date(Date.now()).toUTCString());
    }

    // send message button
    document.querySelector(".send").onclick = send_message;
    document.querySelector(".write-message").addEventListener("keyup", e => {
        if (e.key == "Enter") {
            send_message();
        }
    })
    document.querySelectorAll(".items .item").forEach(tab => {
        tab.onclick = function () {
            // TODO add functions
        }
    })

}


window.onload = function () {
    document.getElementById("msg-test").style.color = "red";
    document.getElementById("msg-test").onclick = function () { this.style.visibility = "collapse"; }

    load_chatroom("jaime");
    set_onclick_buttons();

    window.setInterval(function () {
        document.querySelectorAll(".discussion .timer[time]").forEach(timer => {
            timer.innerHTML = diff_time(Date.parse(timer.getAttribute("time")), Date.now());
        });
    }, 1000);
}


