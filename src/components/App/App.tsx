import React, { useEffect, useState } from 'react'
import { Data } from '../../dto/data'
import Header from '../Header/Header'
import Menu from '../Menu/Menu'
import TimeLine from '../Timeline/Timeline'
import './App.css'

function App() {
    const [data, setData] = useState<Data | null>(null)

    useEffect(() => {
      console.log('works');
        fetch('../../data/data.json',
        {
          headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
           }
        })
            .then((res) => {
              return res.json();
            })
            .then((data: Data) => {
              setData(data);
            })
    }, [])

    return (
        <>
            <Menu></Menu>
            {data ? (
                <>
                    <Header
                        header={data.headerData.header}
                        subHeader={data.headerData.subHeader}
                    ></Header>
                    <TimeLine></TimeLine>
                </>
            ) : (
                <span className="center">Loading...</span>
            )}
        </>
    )
}

export default App
