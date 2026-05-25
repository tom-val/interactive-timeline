import { useTranslation } from 'react-i18next'

import { DialogData } from '../../dto/data'
import { TIMELINE_ENTRY_IDS, TimelineEntryId } from '../../data/timelineEntries'
import TimeLineEntry from '../TimelineEntry/TimeLineEntry'

import './Timeline.css'

function asStringArray(value: unknown): string[] {
    return Array.isArray(value) ? (value as string[]) : []
}

function asDialogData(value: unknown): DialogData[] {
    return Array.isArray(value) ? (value as DialogData[]) : []
}

function TimeLine() {
    const { t } = useTranslation()

    // Newest first
    const entries = [...TIMELINE_ENTRY_IDS].reverse() as TimelineEntryId[]

    return (
        <div className="timeline">
            {entries.map((id) => {
                const base = `timeline.entries.${id}`
                return (
                    <TimeLineEntry
                        key={id}
                        header={t(`${base}.header`)}
                        time={t(`${base}.time`)}
                        content={asStringArray(
                            t(`${base}.contentLines`, { returnObjects: true })
                        )}
                        dialogData={asDialogData(
                            t(`${base}.dialogData`, { returnObjects: true })
                        )}
                    />
                )
            })}
        </div>
    )
}

export default TimeLine
