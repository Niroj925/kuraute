
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useState, useEffect ,useRef} from 'react';
import axios from 'axios';
import { TextField, InputAdornment,Tab, Grid,Box,Divider,Tooltip, Typography,Button, Dialog,Chip,FormControl,
  DialogTitle,
  Menu,
  MenuItem,
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
import ChatIcon from '@mui/icons-material/Chat';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import ScrollableFeed from 'react-scrollable-feed';
import io from 'socket.io-client';
import Lottie from 'react-lottie'
import animationData from '../../animation/data.json';


const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const ENDPOINT='http://localhost:8080';
var socket,selectedChatCompare;

const useStyles = makeStyles({
  sm: {
    '@media (max-width: 450px)': {
      maxWidth: '320px',
      maxHeight:'350px'
    },
  },
  md: {
    '@media (min-width: 451px) and (max-width: 750px)': {
      maxWidth: '750px',
      maxHeight:'350px'
    },
  },
  lg: {
    '@media (min-width: 750px) and (max-width: 1200px)': {
      maxWidth: '900px',
      maxHeight:'350px'
    },
  },
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
      backgroundColor: "#eee",
      "&:hover": {
        transform: "scale(1.01)",
          color:'black',
          fontWeight:"bold"
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
const [typing,setTyping]=useState(false);
const [isTyping,setIsTyping]=useState(false);
const [anchorEl, setAnchorEl] = useState(null);

  const router=useRouter();
const messageContainerRef = useRef(null);

  const classes = useStyles();
  const { userid } = router.query
  console.log(userid);
  const handleChange=(event,newValue) =>{
    setValue(newValue);
}

useEffect(()=>{
  socket=io(ENDPOINT);
  socket.emit('setup',userid);
  socket.on('connected',()=>setSocketConnected(true));
  socket.on('typing',()=>setIsTyping(true));
  socket.on('stop typing',()=>setIsTyping(false));
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

    const sendMessage=async(event)=>{
      
      if(event.key==='Enter'){
        // socket.emit('stop typing',selectedChat._id);
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
        setMessage([...message,data]);
      } catch (err) {
        console.log(err);
      }
    };

    


const fetchMessage = async () => {
  try {
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
    localStorage.removeItem("token");
    router.push("/login");
  };

  const profilePage=()=>{
    setAnchorEl(null)
    setValue("3")
  }
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
     <>
     <Grid>
      
     </Grid>
     <TabContext value={value}  >
   
  <TabList onChange={handleChange} className={classes.tabList} >
  <Tab label="Friends" value="1" style={{ flex: 1 }} 
    icon={<PersonAddIcon/>}

  />
  <Tab label="Chat"
   value="2" 
   style={{ flex: 1 }} 
    icon={<ChatIcon/>}
   />
  <Tab label="Profile" 
  value="3" 
  style={{ flex: 1 }}
  aria-controls="simple-menu"
  aria-haspopup="true"
  onMouseOver={handleMenu}
  onFocus={handleMenu}
  icon={<AccountCircleIcon/>}
  />
   <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClosem}
          alignItems='center'
          display='flex'
          justifyContent='center'
          // className={classes.dropdown}
        >
          <MenuItem onClick={profilePage} style={{fontWeight:'bold'}}>
            Profile
          <PersonIcon/>
          </MenuItem>
          <MenuItem onClick={handleLogout} style={{fontWeight:'bold',}}>
            Logout 
            <LogoutIcon/>
            </MenuItem>
        </Menu>
</TabList>

<TabPanel value='1'>
  <Grid container>
    {/* User List */}
    <Grid item xs={12} md={6} lg={6} style={{ height: 'calc(100vh - 64px)' }}>
      <div>
        <Typography variant='h4'>Click users to start Chat</Typography>
        <Divider style={{marginBottom:'5px',marginTop:"5px"}}/>
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
        <Divider style={{marginBottom:'10px',marginTop:"5px"}}/>
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
  </Grid>
</TabPanel>
      <TabPanel value='2'>

      <Grid container spacing={3}>
          <Grid item xs={12} sm={4} md={3}>
          <Grid  style={{ height: 'calc(100vh - 64px)' }}>
       <Typography variant='h5' >Connected Friends</Typography>
       <Divider/>
      <div style={{ overflowY: 'scroll', height: 'calc(100% - 16px)'}}>
       
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
           <Divider orientation="vertical" flexItem />
       </Grid>
       {/* <Divider orientation="vertical" flexItem /> */}
       <Grid item xs={12} sm={8} md={9}>
     
        <Grid container  display="flex" justifyContent="space-between">  
  <Grid item xs={6}>
    <Button variant="outlined" onClick={handleClickOpen}>
      New group Chat
    </Button>
  </Grid>
  <Grid container alignItems="center" justifyContent="flex-end" item xs={6}>
    <Tooltip title= {selectedChat && (
        selectedChat.isGroupChat
        ? selectedChat.chatName
        : selectedChat.user &&
        selectedChat.user[1]._id===userid?selectedChat.user[0].name:selectedChat.user[1].name 
    )}>
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
        {/* <Divider style={{marginTop:"10px",marginBottom:"10px"}}/> */}
         <Grid>
{/*          
          <Typography>Click User to start Chat</Typography>
          <Divider style={{marginTop:"10px",marginBottom:"10px"}}/> */}
          <Divider style={{marginBottom:"10px"}}/>
          <Grid container 
          style={{
            maxHeight:"360px",
            overflow: "scroll",
            marginBottom: "15px",
          }}
  ref={messageContainerRef}
  // className={`${classes.sm} ${classes.md} ${classes.lg}`}
>
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

{isTyping?
      <div>
        <Lottie
         options={defaultOptions}
         width={60}
         style={{marginBottom:10,marginLeft:5}}
        />
      </div>:<></>}
          </Grid>
                
          <Grid style={{position: "absolute", 
          bottom: 0, right:0,
          width: "75%"}}>
         
            
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

