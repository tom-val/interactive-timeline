import { Fab } from '@mui/material'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import NavigationMenu from '../Menu/Menu'
import { ScrollTop } from '../ScrollTop/ScrollTop'
import Home from '../Home/Home'
import TimelinePage from '../Timeline/TimelinePage'

import './App.css'

function App() {
    return (
        <BrowserRouter>
            <NavigationMenu id="back-to-top-anchor" />
            <Routes>
                <Route path="/timeline" element={<TimelinePage />} />
                <Route path="/" element={<Home />} />
            </Routes>
            <ScrollTop>
                <Fab color="secondary" size="small" aria-label="scroll back to top">
                    <KeyboardArrowUpIcon />
                </Fab>
            </ScrollTop>
        </BrowserRouter>
    )
}

export default App
