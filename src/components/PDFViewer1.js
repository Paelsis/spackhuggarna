import { Worker, Viewer } from '@react-pdf-viewer/core';



// const WORKER_URL="https://unpkg.com/pdfjs-dist@3.124.120/build/pdf.worker.min.js"
const WORKER_URL="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js"

export default props => {
    const {fileUrl} = props
    return (
        <Worker workerUrl={WORKER_URL}>
            <Viewer 
                fileUrl={fileUrl} 
            />      
        </Worker>
    )
}