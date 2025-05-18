import { WeekModel } from "./week.model";

export interface GroupModel {
    id: number;
    name: string;
    weeks: WeekModel[];
}