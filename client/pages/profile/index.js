import * as React from 'react';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, InputAdornment,Tab, Grid,Box,Divider, Typography,Button, Dialog,Chip,
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


const useStyles = makeStyles({
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
    }

  });

export default function UnstyledTabsIntroduction() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [value,setValue] =useState('1');
  const [selectedChat, setSelectedChat]=useState();
  const [chats,setChats]=useState([]);
 const [openDialog, setOpenDialog] = useState(false);

  const router=useRouter();

  const classes = useStyles();
  const { userid } = router.query
  console.log(userid);
  const handleChange=(event,newValue) =>{
    setValue(newValue);
}
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

    const userClick=async(id)=>{
      console.log(id);
      // console.log(JSON.parse(localStorage.getItem("token")));
    try {
      const response = await axios.post(
        'http://localhost:8080/api/chat',
        {
          id: id
        },
        {
          headers: {
            token: JSON.parse(localStorage.getItem("token"))
          }
        }
      );
      console.log(response);
      setSelectedChat(response.data);
      const {data}=response;
      if(!chats.find((c)=>c._id===response.data._id)) setChats([data, ...chats]);


      setValue("2")
      
    } catch (error) {
      
      console.log(error)
    }
    
    }
    const chatClick=(chat)=>{
    setSelectedChat(chat);
    setValue("2")
    }

    const handleClickOpen = () => {
      setOpenDialog(true);
    };
  
    const handleClose = () => {
      setOpenDialog(false);
    };
  
    
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
                 chat.user[1].name
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase())
                    .join("")
                     )
                    }
              </Avatar>
              <CardContent>

                <p>{
                chat.isGroupChat===true?chat.chatName: chat.user[1].name               
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
    <Typography variant='h5'>
        {selectedChat && (
            selectedChat.isGroupChat
            ? selectedChat.chatName
            : selectedChat.user && selectedChat.user[1].name
        )}
    </Typography>
</Grid>
         
        </Grid>
        <Divider style={{marginTop:"10px",marginBottom:"10px"}}/>
         <Grid>
          

         </Grid>

        <DialogBox open={openDialog} onClose={handleClose} />
        </TabPanel>
      <TabPanel value='3'>Profile</TabPanel>

    </TabContext>
    <ToastContainer/>
    </>
  );
}

