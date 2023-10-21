import React, {useState, useEffect} from 'react';
import PDFViewer from '../components/PDFViewer1'

import { serverFetchDataResult } from '../services/serverFetch';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL
const baseDir = apiBaseUrl + '/pdf/'

export default () => {
  const [fileNames, setFileNames] = useState([])

  useEffect(()=>{
      serverFetchDataResult('/listPdf', undefined, undefined, setFileNames)
  }, [])

	return (
		<div>
      {fileNames.map(fname => 
        <>
          <h4>{baseDir + fname}</h4>
          <PDFViewer fileUrl={baseDir + fname} />
        </>
      )}
		</div>
	)
}


