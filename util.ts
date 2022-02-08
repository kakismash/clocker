import crypto from 'crypto';

export class Clocker {
    id: string;
    firstname: string;
    lastname: string;
    middleInitial: string;
    email: string;
    gender: string;
    age: number;
}

export const generateUUIDClocker = (clocker: Clocker): Clocker => {
    clocker.id = crypto.randomBytes(16).toString("hex");
    return clocker;
};