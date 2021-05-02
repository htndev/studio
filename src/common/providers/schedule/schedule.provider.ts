import { Injectable } from '@nestjs/common';
import { DateService } from '@xbeat/server-toolkit';

@Injectable()
export class ScheduleProvider {
  constructor(private readonly dateService: DateService) {}

  schedule(time: Date, task: (...args: any[]) => any, ...args: any[]): void {
    const timeDifference = time.getTime() - new Date().getTime();
    setTimeout(task, timeDifference, ...args);
  }
}
