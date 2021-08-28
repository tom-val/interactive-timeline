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
                        content={[
                            'I grew up in a very small Lithuanian village',
                        ]}
                    >
                        <>
                            <p>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                            </p>
                            <p>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                            </p>
                        </>
                    </TimeLineEntry>
                </li>

                <li>
                    <TimeLineEntry
                        header="High school"
                        time="Until June 2014"
                        even={true}
                        content={[
                          'Even before finishing school I knew what I wanted to do, so it was easy to choose exams and decide on university',
                          'I completed required exams and finished high school, getting into university I wanted'
                        ]}
                    >
                            <>
                                <p>
                                    Even before finishing school I knew what I
                                    wanted to do, so it was easy to choose exams
                                    and decide on university
                                </p>
                            </>
                    </TimeLineEntry>
                </li>

                <li>
                    <TimeLineEntry
                        header="Starting university"
                        time="September 2014"
                        even={false}
                        content={[
                          'I studied Informatics Engineering at Kaunas Technology University.',
                          'I studied programming, databases, security, mathematics',
                          'I finished my Bachelors degree thesis and graduated from university'
                        ]}
                    >
                                <img src="https://ktu.edu/wp-content/uploads/2016/03/KTU-ikona.svg"></img>
                                <p>
                                    Lorem Ipsum is simply dummy text of the
                                    printing and typesetting industry.
                                </p>
                    </TimeLineEntry>
                </li>
                <li>
                    <TimeLineEntry
                        header="Internship"
                        time="Summer 2015"
                        even={true}
                        content={[
                          'After finishing first year of university I decided to look for internship.',
                          'Since at the time I was aspiring to be IT engineer, I started internship at company "Baltnetos Komunikacijos" ',
                          'After completing internship I understood that IT engineer position is not for me'
                        ]}
                    >
                                <p>
                                    Lorem Ipsum is simply dummy text of the
                                    printing and typesetting industry.
                                </p>
                                <p>
                                    Lorem Ipsum is simply dummy text of the
                                    printing and typesetting industry.
                                </p>
                    </TimeLineEntry>
                </li>

                <li>
                    <TimeLineEntry
                        header="Intersnhip Take Two"
                        time="Summer 2016"
                        even={false}
                        content={[
                          'Next summer I tried another internship, this time for programming in company "Visma Lietuva".',
                          'I worked with 3 of my colleagues on the project for 3 months. After completing internship I started working there.',
                        ]}
                    >
                                <p>
                                    Next summer I tried another internship, this time for programming in company "Visma Lietuva"
                                </p>
                                <p>
                                    I worked with 3 of my colleagues on the project for 3 months. After completing internship I started working there.
                                </p>
                    </TimeLineEntry>
                </li>
                <li>
                    <TimeLineEntry
                        header="Working at Visma"
                        time="September 2016"
                        even={true}
                        content={[
                          'After completing internship I started working in Visma as Junior Software Developer.',
                          'I worked in Visma for nearly two years, mostly working with integrations.',
                        ]}
                    >
                        <p>
                        After completing internship I started working in Visma as Junior Software Developer
                        </p>
                        <p>
                            I worked in Visma for nearly two years, mostly working with integrations.
                        </p>
                    </TimeLineEntry>
                </li>

                <li>
                    <TimeLineEntry
                        header="Starting work at Devbridge"
                        time="June 2018"
                        even={false}
                        content={[
                          'After leaving Visma I immediately started working in Devbridge.',
                          'I worked on various projects withing Devbridge.',
                        ]}
                    >
                        <p>
                            After leaving Visma I immediately started working in Devbridge.
                        </p>
                        <p>
                            I worked on various projects withing Devbridge
                        </p>
                    </TimeLineEntry>
                </li>

                <li>
                    <TimeLineEntry
                        header="Microsoft certificate"
                        time="November 2019"
                        even={true}
                        content={[
                          'Since I started programming I wanted to have C# certificate.',
                          "Finally I decided it's time to do it. I learned for it, passed the exam and I was certified C# Developer.",
                        ]}
                    >
                        <p>
                            Since I started programming I wanted to have C# certificate
                        </p>
                        <p>
                            Finally I decided it's time to do it. I learned for it, passed the exam and I was certified C# Developer.
                        </p>
                    </TimeLineEntry>
                </li>

                <li>
                    <TimeLineEntry
                        header="Global pandemic"
                        time="Spring 2020"
                        even={false}
                        content={[
                          'In 2020 global pandemic shook the world.',
                          'During that time everyone had to transition to remote work and adapt to changes.',
                        ]}
                    >
                        <p>
                            In 2020 global pandemic shook the world.
                        </p>
                        <p>
                            During that time everyone had to transition to remote work and adapt to changes.
                        </p>
                    </TimeLineEntry>
                </li>

                <li>
                    <TimeLineEntry
                        header="Future prospects"
                        time="Future"
                        even={true}
                        content={[
                          'Who knows what will future bring?',
                        ]}
                    >
                        <p>Who knows what will future bring?</p>
                    </TimeLineEntry>
                </li>
                <div className="clear"></div>
            </ul>
        </div>
    )
}

export default TimeLine
