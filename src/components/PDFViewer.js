
import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import Button from '@mui/material/Button';
import axios from 'axios'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

const styles = {
	nav:{
		margin:'auto'
	},
	button:{
		color:'black',
		borderColor:'black'
	}
}

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL
const baseDir = apiBaseUrl + '/pdf/'

const fileUrlTest='/pdf/test.pdf'



export default props => {
    const {fileUrl} = props
	const [numPages, setNumPages] = useState(0);
	const [pageNumber, setPageNumber] = useState(1);
	const [value, setValue] = useState();

	const onLoadSuccess = ({ numPages }) => {
		setNumPages(numPages);
	}


	const onLoadError = e => {
		alert('url:' + fileUrl + ' error url:' + JSON.stringify(e))
	}

	const goToPrevPage = () =>
		setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);


	const goToNextPage = () =>
		setPageNumber(
			pageNumber + 1 >= numPages ? numPages : pageNumber + 1,
		);
	const goToPage = pageNumber => setPageNumber(Math.min(pageNumber, numPages))

	const handleChange = e=>setValue(Math.min(Math.max(e.target.value, 1), numPages))

    const handleSubmit = e => {
		alert(JSON.stringify(e.target.value))
    }

	const Nav = () =>	
		<nav style={styles.nav}>
			<Button variant='outlined' style={styles.button} size='small' onClick={()=>goToPage(1)}>First</Button>
			<Button variant='outlined' style={styles.button} size='small' onClick={goToPrevPage}>Prev</Button>
			<Button variant='outlined' style={styles.button} size='small' onClick={goToNextPage}>Next</Button>
			<Button variant='outlined' style={styles.button} size='small' onClick={()=>goToPage(numPages)}>Last</Button>
			<p>
				Page {pageNumber} of {numPages}
			</p>
			<a href={fileUrl}>{fileUrl}</a>
		</nav>


		const ViewDocument = () =>		
		<Document
			file={fileUrl}
			onLoadSuccess={onLoadSuccess}
			onLoadError={onLoadError}
		>
			<Page pageNumber={pageNumber} />
		</Document>



	return (
		<>
			<div style={{height:50}} />
			<Nav />
			<ViewDocument fileUrl={fileUrl} pageNumber={pageNumber} onLoadSuccess={onLoadSuccess} />
		</>
	)
}

