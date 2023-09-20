import { Answer } from "./answer";

export interface Player{
    id:number;
    name:string;
    points:number;
    answers:Answer[];
    shownComponent:string;
    activeBonuses?:string[];
}