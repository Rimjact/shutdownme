/**
 * ShutdownMe core script.
 * © Rimjact, 2024
 */

const childProcess = require('child_process');

module.exports = {
    /**
     * Shutdown computer by options. 
     * 
     * @param {Object} options Shutdown options
     */
    shutdown: function(options) {
        if (!options) throw new Error('Failed to shutdown, options is null!');
    
        // Base cmd string
        let cmdString = 'shutdown';

        // Add cmd string arguments based on current platform
        switch (process.platform) {
            case 'linux':
            case 'darwin':
                // For sudo run
                if (options.sudoRun)
                    cmdString = 'sudo ' + cmdString;

                // Halt command
                cmdString += ' -h';
                break;
            case 'win32':
                // Shutdown command
                cmdString += ' -s';

                // 'Force' for close all opened apps
                if (options.closeApps)
                    cmdString += ' -f';
                break;
            default:
                throw new Error('Unsupported OS!');
        }

        // Add timer string argument to cmd
        const delaySeconds = this.getDelayInSeconds(options.delay);
        cmdString += this.getTimerString(delaySeconds);

        // Execute the shutdown command
        const cmd = { 'cmd': cmdString, 'debug': false };
        this.executeCommand(cmd);
    },
    /**
     * Reboot computer by options.
     * 
     * @param {Object} options Reboot options
     */
    reboot: function(options) {
        if (!options) throw new Error('Falied to reboot, options is null!');

        // Base cmd string
        let cmdString = 'shutdown -r';

        // Add cmd arguments based on current platform
        switch (process.platform) {
            // For Linux and MacOS
            case 'linux':
            case 'darwin':
                if (options.sudoRun)
                    cmdString = 'sudo ' + cmdString;

                break;
            // For Windows
            case 'win32':
                if (options.closeApps)
                    cmdString += ' -f';
            // For other platforms
            default:
                throw new Error('Unsupported OS!');
        }

        // Add timer string argument to cmd
        const delaySeconds = this.getDelayInSeconds(options.delay);
        cmdString += this.getTimerString(delaySeconds);

        // Execute the reboot command
        const cmd = { 'cmd': cmdString, 'debug': false };
        this.executeCommand(cmd);
    },
    /**
     * Abort executed shutdown command (Windows and Linux only).
     */
    abortCommand: function() {
        let cmdString = 'shutdown';

        switch (process.platform) {
            case 'linux':
                cmdString += ' -c';
                break;
            case 'win32':
                cmdString += ' -a';
                break;
            default:
                throw new Error('Unsupported OS!');
        }

        // Execute shutdown abort command
        const cmd = { 'cmd': cmdString, 'debug': false };
        this.executeCommand(cmd);
    },
    /**
     * Execute a target command.
     * 
     * @param {Object} command Command options. 
     */
    executeCommand: function(command) {
        if (command.debug) {
            console.log('Debug a shutdown command: ' + command);
            return;
        }

        childProcess.exec(command.cmd, err => {
            if (err) 
                console.log(err)
        });
    },
    /**
     * Return delay time in seconds by delay (hours, minutes, seconds).
     * 
     * @param {Object} delay Delay (hours, minutes, seconds)
     * @returns {number} Time in seconds
     */
    getDelayInSeconds: function(delay) {
        console.log(delay);
        let seconds = Number(delay.seconds);
        seconds += Number(delay.minutes) * 60;
        seconds += Number(delay.hours) * 3600;
        console.log(seconds);
        return seconds;
    },
    /**
     * Return timer string for cmd.
     * 
     * @param {number} delay Delay in seconds
     * @returns {string} Timer string 
     */
    getTimerString: function(delay) {
        let timerString = ' ';

        // Add argument based on current platform
        switch (process.platform) {
            // Command delay argumet for Linux
            case 'linux':
                if (delay === 0)
                    timerString += 'now';
                else
                    timerString += delay.toString();

                break;
            // Command delay argument for MacOS
            case 'darwin':
                if (delay === 0)
                    timerString += 'now';
                else {
                    let delayInMinutes = Math.round(delay / 60);

                    timerString += '-t ' + (delayInMinutes === 0 ? 1 : delayInMinutes).toString();
                }

                break;
            // Command delay argument for Windows
            case 'win32':
                if (delay === 0)
                    timerString += '-t 0';
                else
                    timerString += '-t ' + delay.toString();

                break;
            // For other OS
            default:
                throw new Error('Unsupported OS');
        }

        return timerString;
    }
}
