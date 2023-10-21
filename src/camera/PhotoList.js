import React, {useState, useEffect} from 'react'
import {serverFetchData} from '../services/serverFetch'
import Tooltip from '@mui/material/Tooltip'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import SaveIcon from '@mui/icons-material/Save';
import Rotate90DegIcon from '@mui/icons-material/RotateRight'
import CompressIcon from '@mui/icons-material/Compress'
import serverPost from '../services/serverPost'
import Photo from './Photo';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL
const BUTTON_COLOR={DEFAULT:'#888', OK:'green', PROCESSING:'lightGreen', WARNING:'orange', ERROR:'red'}


// PhotoList
export default props => {
        const {subdir, list, setList} = props;
        const [buttonColor, setButtonColor] = useState(BUTTON_COLOR.DEFAULT)


        const styles = {
                button:{color:buttonColor, width:45, height:45, padding:0, border:0},
        }

        const handleReplyFetchData = data => {
                if (data.status === 'OK') {
                    setList(data.result)
                } else {
                    alert('ERROR PhotoList:' +  JSON.stringify(data)) 
                }        
        }        

        useEffect(()=>{
                const irl='/listData?subdir=' + (subdir?subdir:'')
                serverFetchData(irl, '', '', handleReplyFetchData)
        },[subdir])

        const handleDelete = index => {
                const newList = list.map((it,idx)=>{
                        if (idx === index) {
                                return({...it, delete:it.delete?false:true})
                        } else {
                                return it
                        }
                })        
                setList(newList)
        }

        const handleRotate = index => {
                const newList = list.map((it, idx)=>{
                        if (idx === index) {
                                return({...it, rotate:(it.rotate && it.rotate !== 360)?it.rotate+90:90})
                        } else {
                                return it
                        }
                })        
                setList(newList)
        }

        const handleReplyCompress = data =>{
                if (data) {   
                    if (data.status==='OK') {
                        setButtonColor(BUTTON_COLOR.OK)
                        setTimeout(() => setButtonColor(BUTTON_COLOR.DEFAULT), 3000);
                        alert(data.message)
                    } else {
                        alert('JSON:' + JSON.stringify(data))
                    } 
                } else {
                        alert('ERROR: Reply contains no data').
                        setTimeout(() => setButtonColor(BUTTON_COLOR.DEFAULT), 3000);
                }                                
        }        

        const handleCompress = () => {
                setButtonColor(BUTTON_COLOR.PROCESSING)
                const url = apiBaseUrl + '/createThumbnails?subdir=' + subdir
                serverFetchData(url, '', '', handleReplyCompress)
        }

        const handleReply = data =>{
            if (data) {   
                if (data.status==='OK') {
                        // alert('Successful delete/rotate rotated: ' + reply.rotated + ' deleted: ' + reply.deleted + ' result:' + JSON.stringify(reply.result))
                        setList(data.result)
                        setButtonColor(BUTTON_COLOR.OK)
                        setTimeout(() => setButtonColor(BUTTON_COLOR.DEFAULT), 3000);
                } else {
                        setButtonColor(BUTTON_COLOR.ERROR)
                        alert('Delete/Rotate failed. Message, status:' + data.status + ' message:' + (data.message?data.message:'No message'))     
                        setTimeout(() => setButtonColor(BUTTON_COLOR.DEFAULT), 3000);
                }
            } else {
                alert('handleReply: ERROR: No reply from serverPost')     
            }    
        }

        const handleSave = () => {
                setButtonColor(BUTTON_COLOR.PROCESSING)
                const url = apiBaseUrl + '/removeOrRotateImages'
                const files = list
                serverPost(url, '', '', {subdir, files}, handleReply)
        }
        const path = apiBaseUrl + (subdir?('/'+subdir):'') 
        return (
                <div className="columns">
                        <div className="column is-2 is-centered">
                                <div className="column is-2">
                                        <Tooltip title='Spara ändringarna, dvs slängda filerna (rotation fungerar ej att spara)'>
                                        <SaveIcon style={styles.button} fontSize='large' onClick={handleSave} />
                                        </Tooltip>
                                </div>
                                <div className="column is-2">
                                        <Tooltip title='Skapa thumbnails för hela mappen'>
                                        <CompressIcon style={styles.button} fontSize='large' onClick={handleCompress} />
                                        </Tooltip>
                                </div>
                        </div>
                        <div className="column is-full-width columns is-centered is-flex-wrap-wrap">
                                {list.map((li, idx) =>
                                        <div key={idx} className='column is-narrow is-4'>
                                                <Photo dirname={path} fname={li.fname} fname_thumb={li.fname_thumb} style={{transform:li.rotate?"rotate(" + li.rotate + "deg)":undefined}} alt={path + li.fname}/>
                                                <p/>
                                                {li.delete?
                                                        <DeleteForeverIcon style={{color:'orange', fontSize:18}} onClick={()=>handleDelete(idx)} />     
                                                :        
                                                        <DeleteIcon style={{fontSize:16, opacity:0.3}} onClick={()=>handleDelete(idx)} />     
                                                }        
                                                {li.rotate?
                                                        <Rotate90DegIcon style={{color:'orange', fontSize:18}} onClick={()=>handleRotate(idx)} />     
                                                :     
                                                        <Rotate90DegIcon style={{fontSize:16, opacity:0.3}} onClick={()=>handleRotate(idx)} />     
                                                }          
                                        </div>        
                                )}
                        </div>
                </div>

        )
}


