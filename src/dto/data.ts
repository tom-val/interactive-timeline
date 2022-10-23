export interface Data {
    headerData: HeaderData;
    timelineData: TimelineData[];
}

export interface HeaderData {
    header: string;
    subHeader: string;
}

export interface TimelineData {
    header: string;
    time: string;
    contentLines: string[];
    dialogData: DialogData[];
}

export interface DialogData {
    text: string;
    list: string[];
    secondText: string;
}