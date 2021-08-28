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
                            'I grew up in a small town in Lithuania north.',
                        ]}
                    >
                        <>
                            <p>
                                I grew up in a small village in Lithuania called
                                Moškėnai. There are only a few houses in that
                                village, and there is a forest nearby.
                            </p>
                            <p>
                                I spent a lot of time being outside or being
                                cozy at home and reading books.
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
                            'Even before finishing school, I knew what I wanted to do.  So it was easy to choose exams and decide on the university.',
                            'I completed the required exams and finished high school, getting into the university I wanted.',
                        ]}
                    >
                        <>
                            <p>
                                I went to school in the nearest city available -
                                Rokiškis.
                            </p>
                            <p>
                                My grades were never perfect, but I also never
                                had any bad grades. I liked studying sciences -
                                Informatics, Mathematics, Physics. I also liked
                                studying a foreign language (English) and
                                history, but I've had some problems learning a
                                second foreign language - Russian, so I never
                                became proficient at it.
                            </p>
                            <p>
                                For the last two years of high school, we had to
                                choose subjects we wanted to study. While most
                                people struggled when choosing, at that time I
                                already knew that I want to study Informatics
                                technologies, so my choice was easy.
                            </p>
                            <p>
                                Before finishing high school we had to choose
                                and pass exams. I took five exams:
                                <ul>
                                    <li>Lithuanian language</li>
                                    <li>English language</li>
                                    <li>Informatics</li>
                                    <li>Math</li>
                                    <li>Physics</li>
                                </ul>
                                I've got the best results for Informatics and
                                Physics. After finishing exams I applied for
                                university and got accepted by my first pick.
                            </p>
                        </>
                    </TimeLineEntry>
                </li>

                <li>
                    <TimeLineEntry
                        header="University"
                        time="September 2014"
                        even={false}
                        content={[
                            'I studied Informatics Engineering at Kaunas Technology University.',
                            'Subjects included: programming, databases, cyber security, mathematics, statistics.',
                        ]}
                    >
                        <div className="image-container">
                            <img
                                className="image"
                                src="https://ktu.edu/wp-content/uploads/2016/03/KTU-ikona.svg"
                            ></img>
                        </div>
                        <p>
                            I studied Bachelors's degree in Informatics
                            Engineering at Kaunas Technology University for four
                            years.
                        </p>
                        <p>
                            During that time I learned quite a lot. For the
                            first two years, you have to learn more generic
                            things: Mathematics, Physics, Philosophy,
                            Statistics, Data structures. After two years
                            workstreams separate more, and specialization
                            subjects start.
                        </p>
                        <p>
                            From the first semester, I started learning the C++
                            programming language. The course started from
                            basics, but the course pace was quite fast, so you
                            had to keep attention to keep up.
                        </p>
                        <p>
                            Next year we had to use Java and PHP languages for a
                            few different subjects. Additionally, we had a
                            course for databases, where we learned about
                            different database types, database normalization,
                            and had to create a database from the ground up.
                        </p>
                        <p>
                            Third-year we had cyber security and embedded system
                            modules. We also got free credits and could choose
                            any topics we wanted. I picked API programming and
                            game development.
                        </p>
                        <p>
                            My Bachelor studies project was a problem
                            registering system for IT engineers. It was
                            WEB-based and built using Angular and Material UI,
                            and .NET for API.
                        </p>
                    </TimeLineEntry>
                </li>
                <li>
                    <TimeLineEntry
                        header="Internship"
                        time="Summer 2015"
                        even={true}
                        content={[
                            'After finishing my first year of university, I decided to look for an internship.',
                            'Since at the time I was aspiring to be an IT engineer, I started an internship at the company "Baltnetos Komunikacijos"',
                            'After completing the internship I understood that the IT engineer position is not for me.',
                        ]}
                    >
                        <p>
                            After finishing my first year of university, I
                            decided to look for internship opportunities. At the
                            time, I still wanted to be an IT engineer, so I
                            looked for something similar.
                        </p>
                        <p>
                            After passing the interview, I got accepted for an
                            internship at the company Baltnetos komunikacijos.
                            The company helped other businesses with IT
                            infrastructure and maintenance. I assisted two other
                            engineers in their daily duties.
                        </p>
                        <p>
                            I worked there for two months. During that time, I
                            learned more about computers, learned some tricks
                            regarding IT maintenance, and understood IT engineer
                            intricacies more. But the tasks were quite dull and
                            repetitive, and for the most part, ended by
                            reinstalling the operating system.
                        </p>
                        <p>
                            After thinking it through, I decided that it's not
                            something I want to pursue anymore.
                        </p>
                    </TimeLineEntry>
                </li>

                <li>
                    <TimeLineEntry
                        header="Intersnhip Take Two"
                        time="Summer 2016"
                        even={false}
                        content={[
                            'Next summer, I started another internship, this time as Software Developer in Visma.',
                            'I worked with 3 of my colleagues on the project for three months. After completing the internship, I started working there.',
                        ]}
                    >
                        <p>
                            After finishing my second year, I decided that its
                            time for a new internship, but this time for the
                            Software Developer role.
                        </p>
                        <p>
                            I took the test, passed it, and got accepted for a
                            Software Developer internship at Visma Lietuva.
                        </p>
                        <p>
                            I started an internship with three other colleagues
                            who also got accepted together with me. For the
                            first two weeks, we did exercises to learn more
                            about programming.
                        </p>
                        <p>
                            After two weeks, we started working on the project:
                            the auction system. It was a challenging project. We
                            had to consider many things: real-time bidding,
                            instant UI updates, validation rules, and async
                            update of ended auctions.
                        </p>
                        <p>
                            After finishing the internship, I started working at
                            Visma Lietuva.
                        </p>
                    </TimeLineEntry>
                </li>
                <li>
                    <TimeLineEntry
                        header="Working at Visma"
                        time="September 2016"
                        even={true}
                        content={[
                            'After completing the internship, I started working in Visma as Junior Software Developer.',
                            'I worked at Visma for nearly two years, for the most part working with integrations.',
                        ]}
                    >
                        <p>
                            After completing the internship, I started working
                            at Visma as Junior Software Developer.
                        </p>
                        <p>
                            For most of two years, I worked on various
                            integrations between Visma's in-house developed
                            system.
                        </p>
                        <p>
                            During that time, I was working alone without other
                            teammates. It helped to solidify my skills for
                            problem-solving. But at the same time, I noticed
                            that it is becoming hard to improve without anyone
                            telling me what you are doing wrong. Also, there was
                            quite some downtime, and tasks weren't always
                            available to pick up. Since the situation was not
                            going to improve soon, I decided that its time to
                            move on.
                        </p>
                    </TimeLineEntry>
                </li>

                <li>
                    <TimeLineEntry
                        header="Working at Devbridge"
                        time="June 2018"
                        even={false}
                        content={[
                            'After leaving Visma, I started working for Devbridge.',
                            'I worked on various projects within Devbridge and reached the Software Developer position.',
                        ]}
                    >
                        <p>
                            After leaving Visma and finishing my studies, I
                            started working for Devbridge company.
                        </p>
                        <p>
                            I came to work in Devbridge already having some
                            Software Developer experience, so I got assigned to
                            the project. The technology stack was the same as
                            before: .NET and Angular for the front end.
                        </p>
                        <p>
                            Devbridge is a services company, meaning that it is
                            working on products for other enterprises that hire
                            Devbridge. During my time at Devbridge, I've worked
                            on four different projects.
                        </p>
                        <p>
                            My current project is .NET based, has Microservices
                            architecture, and developed using Domain Driven
                            Design. The project before that was Node.js based
                            project. So there is a lot of variety and different
                            challenges.
                        </p>
                    </TimeLineEntry>
                </li>

                <li>
                    <TimeLineEntry
                        header="Microsoft C# certificate"
                        time="November 2019"
                        even={true}
                        content={[
                            'Since I started programming with .NET, I wanted to pass an exam and get a C# certificate.',
                            "Finally, I decided it's time to do it. In November 2019, I passed the exam and, I was certified C# Developer.",
                        ]}
                    >
                        <p>
                            I've studied for the exam using the Pluralsight
                            course and lengthy book about programming in C#.
                        </p>
                        <p>
                            The certificate itself does not give me any
                            benefits. But I liked the challenge, and I learned
                            some new things about .NET and C# programming
                            language.
                        </p>
                    </TimeLineEntry>
                </li>

                <li>
                    <TimeLineEntry
                        header="Global pandemic"
                        time="Spring 2020"
                        even={false}
                        content={[
                            'In 2020 Spring global pandemic shook the world.',
                            'During that time, I transitioned to remote work.',
                        ]}
                    >
                        <p>
                            During the pandemic, I was forced to work remotely
                            and adapted to this change rather quickly. I think
                            there are both benefits and downsides to remote
                            work. Biggest benefits:
                            <ul>
                                <li>No commute to work</li>
                                <li>
                                    Can focus on work more properly without
                                    noise
                                </li>
                                <li>Easier to plan time</li>
                            </ul>
                            And the biggest downside is communication. For the
                            most part, it's easier to communicate face to face,
                            but it greatly depends on company culture.
                        </p>
                    </TimeLineEntry>
                </li>

                <li>
                    <TimeLineEntry
                        header="Future"
                        time="Future"
                        even={true}
                        content={['Who knows what the future will bring?']}
                    >
                        <p>
                            I've been Software Developer for a few years now,
                            but the future still excites me, and I'm happy that
                            I am where I am today.
                        </p>
                    </TimeLineEntry>
                </li>
                <div className="clear"></div>
            </ul>
        </div>
    )
}

export default TimeLine
