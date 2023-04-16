import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, InputAdornment,Tab, Grid,Box,Divider, Typography,Button, Dialog,Chip,
  DialogTitle,
  DialogContent,
  DialogActions,} from '@mui/material';
import { Card, CardContent, Avatar} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchIcon from '@mui/icons-material/Search';

const useStyles = makeStyles({
   
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
    davatar: {
      marginRight: 5,
      marginLeft:5
    },
    searchIcon:{
      cursor:'pointer',
      "&:hover":{
        color:'blue'
      }
    }
  });
function creatGroup(props) {
    const {open, onClose } = props;

  const [chatName, setChatName] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const classes = useStyles();
    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setSelectedUsers([]);
        setChatName('');
      };
  
    
      const handleSearchUser = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/user?search=${searchUser}`,
            {
              headers: {
                token: JSON.parse(localStorage.getItem("token")),
              },
            }
          );
          setSearchResults(response.data);
          console.log(searchResults);
        } catch (error) {
          console.error(error);
        }
      };
    
      useEffect(()=>{
       handleSearchUser();
      },[searchUser])
      const handleAddUser = (user) => {
        if (!selectedUsers.some((u) => u._id === user._id)) {
          setSelectedUsers((prev) => [...prev, user]);
        }
      };
    
      const handleRemoveUser = (user) => {
        setSelectedUsers((prev) => prev.filter((u) => u._id !== user._id));
      };
    
      const handleCreateChat = async () => {
        const userIds = selectedUsers.map((user) => user._id);
        try {
          const response = await axios.post(
            "http://localhost:8080/api/chat/group",
            {
              name: chatName,
              users: JSON.stringify(userIds),
            },
            {
              headers: {
                token: JSON.parse(localStorage.getItem("token")),
              },
            }
          );
          console.log(response.data);
          if(response){
            toast.success('A new Group chat has been created', {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              });
              setSelectedUsers([]);
              setChatName('');
              
          }
  
        } catch (error) {
          console.error(error);
        }
      };

  return (
    <>
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>This is a Simple Dialog</DialogTitle>
      <Divider/>
      <DialogContent>
        <div>
          <div>
            <TextField
              id="chat-name-input"
              label="Chat Name"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              fullWidth
              margin="normal"
              size='small'
            />
          </div>
          <div>
            <TextField
              id="user-search-input"
              label="Search Users"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              fullWidth
              margin="normal"
              size='small'
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon onClick={handleSearchUser} className={classes.searchIcon}/>
                  </InputAdornment>
                ),
              }}

            />
            {/* <Button variant="contained" color="primary" onClick={handleSearchUser}>Search</Button> */}
          </div>
          <Divider/>
          <div>
            {selectedUsers.map((user) => (
              <Chip
                key={user.id}
                label={user.name}
                variant="outlined"
                onDelete={() => handleRemoveUser(user)}
                style={{ margin: '4px' }}
              />
            ))}
          </div>
          <Divider/>
          <div>
            {searchResults &&
              searchResults.map((user) => (
                <Card key={user.id} className={classes.dcard} onClick={() => handleAddUser(user)}>
                  <Avatar className={classes.davatar}>
                    {user.name
                      .split(' ')
                      .map((word) => word.charAt(0).toUpperCase())
                      .join('')}
                  </Avatar>
                  <CardContent>
                    <Typography variant="h6">{user.name}</Typography>
                    {/* <p>{user.user}</p> */}
                  </CardContent>
                </Card>
              ))}
          </div>
          <div>
            <Button variant="contained" color="primary" onClick={handleCreateChat}>Create Chat</Button>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
    <ToastContainer />
  </>
  )
}

export default creatGroup
