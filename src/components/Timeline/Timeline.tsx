import React from 'react'
import TimeLineEntry from '../TimelineEntry/TimeLineEntry'
import './Timeline.css'

function TimeLine() {
    return (
        <div className="timeline">
            <ul>
                <li>
                    <TimeLineEntry
                        header="Childhood"
                        time="Early years"
                        even={false}
                    >
                        <p>
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry.
                        </p>
                        <p>
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry.
                        </p>
                    </TimeLineEntry>
                </li>

                <li>
                    <TimeLineEntry
                        header="High school"
                        time="Early years"
                        even={true}
                    >
                        <p>
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry.
                        </p>
                        <p>
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry.
                        </p>
                    </TimeLineEntry>
                </li>

                <li>
                    <TimeLineEntry
                        header="High school graduation"
                        time="June 2014"
                        even={false}
                    >
                        <p>
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry.
                        </p>
                        <p>
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry.
                        </p>
                    </TimeLineEntry>
                </li>

                <li>
                    <TimeLineEntry
                        header="Starting university"
                        time="September 2014"
                        even={true}
                    >
                        <p>
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry.
                        </p>
                        <p>
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry.
                        </p>
                    </TimeLineEntry>
                </li>
                <div className="clear"></div>
            </ul>
        </div>
    )
}

export default TimeLine
