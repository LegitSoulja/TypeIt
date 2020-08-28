(function(){
    'use strict';
    
    new class {
        
        constructor(){
            this.sentenceDivCorrect = document.querySelector('span.correct');
            this.sentenceDiv = document.querySelector('span.sentence');
            this.textarea = document.querySelector('textarea');
            this.errorsE = document.querySelector('.errors');
            this.time = document.querySelector('span.time');
            this.stageE = document.querySelector('span.stage');
            this.sentences = [];
            this.sentence = null;
            this.sentencePosition = 0;
            this.typed = null;
            fetch('typeit.json').then(x => x.json()).then(x => {
                this.sentences = x;
                this.createListeners();
                this.generate();
            });
            this.errors = 0;
            this.ignoredCodes = [8];
            this.interval = setInterval(this.update.bind(this), 1000);
            this.stage = 0;
            this.started= false;
            this.startTime = null;
        }
        
        rand(min, max) {
            if(arguments.length == 1) {
                max = min;
                min = 0;
            }
            return Math.floor(Math.random() * (max + min) - min);
        }
        
        createListeners(){
            this.textarea.onkeydown = function(e) {
                if(this.ignoredCodes.indexOf(e.keyCode) > -1) {
                    e.preventDefault();
                }
            }.bind(this);
            this.textarea.onkeypress = function(e){
                if(e.location == 1) return false;
                
                if(!this.started) {
                    this.started = true;
                    this.startTime = new Date().getTime();
                }
                
                if(!this.input(e.key)) {
                    if(e.key != '.') {
                        this.errors++;
                        this.errorsE.innerText = this.errors.toString();
                    }
                    
                    if(this.errors >= 5) {
                        alert('You loose! You\'ve made more than 5 mistakes! Learn to type!');
                        this.restart();
                    }
                    
                    e.preventDefault();
                }
            }.bind(this);
        }
        
        restart(){
            this.errors = 0;
            this.stage = 0;
            this.sentencePosition = 0;
            this.started = false;
            this.generate();
        }
        
        update (){
            if(this.sentencePosition > 0) {
                this.sentenceDiv.innerText = this.sentence.substr(this.sentencePosition);
                this.sentenceDivCorrect.innerText = this.sentence.substr(0, this.sentencePosition);
            }else {
                this.sentenceDiv.innerText = this.sentence;
                this.sentenceDivCorrect.innerText = "";
            }
            
            if(this.started && this.startTime != null) {
                let el = (new Date()).getTime() - this.startTime;
                let hours = Math.floor(Math.abs(el / (60000 * 60)));
                let minutes = Math.floor(Math.abs(el / 60000));
                let seconds = Math.floor(Math.abs(el / 1000));
                
                this.time.innerText = hours + ':' + minutes + ':' + seconds;
            }
            this.stageE.innerText = this.stage.toString();
            this.errorsE.innerText = this.errors.toString();
        }
        
        generate(){
            this.stage++;
            this.errors = 0;
            this.sentence = this.sentences[this.rand(0, this.sentences.length)];
            this.sentencePosition = 0;
            this.sentenceDivCorrect.innerText = "";
            this.textarea.value = "";
            this.update();
            
        }
        
        input(char) {
            if(this.sentence[this.sentencePosition] == char) {
                if(this.sentencePosition + 1 >= this.sentence.length) {
                    this.generate();
                    return false;
                }
                this.sentencePosition++;
                this.update();
                return true;
            }
            return false;
        }
        
        
    }
})();
