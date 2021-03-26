const chatForm = document.getElementById('chat-form');

const chatMessages = document.querySelector('.chat-messages');

const roomName= document.getElementById('room-name');
const userList = document.getElementById('users');
// geting username and room from url

const {username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true
});




const socket = io();

//join chat room
socket.emit('joinroom',{username,room});

//get room and user

socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
});


//cathing msg from server
socket.on('msg', msg=>{
    
    //showing msg on DOM
    outputMsg(msg);

    chatMessages.scrollTop = chatMessages.scrollHeight;

    //scrolling down for new msg
});

// geting msg content 
chatForm.addEventListener('submit',(e)=>
{
    // stops the default way of file creation when submited
    e.preventDefault();

    //getting the content of msg
    const msg=e.target.elements.msg.value;


    //emit the msg to the server
    socket.emit('chatMsg', msg);

    //clear input
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();

});


function outputMsg(msg)
{
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${msg.username} <span>${msg.time}</span></p>
    <p class="text">
        ${msg.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);

}

//adding roomname to dom
function outputRoomName(room)
{
    roomName.innerText=room;
}

//add users to dom
function outputUsers(users){
    userList.innerHTML=`${users.map(user=>`<li>${user.username}</li>`).join('')}
    `;
}