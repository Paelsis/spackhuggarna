import React, {useContext} from "react"
import { getAuth, signOut, onAuthStateChanged} from 'firebase/auth';
import {Redirect} from "react-router"
import {AuthContext} from "login/FirebaseAuth"
import Button from '@mui/Button';
import tkColors from 'Settings/tkColors'



const FirebaseSignout = props => {
    const auth = getAuth()
    useEffect(()=>onAuthStateChanged(auth, user => {
          setUid(user.uid)
      }), [])
    const handleClick = () => {
        signOut(auth)
    }    
    const {user} = useContext(AuthContext)
    return(
        user===null?
            <Redirect to="/firebaseSignin" />
        :
            <div style={{display:'flex', width:'100%', textAlign:'center', verticalAlign:'center'}}>
                <h1>Firebase Signout</h1>
                <Button type="submit" variant="outlined"  size='small' style={{borderWidth:1, fontWeight:600,  borderRadius:4}} color={tkColors.Purple.Light} onClick={()=>handleClick()}>
                        Signout     
                </Button>    
            </div>    
    )
}


export default FirebaseSignout