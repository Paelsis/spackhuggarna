import React, {useEffect, useState} from "react"
import { useSharedState, SharedStateProvider} from './store';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Usage from "./pages/Usage";
import Pdf from "./pages/Pdf";
import Pdf1 from "./pages/Pdf1";
import Bilder from "./pages/Bilder";
import Kamera from "./pages/Kamera";
import AppBar from './components/AppBar'
import FirebaseAuth from './login/FirebaseAuth'
import FirebaseSignin from './login/FirebaseSignin';
import FirebaseResetPassword from './login/FirebaseResetPassword';
import {COLORS} from './services/const'
import 'bulma/css/bulma.min.css';

import "./App.css"

const styles = {
    button: color => ({
        color,
        borderColor:color,
        backgroundColor:'transparent'
    }),
    notFound:{
        width:'100%', 
        textAlign:'center', 
        color:COLORS.BLACK
    }

}

const RedirectTo = props =>  {
    window.location.replace(props.url);
    return null;
}


const StringifyJSON = json => <h4>{JSON.stringify(json)}</h4>

export default function App() {
        return (
        <BrowserRouter> 
           <SharedStateProvider>
           <FirebaseAuth>
           <AppBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="home" element={<Home />} />
                <Route path="pdf" element={<Pdf />} />
                <Route path="pdf1" element={<Pdf1 />} />
                <Route path="bilder" element={<Bilder subdir="images"/>} />
                <Route path="kamera" element={<Kamera subdir="images"/>} />
                <Route path="settings" element={<Settings />} />
                <Route path="signin" element={<FirebaseSignin  />} />
                <Route path="resetPassword" element={<FirebaseResetPassword />} />
                <Route
                    path="*"
                    element={
                    <div style={styles.notFound}>
                        <h2>Page not found</h2>
                    </div>
                    }
                />
                </Routes>
           </FirebaseAuth>
           </SharedStateProvider>
        </BrowserRouter>
    );
  }
  
