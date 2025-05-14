
const socket = io('http://localhost:8000');

const form = document.getElementById('send-conatineer');
const Messageinput = document.getElementById('messageinp');
const messageContainer = document.getElementById('container');

var audio = new Audio('Messenger Notification Sound Effect.mp3');

// Retrieve the username from localStorage
let names = localStorage.getItem('username');

// Check if the username exists
if (!names) {
    alert("You must log in first!");
    window.location.href = "login.html"; // Redirect to login page if no username
} else {
    socket.emit('new-user-joined', names); // Emit the username to the server
}
socket.on('name-already-in-use', (name) => {
    alert(`The name "${name}" is already in use. Please choose a different name.`);
    window.location.href = "login.html"; // 
});
socket.on('existing-users', (users) => {
    users.forEach(user => {
        append(`${user} :is already in the chat`, 'left');
    });
});



const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position === 'left') {
        audio.play();
    }
};


socket.on('new-user-joined', name => {
    append(`${name} :joined the chat`, 'left');
});


socket.on('welcome-message', (message) => {
    append(`Welcome to the chat app, ${names}`, 'left'); 
});

form.addEventListener('submit', (E) => {
    E.preventDefault();
    const message = Messageinput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    Messageinput.value = '';
});


socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});



socket.on('user-left', name => {
    append(`${name} left the chat`, 'left');
});

// Handle file input
const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5 MB limit
            alert("File size exceeds 5 MB. Please choose a smaller file.");
            return;
        }
        const reader = new FileReader();
        reader.onload = function (e) {
            const fileData = e.target.result; // Base64 encoded file data
            appendImage(`You sent an image`, fileData, 'right');
            socket.emit('send-file', { fileName: 'image', fileData: fileData });
        };
        reader.readAsDataURL(file); // Convert file to Base64
    }
});


socket.on('receive-file', ({ fileName, fileData, name }) => {
    appendImage(`${name} sent a file: ${fileName}`, fileData, 'left');
});


const appendImage = (message, fileData, position) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(position);

    const textElement = document.createElement('p');
    textElement.innerText = message;

    const imageElement = document.createElement('img');
    imageElement.src = fileData; 
    imageElement.alt = "Shared Image";
    imageElement.style.maxWidth = "250px"; 
    imageElement.style.borderRadius = "5px";

    messageElement.appendChild(textElement);
    messageElement.appendChild(imageElement);
    messageContainer.append(messageElement);
};
// Function to toggle Night Mode
function toggleNightMode() {
    document.body.classList.toggle('night-mode');
}
// function login() {
//     const user = document.getElementById('username').value.trim();
//     const pass = document.getElementById('password').value;

//     // Validate username (only alphabets)
//     const usernameRegex = /^[A-Za-z]+$/;
//     if (!usernameRegex.test(user)) {
//         alert('Username must contain only alphabets.');
//         return;
//     }

//     // Validate password (minimum 6 characters)
//     if (pass.length < 6) {
//         alert('Password must be at least 6 characters long.');
//         return;
//     }

//     // If validation passes, store username and redirect
//     localStorage.setItem('username', user);
//     window.location.href = "index.html"; // Redirect to chat page
// }
// function changeColor() {
//     // Get the container element
//     const container = document.getElementById('container');

//     // Define an array of colors
//     const colors = ['lightblue', 'lightgreen', 'lightpink', 'lightcoral', 'lightsalmon', 'lightyellow'];

//     // Pick a random color from the array
//     const randomColor = colors[Math.floor(Math.random() * colors.length)];

//     // Apply the random color as the background color of the container
//     container.style.backgroundColor = randomColor;
// }



