window.onload = function () {
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
    waitForElm("#signUp").then(signUpButton => {
        const container = document.getElementById('container');

        signUpButton.onclick = () => {
            container.classList.add("right-panel-active");
        };

        document.getElementById('signIn').onclick = () => {
            container.classList.remove("right-panel-active");
        };

        document.getElementById("submit-signup").onclick = () => {
            document.querySelector(".sign-up-container form").submit();
        }

        document.getElementById("submit-signin").onclick = () => {
            document.querySelector(".sign-in-container form").submit();
        }
    });
}

