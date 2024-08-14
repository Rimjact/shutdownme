/** 
 * App Controller
 */
class AppController {
    constructor() {
        this.elements = {};
        
        this.elements.typeRadios = {};
        this.elements.typeRadios.powerOff = document.getElementById('radio-power-off');
        this.elements.typeRadios.reboot = document.getElementById('radio-reboot');

        this.elements.executeButton = document.getElementById('button-execute');
        this.elements.executeButtonIcon = document.getElementById('button-execute-icon');

        this.elements.timerInputs = {};
        this.elements.timerInputs.hours = document.getElementById('shutdown-timer-hours');
        this.elements.timerInputs.minutes = document.getElementById('shutdown-timer-minutes');
        this.elements.timerInputs.seconds = document.getElementById('shutdown-timer-seconds');

        this.shutdownStarted = false;
        this.shutdownTimer = { 
            "hours": 0,
            "minutes": 0,
            "seconds": 0
        };
        this.timerTimeOut = null;

        this.elements.executeButton.addEventListener('click', () => this.executeHandler())
    }

    // === Arrow functions ===
    /**
     * Handle execute button.
     */
    executeHandler = () => {
        if (!this.isTimerInputsHasValue()) return;

        if (this.shutdownStarted) {
            this.abort();
            this.shutdownStarted = false;
            this.timerTimeOut = null;
            this.elements.executeButtonIcon.classList.remove('ri-close-large-line');
            this.elements.executeButtonIcon.classList.add('ri-shut-down-line');
            return;
        }

        const shutdownType = this.getShutdownType();
        switch (shutdownType) {
            case 'power-off':
                this.powerOff();
                break;
            case 'reboot':
                this.reboot();
                break;
            default:
        }

        this.elements.executeButtonIcon.classList.add('ri-close-large-line');
        this.elements.executeButtonIcon.classList.remove('ri-shut-down-line');

        this.shutdownStarted = true;
    }
    
    /**
     * Power-off executer.
     */
    powerOff = () => {
        const options = this.getOptions();
        this.shutdownTimer = options.delay;
        this.timerTimeOut = setInterval(this.updateTimer, 1000);

        sdme.shutdown(options);
        this.disableTimerInputs();
    }

    /**
     * Reboot executer.
     */
    reboot = () => {
        const options = this.getOptions();
        this.shutdownTimer = options.delay;
        this.timerTimeOut = setInterval(this.updateTimer, 1000);

        sdme.reboot(options);
        this.disableTimerInputs();
    }

    /**
     * Abort executed command.
     */
    abort = () => {
        sdme.abort();
        this.enableTimerInputs();
    }

    /**
     * Check and return is timer inputs has value condition resoult.
     * @returns True or False
     */
    isTimerInputsHasValue = () => {
        const hoursInput = this.elements.timerInputs.hours;
        const minutesInput = this.elements.timerInputs.minutes;
        const secondsInput = this.elements.timerInputs.seconds;

        if (hoursInput.value === '') {
            hoursInput.focus();
            return false;
        }

        if (minutesInput.value === '') {
            minutesInput.focus();
            return false;
        }

        if (secondsInput.value === '') {
            secondsInput.focus();
            return false;
        }
        
        return true;
    }

    /**
     * Check and return shutdown type by checked radio.
     * 
     * @returns {string} power-off or reboot
     */
    getShutdownType = () => {
        const powerOffRadio = this.elements.typeRadios.powerOff;

        return powerOffRadio.checked ? 'power-off' : 'reboot';
    }

    /**
     * Disable timer inputs by add readonly attribute.
     */
    disableTimerInputs = () => {
        this.elements.timerInputs.hours.setAttribute('readonly', '');
        this.elements.timerInputs.minutes.setAttribute('readonly', '');
        this.elements.timerInputs.seconds.setAttribute('readonly', '');
    }

    /**
     * Enable timer inputs by remove readonly attribute.
     */
    enableTimerInputs = () => {
        this.elements.timerInputs.hours.removeAttribute('readonly');
        this.elements.timerInputs.minutes.removeAttribute('readonly');
        this.elements.timerInputs.seconds.removeAttribute('readonly');
    }

    /**
     * Make and return shutdown options.
     * 
     * @returns {Object} Options object
     */
    getOptions = () => {
        const hoursInput = this.elements.timerInputs.hours;
        const minutesInput = this.elements.timerInputs.minutes;
        const secondsInput = this.elements.timerInputs.seconds;  

        const options = {
            'closeApps': false,
            'sudoRun': true,
            'delay': {
                'hours': hoursInput.value,
                'minutes': minutesInput.value,
                'seconds': secondsInput.value
            }
        };

        return options;
    }

    /**
     * Update shutdown timer and display time.
     */
    updateTimer = () => {
        const hoursInput = this.elements.timerInputs.hours;
        const minutesInput = this.elements.timerInputs.minutes;
        const secondsInput = this.elements.timerInputs.seconds;  

        if (this.shutdownTimer.seconds == 0 &&
            this.shutdownTimer.minutes == 0 &&
            this.shutdownTimer.hours == 0) {
                this.timerTimeOut = null;
                return;
        }

        this.shutdownTimer.seconds -= 1;

        if (this.shutdownTimer.seconds < 0) {
            this.shutdownTimer.minutes -= 1;
            this.shutdownTimer.seconds = 59;
        }
        
        if (this.shutdownTimer.minutes < 0) {
            this.shutdownTimer.hours -= 1;
            this.shutdownTimer.minutes = 59;
        }

        hoursInput.value = this.shutdownTimer.hours;
        minutesInput.value = this.shutdownTimer.minutes;
        secondsInput.value = this.shutdownTimer.seconds;
    }
}