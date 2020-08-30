(function(){
    'use strict';
    
    const ARGS = Object.fromEntries((document.location.href.split('?').splice(1)[0] || 'lang=en').split('&').map(x => x.split('=')));
    const LANGUAGE = ARGS.lang;
    const typejson = 'https://legitsoulja.github.io/TypeIt/lang/typeit_'+LANGUAGE+'.json';
    
    new class {
        
        constructor(){
            
            this.types = [];
            this.typePointer = 0;
            this.type = "";
            this.started = false;
            this.stage = 0;
            this.mistakes = 0;
            this.mistakeCap = 5;
            this.time = 0;
            this.ignoredKeys = [8, 13];
            this.typeMeans = [];
            this.typed = 0;
            this.words = 0;
            this.tick = 0;
            this.el = {
                textarea: document.querySelector('textarea'),
                mistakes: document.querySelector('span.mistakes'),
                stage: document.querySelector('span.stage'),
                time: document.querySelector('span.time'),
                correct: document.querySelector('span.correct'),
                type: document.querySelector('span.type'),
                typed: document.querySelector('span.typed'),
                words: document.querySelector('span.words')
            };
            this.e = new Proxy(this.el, { get: (o, n) => ((o.hasOwnProperty(n)) ? o[n].innerText : ""),
                set: function(o, n, v) {
                    if(o.hasOwnProperty(n)) o[n].innerText = v;
                    return true;
                }
            });
            
            fetch(typejson + '?c=' + Math.random()).then(x => x.json()).then(this.init.bind(this));
            
        }
        
        init(types){
            this.types = types;
            this.type = "";
            this.registerListeners();
            this.generate();
            this.interval = setInterval(this.update.bind(this), 100);
        }
        
        registerListeners(){
            this.el.textarea.onkeydown = (e) => {
                if(this.ignoredKeys.indexOf(e.keyCode) > -1) 
                    return e.preventDefault();
            }
            this.el.textarea.onkeypress = this.keypress.bind(this);
        }
        
        keypress(e){
            if(!this.started) {
                this.started = true;
                this.time = (new Date()).getTime();
            }
            
            if(this.type[this.typePointer] != e.key){
                if(this.ignoredKeys.indexOf(e.keyCode) > -1) return false;
                this.mistakes++;
                if(this.mistakes >= this.mistakeCap) {
                    alert(['You loose!. You\'ve made '+this.mistakes + '/' + this.mistakeCap + 'mistakes. Learn to type!',
                     'Final Time: ' + this.getTime(),
                     'Letters Typed: ' + this.typed,
                     'Words Typed: ' + this.words,
                     'Average Words Per Minute: ' + ''
                    ].join('\r\n'));
                    this.restart();
                }
                this.updateView();
                return false;
            }
            this.typed++;
            if(e.keyCode == 32 || e.keyCode == 190) this.words++;
            if((this.typePointer += 1) >= this.type.length)
            {
                this.generate();
                return false;
            }
            this.updateView();
            return true;
        }
        
        getTime(){
            let el = ((this.time == 0) ? 0 : ((new Date()).getTime() - this.time));
            let hours = Math.floor(Math.abs(el / (60000 * 60)));
            let minutes = Math.floor(Math.abs(el / 60000));
            let seconds = Math.floor(Math.abs(el / 1000) % 60);
            hours = (hours > 10) ? hours : ('0' + hours);
            minutes = (minutes > 10) ? minutes : ('0' + minutes);
            seconds = (seconds > 10) ? seconds : ('0' + seconds);
            return hours + ':' + minutes + ':' + seconds;
        }
        
        updateView(){
            this.e.type = ((this.typePointer > 0) ? this.type.substr(this.typePointer) : this.type);
            this.e.correct = ((this.typePointer > 0) ? this.type.substr(0, this.typePointer) : "");
            this.mistakeCap = (2 * this.stage) * 2 + 1;
            this.e.mistakes = this.mistakes.toString() + '/' + this.mistakeCap;
            this.e.stage = this.stage.toString();
            this.e.typed = this.typed.toString();
            this.e.words = this.words.toString();
            
        }
        
        update(){
            this.tick++;
            // keep view updated incase someone tries to "edit" html lol.
            if(this.tick % 5 == 0) this.updateView();
            if(this.tick % 10 == 0) {
                this.e.time = this.getTime();
                if(this.typeMeans.length == 0) {
                    if(this.typed != 0) this.typeMeans.push(this.typed);
                }else {
                    let last = this.typeMeans[this.typeMeans.length - 1];
                    let add = this.typed - last;
                    if(add != 0 && last != add) this.typeMeans.push(add);
                }
            }
        }
        
        generate(){
            this.type = this.types[this.rand(0, this.types.length)];
            this.el.textarea.value = "";
            this.typePointer = 0;
            this.stage++;
            this.updateView();
        }
        
        restart(){
            this.stage = 0;
            this.mistakes = 0;
            this.tick = 0;
            this.words = 0;
            this.time = 0;
            this.typeMeans = [];
            this.typed = 0;
            this.typePointer = 0;
            this.started = false;
            this.generate();
        }
        
        rand(min, max) {
            return Math.floor(Math.random() * (max + min) - min);
        }
        
        
    }
    
})();
