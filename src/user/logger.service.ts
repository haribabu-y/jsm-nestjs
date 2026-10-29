import { Injectable } from "@nestjs/common";

@Injectable()
export class LoggerService {

    logMessage(message: string) {
        console.log(message);
    }
}