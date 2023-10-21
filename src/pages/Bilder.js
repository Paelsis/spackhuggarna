import React, {useState, useEffect} from 'react';
import { useSharedState} from '../store';
import {serverFetchDataResult} from '../services/serverFetch';
import PhotoView from '../camera/PhotoView'
import Button, { buttonClasses } from '@mui/material/Button';
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL
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
    const handleClick = it => setActiveSubdir(activeSubdir?undefined:subdir + '/' + it)

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
                <PhotoView subdir = {activeSubdir} />
            </div> 
          :null}
        </>
      :null}  
    </div>
  )
}    
