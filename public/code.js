(function () {
    const app = document.querySelector(".app");
    const socket = io();
    let uname;

    app.querySelector('.join-screen #join-user').addEventListener('click', function () {
        let username = app.querySelector('.join-screen #username').value;
        if (username.length === 0) {
            return;
        }
        socket.emit("newuser", username);
        uname = username;
        app.querySelector('.join-screen ').classList.remove('active');
        app.querySelector('.chat-screen ').classList.add('active');
    });

    app.querySelector(".chat-screen #send-message").addEventListener("click", (event) => {
        event.preventDefault(); // Prevent form submission behavior
    
        let message = app.querySelector(".chat-screen #message-input").value;
        if (message.length === 0) {
            return;
        }
        renderMessage("my", {
            username: uname,
            text: message
        });
        socket.emit("chat", {
            username: uname,
            text: message
        });
        app.querySelector('.chat-screen #message-input').value = "";
    
        // Focus on the input box after sending a message
        app.querySelector('.chat-screen #message-input').focus();
    });
    

    socket.on('chat', function (message) {
        renderMessage("other", message);
    });

    socket.on('update', function (message) {
        renderMessage("update", message);
    });
    socket.on("chat",function(message){
        renderMessage('other',message)
    })
    function renderMessage(type, message) {
        let messageContainer = app.querySelector('.chat-screen .messages');
        let el = document.createElement("div");

        if (type === "my") {
            el.setAttribute("class", "message my-message");
            el.innerHTML = `
                <div>
                    <div class="name">YOU</div>
                    <div class="text">${message.text}</div> 
                </div>
            `;
        } else if (type === 'other') {
            el.setAttribute("class", "message other-message");
            el.innerHTML = `
                <div>
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div> 
                </div>
            `;
        } else if (type === "update") {
            el.setAttribute("class", "update");
            el.innerText = message;
        }

        messageContainer.appendChild(el);
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }
})();
