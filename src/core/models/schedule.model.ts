export interface ScheduleModel {
    groupId: string;
    date: number; // timestamp
    subjects: SubjectModel[];
}

export interface SubjectModel {
    name: string;
    room: string;
    teacher: string;
    time: string;
    type: string;
} 