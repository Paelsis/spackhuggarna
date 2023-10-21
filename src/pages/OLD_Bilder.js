import React, {useState, useEffect} from 'react';
import { useSharedState} from '../store';
import {serverFetchDataResult} from '../services/serverFetch';
import Photo from '../camera/Photo'
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL
const SUBDIR = process.env.REACT_APP_IMAGE_SUBDIR

export default props => {   
    const [userSettings] = useSharedState()
    const subdir = props.subdir?props.subdir:SUBDIR //images/230928_Hos_Soren'  
    const [list, setList] = useState([])
    useEffect(() => {
      const url = '/listData?subdir=' + subdir
      serverFetchDataResult(url, '', '', list=> {setList(list)});
    }, [subdir])
    const dirname = apiBaseUrl + '/' + subdir.trim('/')
    return(
    <div className='columns p-6 is-centered is-vcentered is-align-items-center is-flex-wrap-wrap' style={{}}>
      {userSettings.email?
        <>
          {list.map(it=>
            <div className='column is-4'>
              <Photo dirname={dirname} fname={it.fname} fname_thumb={it.fname_thumb} />
            </div>
          )}
        </>
      :null}  
    </div>
  )
}    

