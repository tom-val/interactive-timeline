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
                        dialogContent={
                            <>
                                <p>
                                    Lorem Ipsum is simply dummy text of the
                                    printing and typesetting industry.
                                </p>
                                <p>
                                    Lorem Ipsum is simply dummy text of the
                                    printing and typesetting industry.
                                </p>
                            </>
                        }
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
                        dialogContent={
                          <>
                              <p>
                                  Lorem Ipsum is simply dummy text of the
                                  printing and typesetting industry.
                              </p>
                              <p>
                                  Lorem Ipsum is simply dummy text of the
                                  printing and typesetting industry.
                              </p>
                          </>
                      }
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
                        dialogContent={
                          <>
                              <p>
                                  Lorem Ipsum is simply dummy text of the
                                  printing and typesetting industry.
                              </p>
                              <p>
                                  Lorem Ipsum is simply dummy text of the
                                  printing and typesetting industry.
                              </p>
                          </>
                      }
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
                        dialogContent={
                          <>
                          <img src="https://ktu.edu/wp-content/uploads/2016/03/KTU-ikona.svg"></img>
                              <p>
                                  Lorem Ipsum is simply dummy text of the
                                  printing and typesetting industry.
                              </p>
                              <p>
                                  Lorem Ipsum is simply dummy text of the
                                  printing and typesetting industry.
                              </p>
                          </>
                      }
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
                        header="Internship"
                        time="Summer 2015"
                        even={false}
                        dialogContent={
                          <>
                              <p>
                                  Lorem Ipsum is simply dummy text of the
                                  printing and typesetting industry.
                              </p>
                              <p>
                                  Lorem Ipsum is simply dummy text of the
                                  printing and typesetting industry.
                              </p>
                          </>
                      }
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
                        header="Intersnhip Take Two"
                        time="Summer 2016"
                        even={true}
                        dialogContent={
                          <>
                              <p>
                                  Lorem Ipsum is simply dummy text of the
                                  printing and typesetting industry.
                              </p>
                              <p>
                                  Lorem Ipsum is simply dummy text of the
                                  printing and typesetting industry.
                              </p>
                          </>
                      }
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
                        header="Working at Visma"
                        time="September 2016"
                        even={false}
                        dialogContent={
                          <>
                              <p>
                                  Lorem Ipsum is simply dummy text of the
                                  printing and typesetting industry.
                              </p>
                              <p>
                                  Lorem Ipsum is simply dummy text of the
                                  printing and typesetting industry.
                              </p>
                          </>
                      }
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
                        header="Starting work at Devbridge"
                        time="June 2018"
                        even={true}
                        dialogContent={
                          <>
                              <p>
                                  Lorem Ipsum is simply dummy text of the
                                  printing and typesetting industry.
                              </p>
                              <p>
                                  Lorem Ipsum is simply dummy text of the
                                  printing and typesetting industry.
                              </p>
                          </>
                      }
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
                        header="Microsoft certificate"
                        time="November 2019"
                        even={false}
                        dialogContent={
                          <>
                              <p>
                                  Lorem Ipsum is simply dummy text of the
                                  printing and typesetting industry.
                              </p>
                              <p>
                                  Lorem Ipsum is simply dummy text of the
                                  printing and typesetting industry.
                              </p>
                          </>
                      }
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
                        header="Global pandemic"
                        time="Spring 2020"
                        even={true}
                        dialogContent={
                          <>
                              <p>
                                  Lorem Ipsum is simply dummy text of the
                                  printing and typesetting industry.
                              </p>
                              <p>
                                  Lorem Ipsum is simply dummy text of the
                                  printing and typesetting industry.
                              </p>
                          </>
                      }
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
                        header="Future prospects"
                        time="Future"
                        even={false}
                        dialogContent={
                          <>
                              <p>
                                  Lorem Ipsum is simply dummy text of the
                                  printing and typesetting industry.
                              </p>
                              <p>
                                  Lorem Ipsum is simply dummy text of the
                                  printing and typesetting industry.
                              </p>
                          </>
                      }
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
