

const io = require('socket.io')(8000, {
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

const users = {};

io.on('connection', (socket) => {
    console.log("A new user connected:", socket.id);
    
        socket.emit('welcome-message', ' Welcome to the chat app!');
    



    socket.on('new-user-joined', name => {
        console.log("New user joined:", name);
        if (Object.values(users).includes(name)) {

            socket.emit('name-already-in-use', name);
        } else {
            users[socket.id] = name;
            socket.emit('existing-users', Object.values(users).filter(user => user !== name));

            socket.broadcast.emit('new-user-joined', name);
        }
    });


    socket.on('send', message => {
        // console.log(`Message from ${users[socket.id]}: ${message}`);
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });
    socket.on('send-file', ({ fileName, fileData }) => {
        console.log(`${users[socket.id]} sent a file: ${fileName}`);
        socket.broadcast.emit('receive-file', { fileName, fileData, name: users[socket.id] });
    });
    

    socket.on('disconnect', () => {
        const name = users[socket.id];
        if (name) {
            console.log("User disconnected:", name);
            socket.broadcast.emit('user-left', name);
            delete users[socket.id];
        }
    });
    socket.on('already-user-joined', () => {
        console.log("User tried to join with an already used name.");
    });
    socket.on('existing-users', () => {
        console.log("alredy joined the chat  ")
    })

});




