import React, { useState,useEffect,useRef } from 'react';
import { Nav, Tab,Form,ListGroup,InputGroup,FormControl,NavDropdown,Image,Avatar} from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import style from '../../styles/Profile.module.css';
import { useRouter } from 'next/router';
import animationData from '../../animation/data.json';
import io from 'socket.io-client';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {FaPaperPlane,FaRegPaperPlane,FaUserCircle} from 'react-icons/fa'

import DialogueBox from '../../component/createGroup';
import MyImage from '@/component/roundimage';
  
  const ENDPOINT='https://kurautebackend.onrender.com';
  var socket,selectedChatCompare;

function App() {
  const [activeTab, setActiveTab] = useState('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat]=useState();
  const [chats,setChats]=useState([]);
 const [openDialog, setOpenDialog] = useState(false);
 const [message,setMessage]=useState([]);
 const [newMessage,setNewMessage]=useState();
const [socketConnected,setSocketConnected]=useState(false);
const [typing,setTyping]=useState(false);
const [isTyping,setIsTyping]=useState(false);
const [anchorEl, setAnchorEl] = useState(null);
const [loggedInUsers,setLoggedInUsers]=useState([]);

  const router=useRouter();
const messageContainerRef = useRef(null);

  const { userid } = router.query
  console.log(userid);

useEffect(()=>{
  socket=io(ENDPOINT);
  socket.emit('setup',userid);
  socket.on('connected',()=>setSocketConnected(true));
  socket.on('typing',()=>setIsTyping(true));
  socket.on('stop typing',()=>setIsTyping(false));
},[])

const fetchChats = async () => {
  console.log(process.env);
  try {
    const response = await axios.get(
      `https://kurautebackend.onrender.com/api/chat`,
      {
        headers: {
          token: JSON.parse(localStorage.getItem("token")),
        },
      }
    );

    // console.log(response);
    const {data}=response

    setChats(data);
    // console.log(data);
    console.log(chats);
  } catch (error) {
    
   console.log(error)
  }
};

useEffect(()=>{
  fetchChats();
},[selectedChat,openDialog])

 
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `https://kurautebackend.onrender.com/api/user?search=${searchQuery}`,
        {
          headers: {
            token: JSON.parse(localStorage.getItem("token")),
          },
        }
      );

      setUsers(response.data);
     
    } catch (error) {
      
      if (error.response && error.response.status === 403) {
        router.push("/login");
        toast.error("invalid authentication ", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      }else{
        router.push("/login");
      }
    }

    socket.on('user list', (users) => {
      // update the UI to display the list of logged-in users
      console.log(users)
      setLoggedInUsers(users);
      console.log("logged in users");
      console.log(loggedInUsers);
    });
  };

  fetchUsers();
}, [searchQuery,openDialog]);


  const handleSearch = event => {
    setSearchQuery(event.target.value);
  };
  const tabListClass = {
    display: 'flex',
    justifyContent: 'space-between',
  };
  if(users===[]){
    router.push('/login');
    }

    const userClick=async(userId)=>{
      console.log('userId:');
      console.log(userId)
    try {
      const response = await axios.post(
        'https://kurautebackend.onrender.com/api/chat',
        {
          id:userId
        },
        {
          headers: {
            token: JSON.parse(localStorage.getItem("token"))
          }
        }
      );
      console.log(response);
      setSelectedChat(response.data);
      console.log(selectedChat);
      const {data}=response;
      if(!chats.find((c)=>c._id===response.data._id)) setChats([data, ...chats]);
      fetchMessage();
      setActiveTab("chat")
      
    } catch (error) {
      
      console.log(error)
    }
    
    }
    const chatClick=(chat)=>{
    setSelectedChat(chat);
    console.log(selectedChat);
    fetchMessage();
    setActiveTab("chat")
    }

    const handleClickOpen = () => {
      setOpenDialog(true);
    };
  
    const handleClose = () => {
      setOpenDialog(false);
    };

    const handleInputChange = (event) => {
      setNewMessage(event.target.value);

      if (!socketConnected) return;

      if (!typing) {
        setTyping(true);
        socket.emit('typing', selectedChat._id);
      }
      let lastTypingTime = new Date().getTime();
      var timerLength = 4000;
      setTimeout(() => {
        var timeNow = new Date().getTime();
        var timeDiff = timeNow - lastTypingTime;
        if (timeDiff >= timerLength && typing) {
         
          socket.emit('stop typing', selectedChat._id);
          setTyping(false);
        }
      }, timerLength);
    }
  
    const handleSubmit = (event) => {
      event.preventDefault();
      // Handle submit logic here, such as sending the input value to a server or updating state
      console.log('Submitting input value:', newMessage);
      // Clear the input field
      setNewMessage('');
    }

    const sendMessage=(event)=>{
      
      if(event.key==='Enter'){
        event.preventDefault();
        // socket.emit('stop typing',selectedChat._id);
       sendMsg();
       fetchMessage();
      }
    
    }

    const sendMsg = async () => {
      try {
        const { data } = await axios.post(
          'https://kurautebackend.onrender.com/api/message',
          {
            msg: newMessage,
            chatId: selectedChat._id
          },
          {
            headers: {
              token: JSON.parse(localStorage.getItem("token"))
            }
          }
        );
    
        setNewMessage('');
        socket.emit('new message', data);
        setMessage([...message,data]);
      } catch (err) {
        console.log(err);
      }
    };

    


const fetchMessage = async () => {
  try {
    const response = await axios.get(
      `https://kurautebackend.onrender.com/api/message/${selectedChat._id}`,
      {
        headers: {
          token: JSON.parse(localStorage.getItem("token"))
        }
      }
    );
    console.log('selected chat');
    console.log(selectedChat);

    (response.data.length>0)?setMessage(response.data):setMessage([]);
    console.log('response:');
    console.log(response.data);
    console.log('received msg:');
    
    // setNewMessage('');
    console.log(message);
    socket.emit('join chat', selectedChat._id);

  } catch (err) {
    console.log(err);
  }
};

    useEffect(()=>{
      fetchMessage();
      fetchMessage();
      selectedChatCompare=selectedChat;
    },[selectedChat])
    
  useEffect(() => {
    socket.on('message received', (newMessageReceived) => {
      console.log('message received:')
      console.log(newMessageReceived);
      if (!selectedChatCompare || selectedChatCompare._id !== String(newMessageReceived.chat._id)) {
        // if chat is not selected or doesn't match current chat
        // setNotification([newMessageReceived, ...notification]);
        // setFetchAgain(!fetchAgain);
      } else {
        setMessage([...message, newMessageReceived]);
      }
    });
  }, [selectedChatCompare, message]);

  useEffect(() => {
    // scroll to the bottom of the message container
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [message]);


  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosem = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    socket.emit('remove', userid);
    localStorage.removeItem("token");
    router.push("/");
  };

  const profilePage=()=>{
    setAnchorEl(null)
    setActiveTab("profile")
  }
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
  };

  const handleProfileClick = () => {
    setActiveTab('profile'); // set the active tab to "profile"
  };



  return (
    <div className={style.body}>
      <Tab.Container activeKey={activeTab} onSelect={handleTabSelect}>
        <Nav variant="tabs" className={style.tabs} >
          <Nav.Item>
            <Nav.Link eventKey="friends" className={style.tab}>
              Friends
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="chat" className={style.tab}>
              Chat
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="profile" className={style.tab} onClick={handleProfileClick}>
              Profile
            </Nav.Link>
          </Nav.Item>
          <NavDropdown title={<FaUserCircle  size='30px'/>} id="basic-nav-dropdown">
           <NavDropdown.Item eventKey="profile" onClick={() => setActiveTab("profile")}>
    Profile
      </NavDropdown.Item>
  <NavDropdown.Divider />
  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
</NavDropdown>

        </Nav>
        <Tab.Content>
            {/* firiends tab */}
          <Tab.Pane eventKey="friends">
            {activeTab === "friends" && (
              <div className="mt-3">
          <h4>Click users to start Chat</h4>
          <hr style={{marginBottom:'5px',marginTop:"5px"}}/>

          <Form.Group controlId="searchFriends">
  <Form.Label>Search for friends</Form.Label>
  <div className="position-relative">
    <Form.Control
      type="text"
      placeholder="Enter search query"
      value={searchQuery}
      onChange={handleSearch}
    />
    <div className="position-absolute top-50 end-0 translate-middle-y pe-2">
      {/* <SearchIcon /> */}
    </div>
  </div>
</Form.Group>

          <hr style={{marginBottom:'10px',marginTop:"5px"}}/>
          <div style={{ 
  overflowY: 'scroll', 
  height: 'calc(100% - 56px)', 
  margin: '10px', 
}}>
  <ListGroup style={{display:'flex',flexDirection:'column',margin:'10px'}} >
    {users && users.map((user) => (
      <ListGroup.Item key={user.id} 
      className="d-flex align-items-center" 
      action onClick={()=>userClick(user._id)}
      style={{margin:'10px',fontSize:"20px",fontWeight:"bold"}}
      >
      
        <div style={{display:'flex',alignItems:'center'}} >

       <MyImage src="../image/dummy.png" alt="My Image" size={40} 
       
       iscircle={loggedInUsers.includes(user._id)? true:false}
        />


          <p className="mb-0" style={{marginLeft:'10px'}}>{user.name}</p>
          {/* <p>{user.user}</p> */}
        </div>
      </ListGroup.Item>
    ))}
  </ListGroup>
</div>
              </div>
            )}
          </Tab.Pane>
{/* chat tab */}
          <Tab.Pane eventKey="chat">
            {activeTab === "chat" && (
               <div className={style.chat_container}>
                 <div className={style.cfl} >
                 <h4>Connected Friends</h4>
                       <hr/>
                 <div style={{ 
  overflowY: 'scroll', 
  height: 'calc(100% - 56px)', 
  margin: '10px', 
}}>
  <ListGroup style={{display:'flex',flexDirection:'column',margin:'10px'}} >
    {chats && chats.map((chat) => (
      <ListGroup.Item key={chat.id} 
      className="d-flex align-items-center" 
      action 
      onClick={()=>chatClick(chat)}
      style={{margin:'5px',fontSize:"20px",fontWeight:"bold"}}
      >
        <div>
          <p>{
                chat.isGroupChat===true?chat.chatName:
                chat.user[1]._id===userid?chat.user[0].name: chat.user[1].name            
                }
                </p>
        </div>
      </ListGroup.Item>
    ))}
  </ListGroup>
</div>
                 </div>

                   <div className={style.messagebox} >
                   <div className={style.chatbar}>
                    <Button variant="primary"  onClick={handleClickOpen}>New group chat</Button>
                    {openDialog && <DialogueBox handleClose={() => setOpenDialog(false)} />}
                        <h4>
                    {selectedChat && (
        selectedChat.isGroupChat
        ? selectedChat.chatName
        : selectedChat.user &&
        selectedChat.user[1]._id===userid?selectedChat.user[0].name:selectedChat.user[1].name 
      ) 
      }
                    </h4>
                   </div>
                   <hr/>
                    <div 
  className={style.containermsg}
  ref={messageContainerRef}
>
  {message && message.map((msg) => {
    return (
      <div 
        className={`d-flex ${msg.sender._id===userid ? 'justify-content-end' : 'justify-content-start'} align-items-center`}
        style={{marginTop:"5px"}}
      >
        {msg.sender._id===userid ? (
          <p className={style.sendermsg}>{msg.content}</p>
        ) : (
          <>
            {/* <Tooltip title={msg.sender.name}>
              <img src="https://via.placeholder.com/30" alt="avatar" className="rounded-circle mr-2" />
            </Tooltip> */}
            <p className={style.receivermsg}>{msg.content}</p>
          </>
        )}
      </div>
    )
  })}
  {isTyping ? (
    <div>
      Typing...
    </div>
  ) : <></>}
</div>

<div className={style.sendbtn}>
 <Form onSubmit={sendMsg}>
 <Form.Group controlId="sendMessage">
      <div className="position-relative">
        <Form.Control
          type="text"
          placeholder="Enter a message...."
          value={newMessage}
          onChange={handleInputChange}
          onKeyDown={sendMessage}
          style={{ paddingRight: '50px' }} // add padding for the icon
        />
        <Button variant="outline-primary" className="position-absolute" style={{ right: 0, bottom: 0 }}>
          <FaPaperPlane onClick={sendMsg}  />
        </Button>
      </div>
    </Form.Group>
</Form>
</div>     

                   </div>
                   <div>
                   <hr/>
                 </div>
               </div>
            )}
          </Tab.Pane>



          <Tab.Pane eventKey="profile">
            {activeTab === "profile" && (
              <div className="mt-3">
                <p>User profile goes here.</p>
              </div>
            )}
          </Tab.Pane>

        </Tab.Content>
      </Tab.Container>
      <ToastContainer/>
    </div>
  );
}

export default App;
