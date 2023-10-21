import request from 'superagent'
import moment from 'moment-with-locales-es6'
import findStaticStyle from './findStaticStyle'
import {serverFetchDataResult} from './serverFetch'
import {replaceChar} from '../services/functions'


const CULTURE = (language) => language===LANGUAGE_SV?'sv':language===LANGUAGE_ES?'es':'en'
const LANGUAGE_SV='SV'
const LANGUAGE_ES='ES'

const findParameter = (s, val) => {
  const idx = s.indexOf(val)  
  /* console.log('findParameter', val, 'idx',  idx) */
  if (idx !== -1) {
    const value = s.slice(idx).match(/(\d+)/)[0]
    return value
  } else {
    return undefined
  }  
}  

function _createEvent(props)  {
  const {start, end, title, description, location, email, staticStyleId, color, backgroundColorLight, backgroundColorDark, backgroundImage, borderStyle, borderWidth, borderColor} = props
  const mstart=moment(start)
  const mend=moment(end).add(start.length <= 10?-1:0, 'days')
  const timeStart = mstart.format('LT')
  const timeEnd = mend.format('LT')
  const fullDay = start.length <= 10 || (timeStart==="00:00" && timeEnd ==="00:00") && dateShift <= 1 || (timeStart==="00:00" && timeEnd ==="23:59")
  const durationHours = moment.duration(mend.diff(mstart)).asHours()
  const dateShift =  moment(end).dayOfYear() - moment(start).dayOfYear() 
  const dateRange=(mstart.format('ddd D/M') + ((dateShift && durationHours > 11)?(' - ' +  mend.format('ddd D/M')):''))
  const timeUnset =  (timeStart==="00:00" && timeEnd ==="00:00") 
  const maxPar = Number(findParameter(description, 'MAX_PAR'))
  const maxInd = Number(findParameter(description, 'MAX_IND'))
  const opacity = moment() < mend?1.0:0.4
  const background = "linear-gradient(to bottom right, " + backgroundColorLight + ", " + backgroundColorDark + ")"
  const style = 
    staticStyleId?
      findStaticStyle(staticStyleId, title, description, opacity)
    :backgroundImage?
        {color,
          //border, 
          //borderWidth, 
          //borderColor, 
          backgroundImage:`url(${backgroundImage})`, 
          backgroundPosition: 'center center',   
          backgroundRepeat:'auto', 
          backgroundSize:'cover', 
          backgroundColor:backgroundColorLight, 
          height:50, 
          fontWeight:'bold'}

    :  
        {color, background, borderStyle, borderWidth, borderColor}

  
  // alert('hours=' + durationHours)

  // var numberOfMinutes = duration.asMinutes()
  return ({
        ...props,
        email,    
        mstart,
        mend,
        maxInd,
        maxPar,
        fullDay, 
        timeUnset, 
        dateRange,
        durationHours, 
        isToday:moment().isSame(moment(start), 'day')?true:false,
        isWeekend:moment(start).isoWeekday() >=6,
        calendar:moment(start).calendar(),
        location:location?location:'Ingen plats angiven',
        city: cityForEvent(title, location),
        weekNumber: moment(start).isoWeek(),

        timeRange: fullDay?'Hela dagen':(mstart.format('LT') + '-' + mend.format('LT')),
        timeRangeWithDay: (dateShift && durationHours > 11)?(mstart.format('ddd LT') + '-' + mend.format('ddd LT'))
          :(mstart.format('LT') + '-' + mend.format('LT')),
        style,

        /* Registration props */
        maxRegistrants : Number(maxInd?maxInd:maxPar?(maxPar*2):500),
    })
}

function cityForEvent (title, location) {
  if ((title.toLowerCase().indexOf('malmö') !== -1) ||
      (title.toLowerCase().indexOf('malmö') !== -1) ||
      (title.toLowerCase().indexOf('lund') !== -1)) {
      return 'malmö'
  } else {        
      return location?(location.toLowerCase().indexOf('malmö') !== -1)?'Malmö'
             :(location.toLowerCase().indexOf('lund') !== -1)?'Lund'
             :(location.toLowerCase().indexOf('michael') !== -1)?'Lund'
             :(location.toLowerCase().indexOf('tangokompaniet') !== -1)?'Malmö'
             :(location.toLowerCase().indexOf('studio') !== -1)?'Malmö'
             :undefined:undefined          
  }    
}    

function _forceSmallFonts(event) {
  if ( (typeof _forceSmallFonts.mstartPreviousBigEvent == 'undefined')|| (event === undefined)) {
    // It has not... perform the initialization
    _forceSmallFonts.mstartPreviousBigEvent = moment('2000-01-01T00:00')
    return event
  } else if (event.durationHours > 24) {
      const daysBetweenEvents = moment.duration(event.mstart.diff(_forceSmallFonts.mstartPreviousBigEvent)).asDays()
      _forceSmallFonts.mstartPreviousBigEvent = event.mstart
      if (daysBetweenEvents < 6) {
        // alert(JSON.stringify({...event, forceSmallFonts:true}))
        return {...event, forceSmallFonts:true};
      } else {
        return event
      }
  } else {  
      return event
  }  
}  

// export means that this function will be available to any module that imports this module
export function getEventsFromGoogleCal (calendarId, apiKey, timeMin, timeMax, language, staticStyleId, handleReply) {
  const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=${true}&orderBy=startTime`
  request
    .get(url)
    .end((err, resp) => {
      if (!err) {
        // create array to push events into
        const events = []
        let event={}
        let moreThan24Hours = undefined
        let mstartLastBig =moment('2000-01-01')
        // in practice, this block should be wrapped in a try/catch block, 
        // because as with any external API, we can't be sure if the data will be what we expect
        moment.locale(CULTURE(language))
        _forceSmallFonts(undefined)

        JSON.parse(resp.text).items.forEach(it => {
          //alert(JSON.stringify(it))
          const start = it.start.dateTime?it.start.dateTime:it.start.date
          const end = it.end.dateTime?it.end.dateTime:it.end.date
          const title = it.summary?it.summary:'No Title'
          const description = it.description?it.description:''
          const location = it.location?it.location.replace(/Tangokompaniet, |, 212 11 |, 224 64|, 223 63|, Sverige|Stiftelsen Michael Hansens Kollegium, /g, ' ').replace('Fredriksbergsgatan','Fredriksbergsg.'):'Plats ej angiven'
          const eventId = it.id

          event = _createEvent({start, end, staticStyleId, title, description, location, eventId, email:'daniel@tangokompaniet.com', hideLocationAndTime:false, useRegistrationButton:false})

          event = _forceSmallFonts(event)

          events.push(event)

          let previousEnd = end
        })
        handleReply(events)
      } 
    })
}

export function getEventsFromTable (irl, callback, timeMin, timeMax, language) {
  moment.locale(CULTURE(language))
  let event = {}
  const events = []
  serverFetchDataResult(irl, '', '', list => {
    if (!!list) {
      list.forEach(it => {
        const location = it.location?it.location.replace(/Tangokompaniet, |, 212 11 |, 224 64|, 223 63|, Sverige|Stiftelsen Michael Hansens Kollegium, /g, ' ').replace('Fredriksbergsgatan','Fredriksbergsg.'):'No location given'
        const start = replaceChar(it.start, 'T', 10); // Fill in T between date and time in start (to get sorting work with Google Cal start)
        const end = replaceChar(it.end, 'T', 10); // Fill in T between date and time in start (to get sorting work with Google Cal start)
        // alert(start)
        event = _createEvent({...it, location, start, end})
        events.push(event)
      })
    } 

    // alert(JSON.stringify(events))
    callback(events)
  })
}

