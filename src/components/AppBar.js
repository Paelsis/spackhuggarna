import React, {useState, useEffect, useContext} from 'react';
import { useSharedState } from '../store';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';

import HomeIcon from '@mui/icons-material/Home';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import {AuthContext} from "../login/FirebaseAuth"
import {serverFetchDataResult} from '../services/serverFetch'
// AppBar.js
export default () => {
  const [userSettings, setUserSettings] = useSharedState()
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate()
  const auth = getAuth()
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = e => {
    setAnchorEl(null);
  };
  
  useEffect(()=>{
    onAuthStateChanged(auth, user => {
      if (user !== null) {
        setUserSettings({...(userSettings?userSettings:{}), email:user.email});
      } else {
        navigate('/signin')
      }
    })
  }, [])

  const handleNavigate = route => {
    navigate(route)
  }

  const handleSignout = () => {
    setUserSettings({...userSettings, email:undefined})
    signOut(auth)
    window.location.reload()
    navigate('/signin')
  }

  const handleSignin = () => {
    navigate('/signin')
  }

  return (
      <div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem><ListItemText inset></ListItemText></MenuItem>
        {userSettings?userSettings.email?<MenuItem onClick={()=>handleSignout()}>Signout</MenuItem>
        :<MenuItem onClick={()=>handleSignin()}>Signin</MenuItem>:null}
        {userSettings?userSettings.email?<MenuItem onClick={()=>navigate('/settings')}>Settings</MenuItem>:null:null}
        {userSettings?userSettings.email?<MenuItem onClick={()=>navigate('/add')}>Add Event</MenuItem>:null:null}
        <MenuItem onClick={()=>handleNavigate('/usage')}>Usage</MenuItem>
      </Menu>

      <Box sx={{ flexGrow: 2}}>
        <AppBar position="static" sx={{color:'#FFFFA7',  backgroundColor:'#232323'}}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 0 }}
              onClick={()=>handleNavigate('/home')}
              >
              <HomeIcon 
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
              />
            </IconButton>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}  onClick={()=>handleNavigate('/home')}>
            </Typography>
            <Typography variant="h8" component="div" sx={{ flexGrow: 4 }}  onClick={()=>handleNavigate('/home')}>
              {userSettings?userSettings.email?'Signed in ' + (userSettings.email?userSettings.email:null):null:null}
            </Typography>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 0 }}
              onClick={handleClick}
              >
              <MenuIcon 
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
              />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
      </div>
  );
}

/* {email?ADMINISTRATORS.includes(email)?<small>{JSON.stringify(userSettings)}</small>:null:null} */
