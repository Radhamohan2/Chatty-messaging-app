const path = require('path');
const http = require('http');
const express = require('express');
const socketio=require('socket.io');
const { Socket } = require('dgram');

const formatMessage=require('./utils/messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers} = require('./utils/users');
const botName = 'Chatty';

const app =express();
const server=http.createServer(app);
const io = socketio(server);

//static folder
app.use(express.static(path.join(__dirname,'public')));

// run when there is connection with cleint
io.on('connection',socket=>{

    socket.on('joinroom',({username,room})=>{

        const user = userJoin(socket.id,username,room);

        socket.join(user.room);
        //Welcome the current user
    socket.emit('msg',formatMessage(botName,'Welcome to Chatty'));

    //when user joins
    socket.broadcast.to(user.room).emit('msg',formatMessage(botName,`A ${user.username} has entered the chat`));
    //sending user and room info
    io.to(user.room).emit('roomUsers',{
        room:user.room,
        users:getRoomUsers(user.room)
    });

    });

    
   

    

    //when some one disconnect

    socket.on('disconnect',()=>{
        const user =userLeave(socket.id);

        if(user){
        io.to(user.room).emit('msg',formatMessage(botName,`A ${user.username} has left the chat`));
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        });
        }
    });

    //Listening for the chat msg
    socket.on('chatMsg',(msg)=>{
        const user = getCurrentUser(socket.id);

        
        io.to(user.room).emit('msg',formatMessage(user.username,msg));
    })
});

const PORT =3000 || process.env.PORT;

server.listen(PORT,()=>console.log(`Servver running on port ${PORT}`));