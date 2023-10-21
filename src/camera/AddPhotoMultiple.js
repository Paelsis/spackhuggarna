import React, {Component} from 'react'
import axios from 'axios'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL

const BUTTON_COLOR={DEFAULT:'#888', OK:'green', PROCESSING:'lightGreen', WARNING:'orange', ERROR:'red'}

const styles={
  button:color=>({color, width:45, height:45, padding:0, border:0}),
  preview: {
    padding:1, 
    border:2, 
    borderStyle: 'dotted',
    borderColor:'red'
  }
}

class AddPhotoMultiple extends Component {
    constructor(props) {
      super(props);
      this.state = {
        buttonColor:BUTTON_COLOR.DEFAULT,
        selectedFiles:[],
        newFileNames: [],
        imagePreviewUrls: [],
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleReset(buttonColor) {
      this.setState({buttonColor, selectedFiles:[], imagePreviewUrls:[], newFileNames:[]});
    }  

    handleSubmit(event) {
      event.preventDefault();

      this.setState({buttonColor:BUTTON_COLOR.PROCESSING})

      if (this.state.selectedFiles.length > 0) {
        const formData = new FormData()
        //formData.append('rootdir', this.props.rootdir?this.props.rootdir:'')
        if (this.props.subdir) {
          formData.append('subdir', this.props.subdir?this.props.subdir:'')
        }
        // console.log(Object.fromEntries(formData))
        for(let i=0; i < this.state.selectedFiles.length; i++) {
          let selectedFile = this.state.selectedFiles[i]
          let newFileName = this.state.newFileNames[i]
          formData.append('newfile_arr[]', selectedFile, newFileName)
        } 
        // alert(JSON.stringify(Object.fromEntries(formData)))
        console.log('formData', Object.fromEntries(formData))
        const url = apiBaseUrl+'/postImages'
        axios.post(url, formData,
            {
                onUploadProgress: progressEvent => {console.log(progressEvent.loaded / progressEvent.total); }
            }
        ).then(response => {
            // alert('AddPhotoMultiple.handleSubmit: response.data' + JSON.stringify(response.data))
            if (this.props.addImage) {
              this.state.newFileNames.forEach(it => {
                this.props.addImage(it)
              }) 
            }
            this.setState({buttonColor:BUTTON_COLOR.OK})
            setTimeout(() => this.handleReset(BUTTON_COLOR.DEFAULT), 3000)
            if (response.data.status ==='OK') {
              this.props.setList(response.data.result)
            } else {
              alert('Posting image failed:' + JSON.stringify(response.data))
            }
        }).catch(error => {
            this.setState({buttonColor:BUTTON_COLOR.ERROR})
            alert('CCCCCC ERROR: Failed to post image:' + JSON.stringify(error));
            setTimeout(() => this.handleReset(BUTTON_COLOR.DEFAULT), 3000)
        });
      }
    }

    handleChange(e) {
      e.preventDefault();
      const selectedFiles = e.target.files;
      let imagePreviewUrls = []
      let newFileNames = []
      for(let i = 0; i < selectedFiles.length; i++) {
        const reader = new FileReader();
        reader.onloadend = () => {
          imagePreviewUrls = [...imagePreviewUrls, reader.result]
          newFileNames = [...newFileNames, selectedFiles[i].name]
          this.setState({selectedFiles, imagePreviewUrls, newFileNames})
        }
        reader.readAsDataURL(selectedFiles[i])
      }  
    }

    handleFileNameChange (e, ix) {
      // 1. Make a shallow copy of the items
      this.setState({
        newFileNames: [...this.state.newFileNames.slice(0,ix), e.target.value, ...this.state.newFileNames.slice(ix+1)]
      })
    }



    renderForm() {    
      return(
        <form className='columns is-centeded' onSubmit={e=>this.handleSubmit(e)}>
            <IconButton
              //className='column is-narrow'
              type='submit'
              size="large"
              edge="start"
              color="inherit"
              sx={{ mr: 0 }}
            >
              <Tooltip title='Spara bilden med det namn som står i fältet ovan'>
              <SaveIcon display='none' style={styles.button(this.state.buttonColor)} />
              </Tooltip>
            </IconButton>
            <IconButton
              //className='column is-narrow'
              type='button'
              size="large"
              edge="start"
              color="inherit"
              sx={{ mr: 0 }}
              onClick={()=>this.setState({selectedFiles: [], imagePreviewUrls:[], newFileNames:[], buttonColor:BUTTON_COLOR})}
            >
              <Tooltip title='Cancellera nedladdningen av fotot'>
              <CancelIcon style={styles.button(this.state.buttonColor)} />                              
              </Tooltip>
            </IconButton>
        </form>
      )
  }
  render() {
    let {imagePreviewUrls} = this.state;
    return (
      
        imagePreviewUrls.length > 0?
            <>
              <div className='columns is-centered is-flex-direction-column is-flex-wrap-wrap'>
                {imagePreviewUrls.map((it, ix)=>
                  <div key={'div' + ix} className='column is-one-quarter is-narrow'>            
                    <img key={'img' + ix} src={it} style={{padding:0, border:'2px dotted yellow'}}/>
                    <input 
                      key={'input' + ix}
                      type='text' 
                      style={{marginTop:0, paddingTop:0, height:20, fontSize:'x-small'}}
                      value={this.state.newFileNames[ix]} 
                      onChange={(e)=>this.handleFileNameChange(e, ix)}
                    />
                  </div>
                )} 
              </div>
              {this.renderForm()}
            </>
          :
          <div>
            <input 
              type="file" 
              name="newfile"
              accept="image/*, application/pdf" 
              onChange={this.handleChange} 
              style={{display:'none'}}
              ref={fileInput => this.fileInput = fileInput} 
              multiple
            />
            <div>
              <Tooltip title='Ladda ner en eller flera bilder från din dator eller mobil'>
              <AddAPhotoIcon style={styles.button(this.state.buttonColor)} onClick={()=>this.fileInput.click()} />
              </Tooltip>
            </div>
          </div>
    )
  }
}
  
export default AddPhotoMultiple
  