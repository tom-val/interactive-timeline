import { Fab } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { Data } from '../../dto/data'
import Header from '../Header/Header'
import NavigationMenu from '../Menu/Menu'
import { ScrollTop } from '../ScrollTop/ScrollTop'
import TimeLine from '../Timeline/Timeline'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

import './App.css'

function App() {
    const [data, setData] = useState<Data | null>(null)

    useEffect(() => {
        fetch('../../data/data.json', {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })
            .then((res) => {
                return res.json()
            })
            .then((data: Data) => {
                setData(data)
            })
    }, [])

    return (
        <>          
            <Router>
            <NavigationMenu id="back-to-top-anchor"></NavigationMenu>
                <Switch>
                    <Route path="/about">
                    <Header
                        header={"Test"}
                        subHeader={"test"}
                    ></Header>
                    </Route>
                    <Route path="/">
                    {data ? (
                <>
                    <Header
                        header={data.headerData.header}
                        subHeader={data.headerData.subHeader}
                    ></Header>
                    <TimeLine></TimeLine>
                    <ScrollTop>
                        <Fab
                            color="secondary"
                            size="small"
                            aria-label="scroll back to top"
                        >
                            <KeyboardArrowUpIcon />
                        </Fab>
                    </ScrollTop>
                </>
            ) : (
                <span className="center">Loading...</span>
            )}
                    </Route>
                </Switch>
            </Router>

        </>
    )
}

export default App
