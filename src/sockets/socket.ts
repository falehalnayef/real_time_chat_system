import socketIo from "socket.io";

let clients: any = {}; // Store the socket ID and username mapping
let groups: any = {}; // Store group memberships (groupName => [list of users])
let undeliveredMessages: any = {}; // Store undelivered messages for users
export function connectToSocket(server: any) {
  const io = new socketIo.Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // When a client connects
  io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    // Register the user's socket ID when they register
    socket.on('register', (username) => {
      clients["u" + username] = socket.id;
      console.log(`User ${username} registered with socket ID: ${socket.id}`);
       
      // Check for undelivered messages for this user and send them
      if (undeliveredMessages["u" + username]) {
        // Send each message to the user
        undeliveredMessages["u" + username].forEach((message: any) => {
          io.to(socket.id).emit('receive_message', message);
        });
        // Clear the undelivered messages for this user
        delete undeliveredMessages["u" + username];
      }
    });

    // Handle creating a new group
    socket.on('join_group', (groupName) => {
      if (!groups["g" + groupName]) {
        groups["g" + groupName] = [];
      }
      if (!groups["g" + groupName].includes(socket.id)) {
        groups["g" + groupName].push(socket.id); // Add the user to the group
        console.log(`User ${socket.id} created and joined group: ${groupName}`);
        socket.emit('receive_group_message', { group: groupName, from: 'System', message: 'You have created and joined the group.' });
      } else {
        socket.emit('receive_group_message', { group: groupName, from: 'System', message: 'You are already in the group.' });
      }
    });

    // Handle sending a private message to a user
    socket.on('send_message', (data) => {
      const { to, message } = data;
      console.log(`Message from ${socket.id} to ${to}: ${message}`);

      if (clients["u" + to]) {
        io.to(clients["u" + to]).emit('receive_message', { from: socket.id, message });
      } else {
        // If the recipient is offline, store the undelivered message
        if (!undeliveredMessages["u" + to]) {
          undeliveredMessages["u" + to] = [];
        }
        undeliveredMessages["u" + to].push({ from: socket.id, message });
        console.log(`User ${to} is offline. Message stored.`);
      }
    });

    // Handle sending a message to a group
    socket.on('send_group_message', (data) => {
      const { group, message } = data;
      if (groups["g" + group]) {
        console.log(`Message to group ${group}: ${message}`);
        groups["g" + group].forEach((socketId: any) => {
          io.to(socketId).emit('    ', { group, from: socket.id, message });
        });
      } else {
        socket.emit('receive_group_message', { group, from: 'System', message: 'Group does not exist.' });
      }
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
      for (let username in clients) {
        if (clients[username] === socket.id) {
          delete clients[username]; // Remove user from clients list
          console.log(`User ${username} disconnected`);
          break;
        }
      }
      for (let group in groups) {
        const index = groups[group].indexOf(socket.id);
        if (index > -1) {
          groups[group].splice(index, 1); // Remove user from the group
          console.log(`User ${socket.id} removed from group ${group}`);
        }
      }
    });
  });

  return io;
}
