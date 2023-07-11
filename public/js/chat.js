const socket = io();

let user;
let chatBox = document.getElementById("chatBox");
let sendBtn = document.getElementById("sendBtn");
let userIdentified = false;

Swal.fire({
  title: "Identificación",
  input: "text",
  text: "Escribe el nombre de usuario a utilizar en el chat",
  inputValidator: (value) => {
    return !value && "Necesitas escribir un nombre de usuario para continuar!";
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
  socket.emit("sayhello", user);
  userIdentified = true;
});

chatBox.addEventListener("keyup", (evt) => {
  if (evt.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", { user: user, message: chatBox.value });
      chatBox.value = "";
    }
  }
});

sendBtn.addEventListener("click", (evt) => {
  if (chatBox.value.trim().length > 0) {
    socket.emit("message", { user: user, message: chatBox.value });
    chatBox.value = "";
  }
});

socket.on("messageLogs", (data) => {
  let log = document.getElementById("messageLogs");
  let messages = "";
  data.forEach((message) => {
    messages =
      messages +
      `<strong>${message.user}</strong> dice: ${message.message}</br>`;
  });
  log.innerHTML = messages;
});

socket.on("alert", (data) => {
  Swal.fire({
    text: `Nuevo usuario conectado: ${data}`,
    toast: true,
    position: "top-right",
  });
});
