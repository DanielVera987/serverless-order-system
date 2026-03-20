export default class Logger {
    static success(message: string) {
        console.log(`✅ ${message}`);
    }

    static init(message: string) {
        console.log(`🚀 ${message}`);
    }

    static log(message: string) {
        console.log(`🔵 ${message}`);
    }

    static error(message: string) {
        console.error(`❌ ${message}`);
    }

    static warn(message: string) {
        console.warn(`⚠️ ${message}`);
    }
    
    static debug(message: string) {
        console.debug(`🐛 ${message}`);
    }

    static trace(message: string) {
        console.trace(`🔍 ${message}`);
    }

    static notify(message: string) {
        console.log(`🔔 ${message}`);
    }
}