import * as React from 'react';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, InputAdornment,Tab, Grid,Box,Divider} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {useRouter} from 'next/router';
import { Card, CardContent, Avatar} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { display } from '@mui/system';

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
    avatar: {
      marginRight: 10,
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
},[selectedChat])

 
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
}, [searchQuery]);


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
      <Grid>
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
           </div>
        <Divider/>
      <div>
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
              {/* <p>{user.email}</p> */}
            </CardContent>
          </Card>
        ))}
    </div>
    </Grid>

    </TabPanel>
      <TabPanel value='2'>Chat</TabPanel>
      <TabPanel value='3'>Profile</TabPanel>

    </TabContext>
    </>
  );
}