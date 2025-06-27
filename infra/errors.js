export class InternalServerError extends Error {
    constructor({cause}) {
        super("Internal server error this is a fallback error", {
            cause
        });
        this.name = "InternalServerError";
        this.action = "Report this error to the support team";
        this.statusCode = 500;
    }
 
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            action: this.action,
            status_code: this.statusCode,
        }
    }
}

