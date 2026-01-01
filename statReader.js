import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

export class StatReader {

    static async readFile(path) {
        return new Promise((resolve, reject) => {
            let file = Gio.File.new_for_path(path);
            file.load_contents_async(null, (sourceObject, result) => {
                try {
                    let [success, contents] = sourceObject.load_contents_finish(result);
                    if (success) {
                        resolve(new TextDecoder().decode(contents));
                    } else {
                        reject(new Error('Failed to read file'));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    static async getCPUUsage(prevTotal, prevIdle) {
        try {
            const content = await this.readFile('/proc/stat');
            const lines = content.split('\n');
            const cpuLine = lines[0];
            
            if (cpuLine.startsWith('cpu ')) {
                const values = cpuLine.split(/\s+/).slice(1).map(v => parseInt(v));
                const idle = values[3] + values[4];
                const total = values.reduce((a, b) => a + b, 0);
                
                if (prevTotal !== 0) {
                    const diffIdle = idle - prevIdle;
                    const diffTotal = total - prevTotal;
                    const usage = ((diffTotal - diffIdle) / diffTotal) * 100;
                    return { usage, total, idle };
                }
                return { usage: 0, total, idle };
            }
        } catch (e) {
            logError(e, 'Error reading CPU stats');
        }
        return null;
    }

    static async getMemoryUsage() {
        try {
            const content = await this.readFile('/proc/meminfo');
            const lines = content.split('\n');
            
            let memTotal = 0, memAvailable = 0;
            
            for (let line of lines) {
                if (line.startsWith('MemTotal:')) {
                    memTotal = parseInt(line.split(/\s+/)[1]);
                } else if (line.startsWith('MemAvailable:')) {
                    memAvailable = parseInt(line.split(/\s+/)[1]);
                }
            }
            
            if (memTotal > 0) {
                const memUsed = memTotal - memAvailable;
                return (memUsed / memTotal) * 100;
            }
        } catch (e) {
            logError(e, 'Error reading memory stats');
        }
        return null;
    }

    static async getSwapUsage() {
        try {
            const content = await this.readFile('/proc/meminfo');
            const lines = content.split('\n');
            
            let swapTotal = 0, swapFree = 0;
            
            for (let line of lines) {
                if (line.startsWith('SwapTotal:')) {
                    swapTotal = parseInt(line.split(/\s+/)[1]);
                } else if (line.startsWith('SwapFree:')) {
                    swapFree = parseInt(line.split(/\s+/)[1]);
                }
            }
            
            if (swapTotal > 0) {
                const swapUsed = swapTotal - swapFree;
                return (swapUsed / swapTotal) * 100;
            }
            return 0;
        } catch (e) {
            logError(e, 'Error reading swap stats');
        }
        return null;
    }

    static async getLoadAverage() {
        try {
            const content = await this.readFile('/proc/loadavg');
            const values = content.trim().split(/\s+/);
            const load1 = parseFloat(values[0]);
            
            const cpuContent = await this.readFile('/proc/cpuinfo');
            const processors = cpuContent.match(/^processor/gm);
            const cores = processors ? processors.length : 1;
            
            return { load: load1, percent: (load1 / cores) * 100 };
        } catch (e) {
            logError(e, 'Error reading load stats');
        }
        return null;
    }
}
