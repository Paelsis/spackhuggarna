
export const AVA_STATUS = {
    AV:'AV', // Avaiable space
    CC:'CC', // Completely closed
    CL:'CL', // Closed for leaders
    OL:'OL', // Overflow leaders (more than +3 leaders)
    CF:'CF', // Closed for followers
    OF:'OF', // Overflow followers (more than +3 followers)
}

export const AVA_STATUS_TEXT = {
    AV:{
      SV:'Platser kvar för både förare och följare.',
      EN:'Space available for both leaders and followers',
      ES:'Space available for both leaders and followers',
    }, 
    CC:{
      SV:'Dansen är fullbokad. Kontakta Tangkompaniet för eventuella återbud.',
      EN:'No space available. Contact Tangokompaniet and check for cancellations',
      ES:'No space available. Contact Tangokompaniet and check for cancellations',
    }, 
    CL:{
      SV:'Fullbokat för förare, bara platser kvar till följare',
      EN:'Fully booked for leaders, only space availabile for followers',
      ES:'Fully booked for leaders, only space availabile for followers',
    }, 
    OL:{
      SV:'Tillfälligt överskott på förare (+3), vänta och se om fler följare bokar sig',
      EN:'Temporary overflow of leaders (3), wait and see if more followers books',
      ES:'Temporary overflow of leaders (3), wait and see if more followers books',
    }, 
    CF:{
      SV:'Fullbokat för följare, bara platser kvar till förare',
      EN:'Fully booked for followers, only space availabile for leaders',
      ES:'Fully booked for followers, only space availabile for leaders',
    },
    OF:{
      SV:'Tillfälligt överskott på följare (+3), vänta och se om fler förare bokar sig',
      EN:'Temporary overflow of followers (3), wait and see if more förare bookar sig',
      ES:'Temporary overflow of followers (3), wait and see if more förare bookar sig',
    },
}     

export const COLORS = {
  YELLOW:'#FFFFA7',
  LIGHT_YELLOW:'#FFFFDA',
  BLACK:'black',
  RED:'#FF4D4D',
  WHITE:'white',
  BLUE:'blue',
  LIGHTBLUE:'lightBlue'
}


export const BUTTON_STYLE = {
  DEFAULT:{color:'black', borderColor:'black'},
  CLICKED:{color:'yellow', borderColor:'yellow'},
  SAVED:{color:'green', borderColor:'green'},
  ERROR:{color:'red', borderColor:'red'},
}

export const ADMINISTRATORS=['anita@tangosweden.se', 'anita.e.dobi@gmail.com', 'admin@tangosweden.se'];

