import gsap from 'gsap'
import React, { MouseEvent } from 'react'
import { DialogData } from '../../dto/data'
import TimeLineDialog from '../TimeLineDialog/TimeLineDialog'
import './TimeLineEntry.css'

interface TimeLineEntryProps {
    header: string
    time: string
    even: boolean
    content: string[]
    dialogData: DialogData[]
}

function TimeLineEntry(prop: TimeLineEntryProps) {
    const onEnter = (event: MouseEvent) => {
        gsap.to(event.currentTarget, { scale: 1.1 })
    }

    const onLeave = (event: MouseEvent) => {
        gsap.to(event.currentTarget, { scale: 1 })
    }

    const [open, setOpen] = React.useState(false)

    const handleClickOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }

    return (
        <div className="time-line-entry">
            <div
                className="content"
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
                onClick={handleClickOpen}
            >
                <h3>{prop.header}</h3>
                {prop.content.map((content, i) => (
                    <p key={i}>{content}</p>
                ))}
            </div>
            <div className={`time ${prop.even ? 'even-time' : 'odd-time'}`}>
                <h4>{prop.time}</h4>
            </div>
            <TimeLineDialog
                title={prop.header}
                open={open}
                dialogData={prop.dialogData}
                onClose={handleClose}  />
        </div>
    )
}

export default TimeLineEntry
