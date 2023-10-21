import React, {useEffect, useRef, useState} from "react"
import firebaseApp from '../services/firebaseApp'
import { getAuth, onAuthStateChanged} from 'firebase/auth'
import {serverFetchDataResult} from '../services/serverFetch'
import { ADMINISTRATORS } from "../services/const";

export default ({email, userSettings, setUserSettings}) => {
    const [users, setUsers] = useState([])

    const handleResult = result => {
        if (!!result) {
           setUsers(result)
        } else {
          alert(JSON.stringify(result))
          alert('Failed to fetch rows from tbl_user')
        }   
      }
  
    useEffect(()=>{
            const irl = '/getUsers'
            serverFetchDataResult(irl, '', '', result=>handleResult(result))
    }, [])

    const handleChange = e => {
        const user = users.find(it => e.target.value === it.email)
        setUserSettings(user)
        //alert(e.target.name + '=' + JSON.stringify(e.target.value))
    }

    return (
        <>
        {ADMINISTRATORS.includes(email)?
        <>
        <label>Choose user (only for administrators):</label>
        <select 
            name='email' 
            value={userSettings.email}
            onChange={handleChange}
        >
            <option selected disabled value={'test'}>Choose settings</option>
            {users.map(user => <option name={user.name} value={user.email} selected={userSettings.email === user.email} >{user.name}</option>)}
        </select>
        </>
        :null}
        </>
    )    
}



