import Gio from 'gi://Gio';
import GLib from 'gi://GLib';

export class StatReader {

    static _amdGPUPath = null;
    static _intelGPUPath = null;

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

    static async getGPUUsage() {
        try {
            // Try NVIDIA first
            const nvidiaSmi = Gio.File.new_for_path('/usr/bin/nvidia-smi');
            if (nvidiaSmi.query_exists(null)) {
                return await this._getNvidiaGPUUsage();
            }
            
            // Try AMD. The DRM card and hwmon indexes are not stable, so discover
            // the device instead of assuming card0 or a particular hwmon number.
            const amdUsage = await this._getAMDGPUUsage();
            if (amdUsage !== null) {
                return amdUsage;
            }
            
            // Try Intel
            const intelUsage = await this._getIntelGPUUsage();
            if (intelUsage !== null) {
                return intelUsage;
            }
        } catch (e) {
            logError(e, 'Error reading GPU stats');
        }
        return null;
    }

    static async _getNvidiaGPUUsage() {
        return new Promise(resolve => {
            try {
                const subprocess = Gio.Subprocess.new(
                    ['nvidia-smi', '--query-gpu=utilization.gpu', '--format=csv,noheader,nounits'],
                    Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_SILENCE
                );

                subprocess.communicate_utf8_async(null, null, (source, result) => {
                    try {
                        const [, stdout] = source.communicate_utf8_finish(result);
                        const usage = parseFloat(stdout.trim());

                        resolve(!isNaN(usage) ? usage : null);
                    } catch (e) {
                        resolve(null);
                    }
                });
            } catch (e) {
                resolve(null);
            }
        });
    }

    static async _getAMDGPUUsage() {
        const locations = [
            ['/sys/class/drm', /^card\d+$/, 'device/gpu_busy_percent'],
            ['/sys/class/hwmon', /^hwmon\d+$/, 'device/gpu_busy_percent'],
        ];

        const result = await this._readDiscoveredStat(this._amdGPUPath, locations);
        if (result === null) {
            this._amdGPUPath = null;
            return null;
        }

        this._amdGPUPath = result.path;
        const usage = parseInt(result.content.trim());
        return !isNaN(usage) ? usage : null;
    }

    static async _getIntelGPUUsage() {
        const locations = [
            ['/sys/class/drm', /^card\d+$/, 'gt_cur_freq_mhz'],
        ];
        const result = await this._readDiscoveredStat(this._intelGPUPath, locations);
        if (result === null) {
            this._intelGPUPath = null;
            return null;
        }

        this._intelGPUPath = result.path;

        try {
            // Intel integrated graphics usage is more complex to read. This is a
            // simplified approach that estimates it from the current frequency.
            const maxFreqPath = result.path.replace('gt_cur_freq_mhz', 'gt_max_freq_mhz');
            const maxFreqContent = await this.readFile(maxFreqPath);
            const curFreq = parseInt(result.content.trim());
            const maxFreq = parseInt(maxFreqContent.trim());

            return !isNaN(curFreq) && !isNaN(maxFreq) && maxFreq > 0
                ? (curFreq / maxFreq) * 100
                : null;
        } catch (e) {
            return null;
        }
    }

    static async _readDiscoveredStat(cachedPath, locations) {
        if (cachedPath !== null) {
            try {
                return {path: cachedPath, content: await this.readFile(cachedPath)};
            } catch (e) {
                // The device index may have changed; discover it again.
            }
        }

        for (const [directory, namePattern, relativePath] of locations) {
            const names = await this._listDirectory(directory);
            for (const name of names) {
                if (!namePattern.test(name))
                    continue;

                const path = `${directory}/${name}/${relativePath}`;
                try {
                    return {path, content: await this.readFile(path)};
                } catch (e) {
                    // Continue looking for another GPU device.
                }
            }
        }

        return null;
    }

    static async _listDirectory(path) {
        return new Promise(resolve => {
            const directory = Gio.File.new_for_path(path);
            directory.enumerate_children_async(
                'standard::name',
                Gio.FileQueryInfoFlags.NONE,
                GLib.PRIORITY_DEFAULT,
                null,
                (source, result) => {
                    try {
                        const enumerator = source.enumerate_children_finish(result);
                        const names = [];
                        let info;
                        while ((info = enumerator.next_file(null)) !== null)
                            names.push(info.get_name());
                        enumerator.close(null);
                        resolve(names);
                    } catch (e) {
                        resolve([]);
                    }
                }
            );
        });
    }
}
