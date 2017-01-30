import {Injectable} from "@angular/core";

@Injectable()
export class SchedulerService {
    protected timeoutHandles: any[] = [];
    protected intervalHandles: any[] = [];

    public setTimeout(callback: Function, time: number): any {
        let handle = setTimeout(callback, time);
        this.timeoutHandles.push(handle);

        return handle;
    }

    public clearTimeout(resource: any) {
        let index = this.timeoutHandles.indexOf(resource);

        if (index === -1) {
            throw new Error('Timeout not found');
        }

        clearTimeout(this.timeoutHandles[index]);
        this.timeoutHandles.splice(index, 1);
    }

    public setInterval(callback: Function, interval: number): any {
        let handle = setInterval(callback, interval);
        this.intervalHandles.push(handle);

        return handle;
    }

    public clearInterval(resource: any) {
        let index = this.intervalHandles.indexOf(resource);

        if (index === -1) {
            throw new Error('Interval not found');
        }

        clearInterval(this.intervalHandles[index]);
        this.intervalHandles.splice(index, 1);
    }

    public cleanup() {
        this.timeoutHandles.forEach(handle => clearTimeout(handle));
        this.intervalHandles.forEach(handle => clearInterval(handle));

        this.timeoutHandles = [];
        this.intervalHandles = [];
    }
}
