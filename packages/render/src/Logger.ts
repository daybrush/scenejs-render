export class Logger {
    constructor(
        private _logger?: (...messages: string[]) => void,
        private _log?: boolean,
    ) {}
    log(...messages: string[]) {
        this._logger?.(...messages);

        if (!this._log) {
            return;
        }
        console.log(...messages);
    }
}
