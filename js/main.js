const root = document.documentElement;



var app = new Vue({
    el: '#app',
    data: {
        notesSharp: ["C", "C", "D", "D", "E", "F", "F", "G", "G", "A", "A", "B"],
        notesFlat: ["C", "D", "D", "E", "E", "F", "G", "G", "A", "A", "B", "B"],
        keySignatureSigns: [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0],
        instrumentTuningPresets: {
            'Guitar': [4, 11, 7, 2, 9, 4], // E B G D A E
            'Bass (4 strings)': [7, 2, 9, 4], // G D A E
            'Bass (5 strings)': [7, 2, 9, 4, 11], // G D A E B
            'Ukulele': [9, 4, 0, 7] // A E C G
        },
        selectedInstrument: 'Guitar',
        showFlats: true,
        numberOfStrings: 6,
        numberOfFrets: 20,
        fretMark1: [4, 6, 8, 10, 15, 17, 19, 21],
        fretMark2: [13, 25],
        showAllNotes: false,
        showMultipleNotes: false,
        relativeTransposeValues: [0, 0, 0, 0, 0, 0],
        selectedInstrumentStandardTuning: [4, 11, 7, 2, 9, 4],
        currentTuning: []

    },
    methods: {
        generateNoteString: function(noteIndex, flats) {
            //sharpOrFlat         : false=sharps, true=flats
            noteIndex = ((noteIndex % 12) + 12) % 12;
            var noteString;
              
            if (flats) {
              noteString = this.notesFlat[noteIndex];
              if (this.keySignatureSigns[noteIndex] === 1) {
                noteString += "b";
              }
            } else {
              noteString = this.notesSharp[noteIndex];
              if (this.keySignatureSigns[noteIndex] === 1) {
                noteString += "#";
              }
            }
            return noteString;
          },
        setInstrument: function() {
            // Update Number of strings on instrument
            this.numberOfStrings = this.instrumentTuningPresets[this.selectedInstrument].length;
            // Set the currently selected instruments tuning
            this.selectedInstrumentStandardTuning = this.instrumentTuningPresets[this.selectedInstrument];
            // Set the current tuning to a copy of the standard tuning of the selected instrument
            this.currentTuning = this.selectedInstrumentStandardTuning.slice();
            // Set relativeTransposeValues to array of zeroes (reset transpose) with length equal to number of strings
            this.relativeTransposeValues = this.resetRelativeTransposeValues();
        },
        resetRelativeTransposeValues: function() {
            var relativeTransposeValuesArray = []
            for (var i = 0; i < this.numberOfStrings; i++) {
                relativeTransposeValuesArray.push(0);
            }
            return relativeTransposeValuesArray;
        },
        hideDot: function(event) {
            // if all notes are shown, don't do anything
            if (this.showAllNotes) {
                return;
            } else {
                // hide dot
                event.target.style.setProperty('--showDot', 0);
            }
            // Hide corresponding notes when hovering over text note names 
            if (event.target.classList.value === "text-note-name") {
                this.toggleMultipleNotes(event.target.textContent, 0);
            }
            if (this.showMultipleNotes) {
                this.toggleMultipleNotes(event.target.dataset.note, 0);
            }    
        },
        showDot: function(event) {
            if (this.showAllNotes) {
                return;
            } else {
                event.target.style.setProperty('--showDot', 1);
            }
            // Show corresponding notes when hovering over text note names 
            if (event.target.classList.value === "text-note-name") {
                this.toggleMultipleNotes(event.target.textContent, 1);
            }
            // Show all corresponding notes on the fretboard if showMultipleNotes is selected
            if (this.showMultipleNotes) {
                this.toggleMultipleNotes(event.target.dataset.note, 1);         
            }     
        },
        updateTuning: function(event, stringNumber) {
            var semitonesToTranspose = parseInt(event.target.value);
            var absoluteTransposeValue = this.selectedInstrumentStandardTuning[stringNumber] + semitonesToTranspose;
            // Set the current tuning arrays values to the selecet instrunents tuning plus the semitones to transpose
            this.currentTuning.splice(stringNumber, 1, absoluteTransposeValue);
        },
        resetTuning: function() {
            this.currentTuning = this.selectedInstrumentStandardTuning.slice();
            this.relativeTransposeValues = this.resetRelativeTransposeValues();
        },
        toggleMultipleNotes: function(noteName, showDot) {
            for (var i = 0; i < this.$refs.noteDiv.length; i++) {
                if (this.$refs.noteDiv[i].dataset.note === noteName) {
                    console.log(this.$refs.noteDiv[i].dataset.note);
                    this.$refs.noteDiv[i].style.setProperty('--showDot', showDot);
                }
            }
        }
    },
    created: function(){
        // initialize current tuning to a copy of the selected instruments standard tuning
        this.currentTuning = this.selectedInstrumentStandardTuning.slice();
    },
    watch: {
        numberOfStrings: function(val) {
            root.style.setProperty('--numberOfStrings', val);
        },
        showAllNotes: function(showAllNotes) {  
            if (showAllNotes) {
                // remove all style attributes from notes
                for (var i = 0; i < this.$refs.noteDiv.length; i++) {
                    this.$refs.noteDiv[i].removeAttribute('style');
                }
                // show all notes
                root.style.setProperty('--showDot', 1);
            } else {
                // hide all notes
                root.style.setProperty('--showDot', 0);
            }
        }
    }
});