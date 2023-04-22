import React,{useState,useEffect} from 'react';
import { Modal, Button ,Form,ListGroup,Badge} from 'react-bootstrap';
import {FaTrash} from 'react-icons/fa'
import axios from 'axios';
import style from '../styles/Dialogue.module.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyModal = ({ handleClose }) => {
    const [chatName, setChatName] = useState("");
    const [searchUser, setSearchUser] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleSearchUser = async () => {
    try {
      const response = await axios.get(
        `https://kurautebackend.onrender.com/api/user?search=${searchUser}`,
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
   console.log('user search')
  },[searchUser])

  const handleAddUser = (user) => {
    if (!selectedUsers.some((u) => u._id === user._id)) {
      setSelectedUsers((prev) => [...prev, user]);
    }
    console.log(selectedUsers);
  };

  const handleRemoveUser = (user) => {
    setSelectedUsers((prev) => prev.filter((u) => u._id !== user._id));
  };

  const handleCreateChat = async () => {
    const userIds = selectedUsers.map((user) => user._id);
    try {
        if(chatName!==""){
      const response = await axios.post(
        "https://kurautebackend.onrender.com/api/chat/group",
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
          setChatName("");
        }   
      }else{
        toast.error('Please provide a group chat Name', {
            position: "bottom-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
      }

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    <Modal show={true} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Group Chat</Modal.Title>
      </Modal.Header>
      <Modal.Body>
       <div>
        <div>
            {/* <Form.Label>Chat Name</Form.Label> */}
        <Form.Control
                      type="text"
                      placeholder="Enter group chat name"
                      value={chatName}
                      onChange={(e) => setChatName(e.target.value)}
                      fullWidth
                      margin="normal"
                      size='sm'
                    />
                 {/* <Form.Label>Search User</Form.Label> */}
                 <br/>
                 
  <Form.Control
    type="text"
    placeholder="Search Users"
    value={searchUser}
    onChange={(e) => setSearchUser(e.target.value)}
    size="sm"
  />
        </div>
        <hr/>
        <div>
  {selectedUsers.map((user) => (
    <Badge
      key={user.id}
      variant="outline-secondary"
      style={{ margin: '4px', cursor: 'pointer' }}
      onClick={() => handleRemoveUser(user)}
      className={style.badge}
    >
      {user.name}
      <FaTrash  className={style.badgeicon}/>
    </Badge>
  ))}
</div>
        <div>
        <div className={style.userbox}>
              <ListGroup style={{display:'flex',flexDirection:'column',margin:'10px'}} >
    {searchResults && searchResults.map((user) => (
      <ListGroup.Item key={user.id} 
      className="d-flex align-items-center" 
      action 
      onClick={() => handleAddUser(user)}
      style={{margin:'5px',fontSize:"20px",fontWeight:"bold"}}
      >
        <div>
          <h5>{user.name}</h5>
        </div>
      </ListGroup.Item>
    ))}
  </ListGroup>
          </div>
        </div>
        
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleCreateChat}>
          Create Group
        </Button>
      </Modal.Footer>
    </Modal>
    <ToastContainer/>
    </>
  );
};

export default MyModal;
