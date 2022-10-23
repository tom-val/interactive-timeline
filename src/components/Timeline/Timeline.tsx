import React from 'react'
import { TimelineData } from '../../dto/data'
import TimeLineEntry from '../TimelineEntry/TimeLineEntry'
import './Timeline.css'

interface TimeLineProps {
    timelineData: TimelineData[]
}

function TimeLine(prop: TimeLineProps) {
    return (
        <div className="timeline">
            <ul>
                {prop.timelineData.map((data, i) => (
                    <li>
                        <TimeLineEntry
                            header={data.header}
                            time={data.time}
                            even={(i + 1) % 2 === 0}
                            content={data.contentLines}
                            dialogData={data.dialogData}
                        />
                    </li>
                ))}
                <div className="clear"></div>
            </ul>
        </div>
    )
}

export default TimeLine
