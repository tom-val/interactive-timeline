/**
 * Stable IDs of timeline entries in chronological order (oldest → newest).
 * The Timeline component reverses this for display (newest first).
 * Translatable copy lives in src/i18n/locales/*.json under timeline.entries.<id>.
 */
export const TIMELINE_ENTRY_IDS = [
    'childhood',
    'highschool',
    'university',
    'internship',
    'internship2',
    'visma',
    'devbridge',
    'csharpcert',
    'railsr',
    'future',
] as const

export type TimelineEntryId = (typeof TIMELINE_ENTRY_IDS)[number]
