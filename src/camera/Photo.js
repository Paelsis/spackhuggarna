import React, {useState} from 'react';

const styles = {
  container: expand =>({
    
    position:'relative',
    textAlign: 'center',
    // filter: expand?undefined:'invert(20%)',
    width:expand?'100%':'50%',
    zIndex:20000000,
    //height:'auto',
    color: 'black',
    fontSize:12,
    margin:'auto'
  }),
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    width:'100%',    
    height:'100%',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    //border:'20px groove red',
  },
  /* Top left text */
  topLeft: {
    position: 'absolute',
    top: 8,
    left: 16,
  },
  /* Top right text */
  topRight: {
    position: 'absolute',
    top: 8,
    right: 16,
  },
  /* Bottom left text */
  bottomLeft: {
    position: 'absolute',
    bottom: 8,
    left: 16,
  },
  /* Bottom right text */
  bottomRight: {
    position: 'absolute',
    bottom: -20,
    reight:16,
  },
  bottomCenter: {
    position: 'absolute',
    bottom: -25,
    left:12,
  },
  text:{
    textAlign:'center'
  }
 
}  
// Photo
export default props =>
{
  const {dirname, fname_thumb, fname, style} = props
  const [expand, setExpand] = useState(false)
  const src = dirname + '/' + (expand?fname:fname_thumb)
  const srcAlt = dirname + '/' + fname
  return(
    <>
        <div style={styles.container(expand)} onClick = {() =>setExpand(!expand)}>      
        <img src={src} alt={fname_thumb} style={style} />
        {false && !expand?<small style={styles.center}>{expand?null:fname}</small>:null}
        </div>
        {expand?<div style={styles.text}>{src}</div>:null}
    </>
  )
}
