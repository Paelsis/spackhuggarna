import React, {useState, useEffect} from 'react';
import { useSharedState} from '../store';
import Image from '../images/spackhuggarna.jpg';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import {serverFetchData} from '../services/serverFetch'
import {COLORS} from '../services/const'


const styles = {
    container:{
        backgroundColor:COLORS.BLACK,
        style:'absolute',
        top:0,
        width:'100%',
        height:'100vh',
    },
    img:{
        display:'block',
        marginLeft:'auto', marginRight:'auto',
        maxWidth:'100%',
        maxHeight:'calc(80vh - 70px)',
    },
    buttonContainer:{
        style:'absolute',
        width:'100%',
        height:'50vh',
        width:'100%',
        textAlign:'center',
        color:COLORS.YELLOW
    },
    button:{
        borderWidth:'2px',
        marginTop:10,
        marginLeft:5,
        marginRight:5,
        color:COLORS.YELLOW,
        borderColor:COLORS.YELLOW,
        backgroundColor:'transparent'
    },
    buttonRegion:{
        borderWidth:'2px',
        marginTop:10,
        marginLeft:5,
        marginRight:5,
        color:COLORS.RED,
        borderColor:COLORS.YELLOW,
        backgroundColor:'transparent'
    },
    buttonSkane:{
        borderWidth:'2px',
        marginTop:10,
        marginLeft:5,
        marginRight:5,
        color:COLORS.YELLOW,
        borderColor:COLORS.RED,
        backgroundColor:'transparent'
    },
    buttonDenmark:{
        borderWidth:'2px',
        marginTop:10,
        marginLeft:5,
        marginRight:5,
        color:COLORS.WHITE,
        borderColor:COLORS.RED,
        backgroundColor:'transparent'
    },
    buttonNorr:{
        borderWidth:'2px',
        marginTop:10,
        marginLeft:5,
        marginRight:5,
        color:COLORS.LIGHTBLUE,
        borderColor:COLORS.BLUE,
        backgroundColor:'transparent'
    }
}

const Home = () => {
    const [userSettings] = useSharedState()
    const navigate = useNavigate()
    const handleNavigate = lnk => {
        navigate(lnk)
    }
    return(
        <div style={styles.container}>
            {userSettings.email?
                <>
                    <img style={styles.img} src={Image} onClick={()=>handleNavigate('/calendar/skåne')}/>
                    {userSettings.email?
                        <div style={styles.buttonContainer}>
                            <p/>
                            <Button variant="outlined" type="button" style={styles.button}  onClick={()=>handleNavigate('/bilder')}>
                                Bilder                    
                            </Button>    
                            <Button variant="outlined" type="button" style={styles.button}  onClick={()=>handleNavigate('/pdf')}>
                                Pdf filer
                            </Button>    
                            <Button variant="outlined" type="button" style={styles.button}  onClick={()=>handleNavigate('/kamera')}>
                                Kamera
                            </Button>    
                        </div>
                    :null}    
                </>    
            :
                <h1>No access</h1>
            }
        </div>
    )
}

export default Home


//<div style = {{...styles.img, backgroundImage: `url(${Image})`}} />
