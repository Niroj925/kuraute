import * as React from 'react';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, InputAdornment,Tab, Grid,Box,Divider,Tooltip, Typography,Button, Dialog,Chip,FormControl,
  DialogTitle,
  DialogContent,
  DialogActions,} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {CloseIcon} from '@mui/icons-material';
import {useRouter} from 'next/router';
import { Card, CardContent, Avatar} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DialogBox from '../../component/creatGroup';
import SendIcon from '@mui/icons-material/Send';
import ScrollableFeed from 'react-scrollable-feed';
import io from 'socket.io-client';



const ENDPOINT='http://localhost:8080';
var socket,selectedChatCompare;

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    '& > *': {
      marginRight:"10px",
    },
  },
    card: {
      display: "flex",
      alignItems: "center",
      marginBottom: 10,
      transition: "transform 0.s",
      "&:hover": {
        transform: "scale(1.01)",
        backgroundColor: "#eee",
        "& p": {
          fontSize: "1.2rem",
          fontWeight: "bold",
        },
      },
    },
    dcard: {
      display: "flex",
      height:"45px",
      alignItems: "center",
      marginBottom:3,
      transition: "transform 0.s",
      "&:hover": {
        transform: "scale(1.01)",
        backgroundColor: "#eee",
        "& p": {
          fontSize: "1.2rem",
          fontWeight: "bold",
        },
      },
    },
    avatar: {
      marginRight: 10,
      marginLeft:15
    },
    davatar: {
      marginRight: 5,
      marginLeft:5
    },
    tabList:{
      display:"flex",
      justifyContent:"space-between",
      "&:hover": {
        transform: "scale(1.01)",
        backgroundColor: "#eee",
      }
    },
    
    tab: {
      flex: 1
    },
    button:{
      marginLeft:"10px"
    },
    sendIcon:{
      cursor:"pointer",
      "&:hover":{
        color:"blue"
      }
    },
    sendMsg:{
      backgroundColor:"Blue",
      color:"white",
      borderRadius:"20px",
      padding:"6px"
    },
    receiveMsg:{
      backgroundColor:"green",
      color:"black",
      borderRadius:"20px",
      padding:"6px"
    }

  });

export default function UnstyledTabsIntroduction() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [value,setValue] =useState('1');
  const [selectedChat, setSelectedChat]=useState();
  const [chats,setChats]=useState([]);
 const [openDialog, setOpenDialog] = useState(false);
 const [message,setMessage]=useState([]);
 const [newMessage,setNewMessage]=useState();
const [socketConnected,setSocketConnected]=useState(false);

  const router=useRouter();

  const classes = useStyles();
  const { userid } = router.query
  console.log(userid);
  const handleChange=(event,newValue) =>{
    setValue(newValue);
}

useEffect(()=>{
  socket=io(ENDPOINT);
  socket.emit('setup',userid);
  socket.on('connection',()=>setSocketConnected(true));
},[])

const fetchChats = async () => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/chat`,
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
        `http://localhost:8080/api/user?search=${searchQuery}`,
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
      // console.log(JSON.parse(localStorage.getItem("token")));
    try {
      const response = await axios.post(
        'http://localhost:8080/api/chat',
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
      setValue("2")
      
    } catch (error) {
      
      console.log(error)
    }
    
    }
    const chatClick=(chat)=>{
    setSelectedChat(chat);
    console.log(selectedChat);
    fetchMessage();
    setValue("2")
    }

    const handleClickOpen = () => {
      setOpenDialog(true);
    };
  
    const handleClose = () => {
      setOpenDialog(false);
    };

    const handleInputChange = (event) => {
      setNewMessage(event.target.value);
    }
  
    const handleSubmit = (event) => {
      event.preventDefault();
      // Handle submit logic here, such as sending the input value to a server or updating state
      console.log('Submitting input value:', newMessage);
      // Clear the input field
      setNewMessage('');
    }

    const sendMessage=async(event)=>{
      
      if(event.key==='Enter'){
       sendMsg();
       fetchMessage();
       console.log(message)
      }
    
    }

    const sendMsg = async () => {
      try {
        const { data } = await axios.post(
          'http://localhost:8080/api/message',
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
        // setMessage(prevMessages => [...prevMessages, data]);
        setMessage([...message,data]);
      } catch (err) {
        console.log(err);
      }
    };

    


const fetchMessage = async () => {
  try {
    // const response = await axios.get(
    //   `http://localhost:8080/api/message/${selectedChat._id}`,
    //   {
    //     headers: {
    //       token: JSON.parse(localStorage.getItem("token"))
    //     }
    //   }
    // );

    // setNewMessage('');
    // setMessage(response.data);
    // socket.emit('join chat', selectedChat._id);

    const response = await axios.get(
      `http://localhost:8080/api/message/${selectedChat._id}`,
      {
        headers: {
          token: JSON.parse(localStorage.getItem("token"))
        }
      }
    );
    
    setMessage(response.data);
    setNewMessage('');
    socket.emit('join chat', selectedChat._id);

  } catch (err) {
    console.log(err);
  }
};

    useEffect(()=>{
      fetchMessage();
      selectedChatCompare=selectedChat;
    },[selectedChat])
    
  // useEffect(() => {
  //   socket.on('new message', (newMessageRecieved) => {
  //     console.log('message received:')
  //     console.log(newMessageRecieved);
  //     if (
  //       !selectedChatCompare || // if chat is not selected or doesn't match current chat
  //       selectedChatCompare._id !== newMessageRecieved.chat._id
  //     ) {
  //       // if (!notification.includes(newMessageRecieved)) {
  //       //   setNotification([newMessageRecieved, ...notification]);
  //       //   setFetchAgain(!fetchAgain);
  //       // }
  //     } else {
  //       setMessage([...message, newMessageRecieved]);
  //     }
  //   });
  // });
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

  return (
     <>
     <Grid>
      
     </Grid>
     <TabContext value={value}  >
   
  <TabList onChange={handleChange} className={classes.tabList} >
  <Tab label="Friends" value="1" style={{ flex: 1 }} />
  <Tab label="Chat" value="2" style={{ flex: 1 }} />
  <Tab label="Profile" value="3" style={{ flex: 1 }} />
</TabList>

<TabPanel value='1'>
  <Grid container>
    {/* User List */}
    <Grid item xs={6} style={{ height: 'calc(100vh - 64px)' }}>
      <div>
        <TextField
          label="Search for friends"
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Divider/>
        <div style={{ overflowY: 'scroll', height: 'calc(100% - 56px)' ,margin:'10px'}}>
          {users &&
            users.map((user) => (
              <Card key={user.id} className={classes.card} onClick={()=>userClick(user._id)}>
                <Avatar className={classes.avatar}>
                  {user.name
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase())
                    .join("")}
                </Avatar>
                <CardContent>
                  <p>{user.name}</p>
                  {/* <p>{user.user}</p> */}
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </Grid>

    {/* Chat Friends */}
    <Grid item xs={6} style={{ height: 'calc(100vh - 64px)' }}>
       <Typography variant='h5' >Connected Friends</Typography>
       <Divider/>
      <div style={{ overflowY: 'scroll', height: 'calc(100% - 16px)',margin:'10px' }}>
       
        {/* Display chat friends */}
        {chats && chats.length > 0 ? (
          chats.map((chat) => (
            <Card key={chat.id} className={classes.card} onClick={()=>chatClick(chat)}>
              <Avatar className={classes.avatar}>
                 {chat.isGroupChat===true?(
                  chat.chatName
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase())
                  .join("")
                 ):(
                  chat.user[1]._id===userid?chat.user[0].name
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase())
                  .join(""):
                 chat.user[1].name
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase())
                    .join("")
                     )
                    }
              </Avatar>
              <CardContent>

                <p>{
                chat.isGroupChat===true?chat.chatName:
                chat.user[1]._id===userid?chat.user[0].name: chat.user[1].name            
                }
                </p>
                {/* <p>{user.user}</p> */}
              </CardContent>
            </Card>
          ))
        ) : (
          <div>No chats found</div>
        )}
      </div>
    </Grid>
  </Grid>
</TabPanel>
      <TabPanel value='2'>
      <Divider style={{marginTop:"10px",marginBottom:"10px"}}/>
        <Grid container direction='row' display="flex" justifyContent="space-between">  
           <Grid>
            <Button variant="outlined" onClick={handleClickOpen}>
           New group Chat
          </Button>
           </Grid>
           <Grid>
           <Tooltip title= {selectedChat && (
            selectedChat.isGroupChat
            ? selectedChat.chatName
            : selectedChat.user &&
            selectedChat.user[1]._id===userid?selectedChat.user[0].name:selectedChat.user[1].name 
        )
         
        }>
                         <Avatar style={{ width: '30px', height: '30px', marginRight: '5px' }} />
                      </Tooltip>
    <Typography variant='h5'>
        {selectedChat && (
            selectedChat.isGroupChat
            ? selectedChat.chatName
            : selectedChat.user &&
            selectedChat.user[1]._id===userid?selectedChat.user[0].name:selectedChat.user[1].name 
        )
         
        }
    </Typography>
</Grid>
         
        </Grid>
        <Divider style={{marginTop:"10px",marginBottom:"10px"}}/>
         <Grid>
         
          <Typography>Click User to start Chat</Typography>
          <Divider style={{marginTop:"10px",marginBottom:"10px"}}/>
          <Divider style={{marginBottom:"10px"}}/>
          <Grid container style={{ maxHeight: "250px", overflow: "auto" ,marginBottom:"15px" }}>
            {
            message&&message.map((msg)=>{
              return (
                <>
                <Grid container
                 direction='row' 
                 alignItems='center' 
                 justifyContent={msg.sender._id===userid ? 'flex-end' : 'flex-start'} 
                 style={{marginTop:"5px"}}>
                  {
                    msg.sender._id===userid?(
                      <>
                      <Typography className={classes.sendMsg}>
                      {msg.content}
                      </Typography>
                      </>
                    ):(
                      <>
                      {/* <Avatar style={{ width: '30px', height: '30px',marginRight:"5px"}}/> */}
                      <Tooltip title={msg.sender.name}>
                         <Avatar style={{ width: '30px', height: '30px', marginRight: '5px' }} />
                      </Tooltip>
                      <Typography className={classes.receiveMsg}>
                      {msg.content}
                      </Typography>
                      </>
                      
                    )
                  }
                </Grid>
                 
                </>
               
              )
            })
          }

          </Grid>
                
          <Grid style={{position: "absolute", 
          bottom: 0, left:0,
          width: "100%"}}>
    <FormControl onKeyDown={sendMessage} fullWidth={true}>
      <TextField
        id="inputField"
        variant="outlined"
        size="large"
        placeholder="Enter a message...."
        value={newMessage}
        onChange={handleInputChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SendIcon onClick={sendMsg} className={classes.sendIcon}/>
            </InputAdornment>
          ),
        }}
        style={{
          margin:"15px",    
        }}
      />
    </FormControl>
  </Grid>
         </Grid>

        <DialogBox open={openDialog} onClose={handleClose} />
        </TabPanel>
      <TabPanel value='3'>Profile</TabPanel>

    </TabContext>
    <ToastContainer/>
    </>
  );
}

