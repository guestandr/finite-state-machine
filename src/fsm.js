class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (!(config instanceof Object))   throw new Error();

        this.config = JSON.parse(JSON.stringify(config));
        this.config.startInitital = this.config.initial;
        this.config.und = [this.config.initial];
        this.config.redo = [];
        this.config.isRedo = true;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.config.initial;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (!(state in this.config.states)) throw new Error(); 
        this.config.initial = state;
        this.config.und.push(this.config.initial);
         this.config.isRedo = false;
     
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        var k = this.config.initial;
        if (this.config.states[k].transitions[event]=== undefined) 
            throw new Error();
        this.config.initial = this.config.states[k].transitions[event]; 
        this.config.und.push(this.config.initial);  
         this.config.isRedo = false;
      
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.config.initial = this.config.startInitital;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if (event === undefined) {
            var arr = [];
            for (var key in this.config.states) 
               arr.push(key);
            return arr;
        }
        else
        {
            var arr2 = [];
            for (var key in this.config.states) {
                for (var k in this.config.states[key].transitions) {
                    if (k === event) {
                        arr2.push(key); break;
                    }
                }
        }
            return arr2;   
        }
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        this.config.redo.push(this.config.und[this.config.und.length-1]);
        this.config.und.pop();    
        if (this.config.und.length === 0) return false;
        this.config.initial = this.config.und[this.config.und.length-1];
        this.config.isRedo = true;
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if ((this.config.redo.length === 0) || (!this.config.isRedo) || (this.config.und.length === 0)) 
            return false;
        
        this.config.und.push(this.config.redo[this.config.und.length-1]);
        
        this.config.initial = this.config.redo[this.config.redo.length-1];
        this.config.redo.pop(); 

        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.config.und = [this.config.startInitital];
        this.config.redo = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
