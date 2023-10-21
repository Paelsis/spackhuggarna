import React, {useState, useEffect} from 'react';
import  {Component } from 'react'

import FormTemplate from '../components/FormTemplate';
import Button from '@mui/material/Button';
import moment from 'moment-with-locales-es6'
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircleOutline';
import Tooltip from '@mui/material/Tooltip';
import { AirlineSeatReclineExtra, Description } from '@mui/icons-material';
import serverPost from '../services/serverPost'
import { getAuth, onAuthStateChanged} from 'firebase/auth';


const baseUrl = process.env.REACT_APP_API_BASE_URL

//import config from 'Settings/config' 
//const apiBaseUrl=config[process.env.NODE_ENV].apiBaseUrl;

const styles={
    container:{
        position: 'relative',
        backgroundColor:'pink'
    }    
  }

export default props => {
    const [value, setValue] = useState(props.children)
    const handleChange = e => setValue(e.target.value)
    return(
        props.email?
            <div style={styles.container}>
            <textarea 
                cols={30}
                rows={4}
                maxLength={props.maxLength?props.maxLength:200}
                value={value} onChange={handleChange}
            />

            <Button variant="outlined" onClick={props.handleUpdate}>Update</Button>        
            <Button variant="outlined" onClick={props.handleUpdateAll}>Update All</Button>        
            </div>           

        :
            <div style={{fontWeight:600}} dangerouslySetInnerHTML={{__html: props.children}} />
    )
        
}

