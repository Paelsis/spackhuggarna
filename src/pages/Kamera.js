import React, {useState, useEffect} from 'react';
import { useSharedState} from '../store';
import {serverFetchDataResult} from '../services/serverFetch';
import Camera from '../camera/Camera'
import Button, { buttonClasses } from '@mui/material/Button';
const SUBDIR = process.env.REACT_APP_IMAGE_SUBDIR

export default props => {   
    const [userSettings] = useSharedState()
    const [activeSubdir, setActiveSubdir] = useState(undefined)
    const [list, setList] = useState([])
    const subdir = props.subdir?props.subdir:SUBDIR //images/230928_Hos_Soren'  
    useEffect(() => {
      const url = '/listDirs?subdir=' + subdir
      serverFetchDataResult(url, '', '', list=> {setList(list)});
    }, [subdir])
    const handleClick = it => setActiveSubdir(subdir + '/' + it)

    return(
    <div className='columns p-2 is-centered is-vcentered is-align-items-center is-flex-wrap-wrap' style={{}}>
      {userSettings.email?
        <>
          {list.map(it=>
            <div className='column is-2'>
                <Button variant='outlined' style={{color:'black', borderColor:'black'}} onClick={()=>handleClick(it)}>
                    {it}
                </Button>
            </div>
          )}
          {activeSubdir?
            <div style={{width:'100%'}}>
                <Camera subdir = {activeSubdir} />
            </div> 
          :null}
        </>
      :null}  
    </div>
  )
}    
