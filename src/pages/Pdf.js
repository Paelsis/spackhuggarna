import React, {useState, useEffect} from 'react';
import { useSharedState} from '../store';

import Photos from './OLD_Bilder'
import PDFViewer from '../components/PDFViewer'

import { serverFetchDataResult } from '../services/serverFetch';

//const globalSubdir = process.env.REACT_APP_API_BASE_URL + '/' + 'pdf'

export default () => {
  const [fileNames, setFileNames] = useState([])
  const [userSettings, setUserSettings] = useSharedState()
  const subdir = process.env.REACT_APP_PDF_SUBDIR

  useEffect(() => {
    // alert(subdir)
    serverFetchDataResult("/listPdf?subdir=" + subdir, '', '', data => setFileNames(data))
  }, []);
  const getFileUrl = fname => {
    return('/' + subdir + '/' + fname)
  }

	return (
		<div className='columns is-flex is-centered is-flex-wrap-wrap'>
      {userSettings?userSettings.email?
        fileNames.map(fname => 
          <div className='column is-5'>
            <PDFViewer fileUrl = {getFileUrl(fname)} />
          </div>
        )
      :null:null}
		</div>
	)
}
/*
*/
