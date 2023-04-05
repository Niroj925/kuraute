import * as React from 'react';
import { styled } from '@mui/system';
import TabsUnstyled from '@mui/base/TabsUnstyled';
import TabsListUnstyled from '@mui/base/TabsListUnstyled';
import TabPanelUnstyled from '@mui/base/TabPanelUnstyled';
import { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';
import TabUnstyled, { tabUnstyledClasses } from '@mui/base/TabUnstyled';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, InputAdornment,Tab } from '@mui/material';
// import { Search } from '@mui/material/icons';
import SearchIcon from '@mui/icons-material/Search';

const blue = {
  50: '#F0F7FF',
  100: '#C2E0FF',
  200: '#80BFFF',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
  800: '#004C99',
  900: '#003A75',
};

const grey = {
  50: '#f6f8fa',
  100: '#eaeef2',
  200: '#d0d7de',
  300: '#afb8c1',
  400: '#8c959f',
  500: '#6e7781',
  600: '#57606a',
  700: '#424a53',
  800: '#32383f',
  900: '#24292f',
};

// const Tab = styled(TabUnstyled)`
//   font-family: IBM Plex Sans, sans-serif;
//   color: #fff;
//   cursor: pointer;
//   font-size: 0.875rem;
//   font-weight: 600;
//   background-color: transparent;
//   width: 100%;
//   padding: 10px 12px;
//   margin: 6px 6px;
//   border: none;
//   border-radius: 7px;
//   display: flex;
//   justify-content: center;

//   &:hover {
//     background-color: ${blue[400]};
//   }

//   &:focus {
//     color: #fff;
//     outline: 3px solid ${blue[200]};
//   }

//   &.${tabUnstyledClasses.selected} {
//     background-color: #fff;
//     color: ${blue[600]};
//   }

//   &.${buttonUnstyledClasses.disabled} {
//     opacity: 0.5;
//     cursor: not-allowed;
//   }
// `;

// const TabPanel = styled(TabPanelUnstyled)(
//   ({ theme }) => `
//   width: 100%;
//   font-family: IBM Plex Sans, sans-serif;
//   font-size: 0.875rem;
//   padding: 20px 12px;
//   background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
//   border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
//   border-radius: 12px;
//   opacity: 0.6;
//   `,
// );

const TabsList = styled(TabsListUnstyled)(
  ({ theme }) => `
  min-width: 400px;
  background-color: ${blue[500]};
  border-radius: 12px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
  box-shadow: 0px 4px 30px ${theme.palette.mode === 'dark' ? grey[900] : grey[200]};
  `,
);

export default function UnstyledTabsIntroduction() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [value,setValue] =useState('1');

  const handleChange=(event,newValue) =>{
    setValue(newValue);
}

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get(`http://localhost:8080/api/user?search=${searchQuery}`, {
      
        headers: {
          token: JSON.parse(localStorage.getItem("token"))
        },
        
      });
      setUsers(response.data);
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
  return (
    <TabContext value={value} >
  {/* <TabList 
            aria-label='tab example'
             onChange={handleChange} 
             textColor='secondary'
             indicatorColor='secondary'
             variant='scrollable'
             scrollButtons='auto'>
                <Tab label="Friends" value='1' />

                <Tab label='Chat' value='2'/>
                <Tab label='Profile' value='3' />
            </TabList> */}
            <div style={tabListClass}>
        <TabList onChange={handleChange}>
          <Tab label="Friends" value="1" />
          <Tab label="Chat" value="2" />
          <Tab label="Profile" value="3" />
        </TabList>
      </div>
      {/* <TabList>
        <Tab>friends</Tab>
        <Tab>chat</Tab>
        <Tab>profile</Tab>
      </TabList> */}
        
      <TabPanel value='1'>
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
      <div>
        {users&&users.map(user => (
          <div key={user.id}>
            <p>{user.name}</p>
            {/* <p>{user.email}</p> */}
          </div>
        ))}
      </div>
    </TabPanel>
      <TabPanel value='2'>Chat</TabPanel>
      <TabPanel value='3'>Profile</TabPanel>

    </TabContext>
  );
}