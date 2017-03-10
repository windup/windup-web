import {SchedulerService} from "../../../src/app/shared/scheduler.service";

export class SchedulerServiceMock extends SchedulerService {
    constructor() {
        super();
    }

    public setTimeout(callback: Function, time: number): any {
        this.timeoutHandles.push(callback);

        return this.timeoutHandles.length - 1;
    }

    public clearTimeout(index: any) {
        if (index > this.timeoutHandles.length) {
            throw new Error('Timeout not found');
        }

        this.timeoutHandles.splice(index, 1);
    }

    public setInterval(callback: Function, interval: number): any {
        this.intervalHandles.push(callback);

        return this.intervalHandles.length - 1;
    }

    public clearInterval(index: any) {
        if (index > this.intervalHandles.length) {
            throw new Error('Timeout not found');
        }

        this.intervalHandles.splice(index, 1);
    }

    public timerTick() {
        this.timeoutHandles.forEach(callback => callback());
        this.timeoutHandles = [];
    }

    public intervalTick() {
        this.intervalHandles.forEach(callback => callback());
    }

    public countTimeoutHandles() {
        return this.timeoutHandles.length;
    }

    public cleanup() {
        this.timeoutHandles = [];
        this.intervalHandles = [];
    }
}
