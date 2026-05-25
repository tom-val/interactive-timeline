import React from 'react'
import { useTranslation } from 'react-i18next'

import { DialogData } from '../../dto/data'

import './TimeLineEntry.css'

interface TimeLineEntryProps {
    header: string
    time: string
    content: string[]
    dialogData: DialogData[]
}

function TimeLineEntry(prop: TimeLineEntryProps) {
    const { t } = useTranslation()
    const [expanded, setExpanded] = React.useState(false)
    const hasMore = prop.dialogData && prop.dialogData.length > 0

    const toggle = () => setExpanded((x) => !x)

    return (
        <article className="entry">
            <div className="entry-date">{prop.time}</div>
            <h3 className="entry-header">{prop.header}</h3>
            <div className="entry-body">
                {prop.content.map((line, i) => (
                    <p key={i}>{line}</p>
                ))}

                {hasMore && (
                    <div
                        className={`entry-extended ${
                            expanded ? 'entry-extended-open' : ''
                        }`}
                        aria-hidden={!expanded}
                    >
                        <div className="entry-extended-inner">
                            {prop.dialogData.map((d, i) => (
                                <React.Fragment key={i}>
                                    {d.text && <p>{d.text}</p>}
                                    {d.list && d.list.length > 0 && (
                                        <ul>
                                            {d.list.map((item, j) => (
                                                <li key={j}>{item}</li>
                                            ))}
                                        </ul>
                                    )}
                                    {d.secondText && <p>{d.secondText}</p>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                )}

                {hasMore && (
                    <button
                        type="button"
                        className="entry-toggle"
                        onClick={toggle}
                        aria-expanded={expanded}
                    >
                        {expanded
                            ? t('timelinePage.showLess')
                            : t('timelinePage.readMore')}
                    </button>
                )}
            </div>
        </article>
    )
}

export default TimeLineEntry
