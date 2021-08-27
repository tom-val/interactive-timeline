import gsap from 'gsap';
import React, { MouseEvent } from 'react';
import './TimeLineEntry.css';

interface TimeLineEntryProps {
  header: string;
  time: string;
  even: boolean;
  children: React.ReactNode
}

function TimeLineEntry(prop: TimeLineEntryProps) {
  const onEnter = (event: MouseEvent) => {
    gsap.to(event.currentTarget, { scale: 1.1 });
  };
  
  const onLeave = (event: MouseEvent) => {
    gsap.to(event.currentTarget, { scale: 1 });
  };

  return (
    <div className="time-line-entry">
        <div className='content' onMouseEnter={onEnter} onMouseLeave={onLeave}>
          <h3>{prop.header}</h3>
          <>{prop.children}</>
        </div>
        <div className={`time ${prop.even ? 'even-time' : 'odd-time'}`} >
          <h4>{prop.time}</h4>
        </div>
      </div>
  );
}

export default TimeLineEntry;
