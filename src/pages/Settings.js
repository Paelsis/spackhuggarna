import React, {useEffect, useRef, useState} from "react"
import { useNavigate } from "react-router-dom";
import { useSharedState } from '../store';
import firebaseApp from '../services/firebaseApp'
import { getAuth, onAuthStateChanged} from 'firebase/auth'
import FormTemplate from '../components/FormTemplate'
import SelectSettings from '../components/SelectSettings'
import {serverFetchDataResult} from '../services/serverFetch'
import serverPost from "../services/serverPost"
import Square from "../components/Square"

const styles = {
    container:{
      top:400,
      color:'green',
      fontSize:18,
      fontWeight:400,
    },
    button: color=>({
      color,
      border:'2px solid ' + color,
      padding:5
    }),
    input: color=>({
      color,
      borderColor:color,
      backgroundColor:'transparent',
      fontSize:24,
      fontWeight:200,
      outline: 0,
      border:'none',
      borderBottom: '2px solid ' + color,
      '&:hover':{
        backgroundColor:'red'
      }
    }),
    reset:{
      fontSize:10, 
    },
  }
  

  const fields = [
    {
      type:'text',
      label:'City:',
      name:'city',
      required:true,
      tooltip:'Events with same city is show in same calendar for that city',
      placeholder:'Please enter your city'
    },
    {
      type:'radio',
      label:'Region:',
      name:'region',
      radioValues:
        [
            'Skåne',
            'Väst',
            'Mitt',
            'Norr'
        ],
      required:true,
      tooltip:'Events with same region is show in same calendar for that region',
    },
    {
        type:'text',
        label:'User name',
        name:'name',
        required:'true', 
        tooltip:'First and last name of the logged in user',
        placeholder:'Please enter your name'
    },
    {
        type:'text',
        label:'Text color',
        required:'true', 
        tooltip: 'Text color in text or hex code, Ex 1:red Ex 2:#F6A3BB',
        name:'color',
    },
    {
        type:'text',
        label:'Background color light',
        required:'true', 
        tooltip: 'Light background color when shifting from dark to light, Ex 1:lightBlue Ex 2:#F6A3BB',
        name:'backgroundColorLight',
    },
    {
        type:'text',
        label:'Background color dark',
        required:'true', 
        tooltip: 'Dark background color when shifting from dark to light, Ex 1:darkBlue Ex 2:#F6A3BB',
        name:'backgroundColorDark',
    },
    {
      type:'text',
      label:'Background image (Use url of image)',
      tooltip: 'You can use a url to an image stored on internet type https://www.kasandbox.org/programming-images/avatars/marcimus-purple.png',
      name:'backgroundImage',
    },
    { 
      type:'checkbox',
      name:'hasBorder',
      label:'I want a border',
      tooltip: 'I want a border around my event',
    },
    { 
      type:'radio',
      name:'borderStyle',
      label:'BorderStyle',
      radioValues:['none', 'solid', 'dotted', 'dashed'],
      tooltip: 'Border style',
      notHiddenIf:'hasBorder'
    },
    { 
      type:'radio',
      name:'borderWidth',
      label:'Border thickness',
      radioValues:['1px', '2px', '3px', '4px'],
      tooltip: 'Thickness of border',
      notHiddenIf:'hasBorder'
    },
    {
      type:'text',
      label:'Border color',
      tooltip: 'Color of border',
      //disabled:true,
      name:'borderColor',
      notHiddenIf:'hasBorder'
    },
]


const BUTTON_STYLE = {
  DEFAULT:{color:'black', borderColor:'black', },
  CLICKED:{color:'yellow', borderColor:'yellow'},
  SAVED:{color:'green', borderColor:'green'},
  ERROR:{color:'red', borderColor:'red'},
}


// Settings.js
export default props => {

    const [email, setEmail] = useState(undefined)
    const [userSettings, setUserSettings] = useSharedState()
    const [buttonStyle, setButtonStyle] = useState(BUTTON_STYLE.DEFAULT)
    const auth = getAuth()
    const navigate = useNavigate()

    const handleResult = reply => {
      // alert('Settings:' + JSON.stringify(reply.result?reply.result:'No result'))
      if (reply && (reply.status === 'OK' && !!reply.result)) {
          setUserSettings({...userSettings, ...reply.result})
      } 
    }

    useEffect(()=>{
      onAuthStateChanged(auth, user => {
        if (user.email) {
          setEmail(user.email);
          const irl = '/getUser?email=' +  user.email
          serverFetchDataResult(irl, '', '', result=>handleResult(result))
        }  else {
          alert('No email fond when calling onAuthStateChange')
        }
      })
    }, [])
   
  
    const handleSaveReply = result => {
      if (result.status === 'OK') {
        const rec = result.rows.find(it=>it.email === email)
        // alert('RESULT value :' +  JSON.stringify(rec) + ' email:' + email)
        setButtonStyle(BUTTON_STYLE.SAVED)
        if (rec.namn) {
          setUserSettings(rec)
        }  
        setTimeout(() => setButtonStyle(BUTTON_STYLE.DEFAULT), 2000);
      } else {
        setButtonStyle(BUTTON_STYLE.ERROR) 
        setTimeout(() => setButtonStyle(BUTTON_STYLE.DEFAULT), 5000);
      }
    }

 



    const handleSave = (e, value) => {

        e.preventDefault()
        setButtonStyle(BUTTON_STYLE.CLICKED)
        if (!!email) {
          const backgroundImage = value.backgroundImage?value.backgroundImage:null
          const borderStyle = value.hasBorder?value.borderStyle:'none'
          const record = {...value, email, backgroundImage, creaTimestamp:undefined, updTimestamp:undefined, authLevel:undefined, borderStyle}
          const data = {tableName:'tbl_user', record, fetchRows:true}
          // alert('handleSubmit data:' + JSON.stringify(data))
          serverPost('/replaceRow', '', '', data, result=>handleSaveReply(result))
        } else {
          alert('Error: Dont save data since system cannot find any valid login email address')
        }         
    }

    const filterFields = fields.filter(it=>it.authLevel?userSettings.authLevel>=it.authLevel:true)
    const buttons=[
      {
          type:'button',
          label:'Save',
          style:buttonStyle,
          validate:true,
          handleClick:e=>handleSave(e, userSettings)
      },    
    ]

    return(  
      <div style={styles.container}>
        {email?
          <div className='columns m-4 is-centered'>
            {/*JSON.stringify(allUsers)*/}
            <div className='column is-4'>
            <FormTemplate 
                fields={filterFields} 
                value={userSettings}
                setValue={setUserSettings}
                buttons={buttons}
            />
            </div>
            <div className='column is-2'>
              <Square settings={userSettings} />
              {}
              <SelectSettings email={email} userSettings={userSettings} setUserSettings={setUserSettings} /> 
            </div>
          </div>           
        :
            <h1>
                No access
            </h1>
    }    
    </div>
  )  
}

