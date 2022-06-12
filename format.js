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