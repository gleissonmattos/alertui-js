/**
* AlertUi.JS
*
* Licensed under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
*
* Copyright 2016, Gleisson Matos
* http://github.com/gleissonmattos
* Report: contato.mattos@outlook.com
* 
*/

;( function( context, namespace ) {
    'use strict';
    
    var alertuiWin = window[namespace];
    
    // functions to general utilizations
    var proto = {
        
        /**
         * Add class in element
         * @param el {Object}   -- element.
         * @param cls {String}  -- classes.
         */
        addClass: function(el, cls) {
          var elClass = el.className;
          var blank = (elClass !== '') ? ' ' : '';
          var added = elClass + blank + cls;
          el.className = added;
        },
    
        /**
         * Remove the class from element
         * @param el {Object}   -- element.
         * @param cls {String}  -- classes.
         */
        removeClass: function(el, cls) {
          var elClass = ' '+el.className+' ';
          elClass = elClass.replace(/(\s+)/gi, ' ');
          var removed = elClass.replace(' '+cls+' ', ' ');
          removed = removed.replace(/(^\s+)|(\s+$)/g, '');
          el.className = removed;
        },
    
        /**
         * add event to some element, dom0, dom1, 
         * @param el {Object}       -- element.
         * @param type {String}     -- event type, such as 'click', 'mouseover'.
         * @param func {Function}   -- function.
         */
        addEvent: function(el, type, func) {
          if(el.addEventListener) {
            el.addEventListener(type, func, false);
          } else if(el.attachEvent){ 
            el.attachEvent('on' + type, func);
          } else{ 
            el['on' + type] = func; 
          }  
        },
        
        /**
         * Dispatch event to element
         * @param el {Object}       -- element.
         * @param type {String}     -- event type, such as 'click', 'mouseover'.
         */
        dispatchEvent : function(el, etype) {
            if (el.fireEvent) {
                el.fireEvent('on' + etype);
            } else {
                var evObj = document.createEvent('Events');
                evObj.initEvent(etype, true, false);
                el.dispatchEvent(evObj);
            }
        },
    
        /**
         * Rremove event to some element, dom0, dom1, 
         * @param el {Object}       -- element.
         * @param type {String}     -- event type, such as 'click', 'mouseover'.
         * @param func {Function}   -- function.
         */
        removeEvent: function(el, type, func) {
          if (el.removeEventListener){ 
            el.removeEventListener(type, func, false);
          } else if (el.detachEvent){
            el.detachEvent('on' + type, func);
          } else {
            delete el['on' + type];
          }
        },

    
        /**
        * Remove element node
        * @param el {Object}   -- element.
        */
        removeElement: function(el) {
          (el && el.parentNode) && el.parentNode.removeChild(el);
        }
    };
    
    
    /**
    * Alertui API
    * @return {action} options - The options object
    */
    function Alertui() {
        //vars and default values
        var same
          , alertConfig                // Object config the alertui functions
          , noteConfig                 // Object config the alertui notifications
          , btOkv = 'Ok'              // Default button primary
          , btCancelV = 'Cancel'     // Default button secundary
          , callTime = 500          // Delay to callback execution
          , noteTime = 4300        // Time default the exhibition the note
          , block = false         // Var 'block' to prevent doble clicks in actions
          , _$generate_;
          
          /* Generator */
          _$generate_ = {
                
                /**
                * Create complete modal element
                * @return {object}   - Alert Ui modal element
                */
                createModal : function(){
                    //Create modal panel fixed
                    var elModal = document.createElement('div');
                    
                    //Set modal class 
                    proto.addClass(elModal, 'altui-modal');
                    
                    return elModal;
                },
                
                /**
                * Block body element
                * @param flg {boolean} -- Block body or no (true/false)
                */
                blockBody : function(flg){
                    var elBdy;
                    elBdy = document.body;
                    
                    /* Set style */
                    flg 
                    ?  elBdy.style.overflow = 'hidden' 
                    : elBdy.style.overflow = ''; 
                },
                
                /**
                * Response note dialog
                * @param el {object} - Action element
                * @param call {function} - The callback action after the dialog 
                * @param alertEl {object} - The principal element the dialog
                * @param elDataIn {object} - Element to enter data
                */
                promptResponse : function(el, call, alertEl, elDataIn){
                    
                    var reqValue;
                    
                    proto.addEvent(el, 'click', function(event){
                        _$generate_.blockBody(false);
                        
                        /* Prevent dialog click*/
                        if (event.target.matches('.altui-modal, .alt-btn, .altui-close')) {  
                                
                            //Get input value
                            reqValue = elDataIn.value;
                            
                            //Prevent doble click
                            if(block) return false;
                            
                            if(reqValue !== ''){
                                
                                block = true;
                            
                                //Prevent doble clicks
                                el.setAttribute('disabled', 'disabled');
                                proto.addClass(alertEl, 'alert-close');
                                setTimeout(function(){
                                    proto.removeElement(alertEl);
                                    if(call !== undefined)
                                        call(reqValue); //Execute callback
                                    
                                    block = false;
                                }, callTime);  
                            } else
                                elDataIn.focus();
                        }
                    });
                },
                
                
                /**
                * Response global alert dialog
                * @param el {object} - Action element
                * @param call {function} - The callback action after the dialog 
                * @param alertEl {object} - The principal element the dialog
                */
                alertResponse : function(el, call, alertEl){
                        
                    proto.addEvent(el, 'click', function(event){
                        _$generate_.blockBody(false);
                        
                         /* Prevent dialog click*/
                        if (event.target.matches('.altui-modal, .alt-btn, .altui-close')) {  
                            
                            //Prevent doble click
                            if(block) return false;
                            block = true;
                            
                            proto.addClass(alertEl, 'alert-close');
                            setTimeout(function(){
                                proto.removeElement(alertEl);
                                if(call !== undefined) call(); //Execute callback
                                
                                block = false;
                            }, callTime);
                            
                        }
                    });
                },
                
                /**
                * Response load dialog
                * @param call {function} - The callback action after the dialog 
                * @param alertEl {object} - The principal element the dialog
                */
                loadResponse : function(call, alertEl){
                    
                    //Prevent doble click
                    if(block) return false;
                    block = true;
                    
                    if(call !== undefined){ 
                        
                        block = false;
                        
                        call(function(){
                            _$generate_.blockBody(false);
                            proto.addClass(alertEl, 'alert-close');   
                            
                            setTimeout(function(){
                                proto.removeElement(alertEl);
                            }, callTime);
                            
                        }, alertEl); //Execute callback

                    }
                        
                },
                
            
                /**
                * Response note dialog
                * @param el {object} - Action element
                * @param call {function} - The callback action after the dialog 
                */
                noteResponse : function(el, call, elCase){
                    
                    proto.addEvent(el, 'click', function(){
                        proto.addClass(el, 'note-close');
                        setTimeout(function(){
                            proto.removeElement(el);
                            if(call !== undefined) call();//Execute callback
                            
                            if(elCase.childNodes.length === 0)
                                proto.removeElement(elCase);
                        }, callTime);
                    });
                    
                    setTimeout(function(){
                        proto.addClass(el, 'note-close');
                        setTimeout(function(){
                            proto.removeElement(el);
                            if(call !== undefined) call(); //Execute callback
                            
                            if(elCase.childNodes.length === 0)
                                proto.removeElement(elCase);
                        }, callTime);
                    }, noteTime);
                },
                
                
                /**
                * Messaging types option selected
                * @param obj   - Object with the configurations
                */
                message : function(altOpts){
                    
                    var altUi= document.createElement('div'),
                        altBox = document.createElement('div'),
                        altCm = document.createElement('div'),
                        btClose = document.createElement('button'),
                        altHd = document.createElement('div'),
                        altBdy = document.createElement('div'),
                        altFt = document.createElement('div'),
                        btnOk  = document.createElement('button'),
                        btnCancel = document.createElement('button'),
                        modal,
                        dataIn;
                    
                    /* Block body */
                    this.blockBody(true);
                    
                    btClose.innerHTML = '×';
                    
                    //Prevent undefined object
                    if (typeof altOpts.opt !== "object") 
                        altOpts.opt = {}; 
                    
                     //Create modal element
                    modal = this.createModal();
                    
                    if(!("modal-close" in altOpts.opt))
                        altOpts.opt["modal-close"] = true;

                    //Set elements class   
                    proto.addClass( altUi, 'alert-ui');
                    proto.addClass( altUi, 'show');
                    proto.addClass( altBox, 'altui-dialog' );
                    proto.addClass( altCm, 'altui-cmd' );
                    proto.addClass( altHd, 'altui-header' );
                    proto.addClass( altBdy, 'altui-body' );
                    proto.addClass( altFt, 'altui-footer' );
                    proto.addClass( btnOk, 'alt-btn alt-primary' );
                    proto.addClass( btnCancel, 'alt-btn alt-default' );
                    proto.addClass(btClose, 'altui-close');
                    
                    //Set tabindex in dialog element
                    altUi.setAttribute('tabindex', '0');
                    
                    switch (altOpts.type) {
                        
                        /*
                        * Build AlertUi[ALERT] type
                        */
                        case 'alert' :
                            //Alert' type dialog specifications
                        
                            //Set Title dialog
                            altHd.innerHTML = altOpts.title !== null ? altOpts.title : 'Alert Ui';
                                
                            //Set Content dialog
                            altBdy.innerHTML = altOpts.content;
                            
                            //Set Button ok value
                            if("ok-value" in altOpts.opt)
                                btnOk.innerHTML = altOpts.opt['ok-value'];
                                else
                                    btnOk.innerHTML = btOkv;
                            
                            this.alertResponse(btnOk, altOpts.onok, altUi);
                            
                            //REsponse btClose
                            this.alertResponse(btClose, altOpts.onok, altUi);
                                
                            altFt.appendChild(btnOk);
                            
                            //add bt close
                            altCm.appendChild(btClose);
                            
                            break; 
                            
                        /*
                        * Build AlertUi[CONFIRM] type
                        */
                        case 'confirm' :
                            //Confirm' type dialog specifications
                            
                            altHd.innerHTML = altOpts.title !== undefined ? altOpts.title : 'Alert Ui';
                                
                            altBdy.innerHTML = altOpts.content; 
                            
                            //Set Button ok value
                            if("ok-value" in altOpts.opt)
                                btnOk.innerHTML = altOpts.opt['ok-value'];
                                else 
                                    btnOk.innerHTML = btOkv;   
                                            
                            //Set Button cancel value
                            if("cancel-value" in altOpts.opt)
                                btnCancel.innerHTML = altOpts.opt['cancel-value'];
                                else
                                    btnCancel.innerHTML = btCancelV;
                            
                            this.alertResponse(btnOk, altOpts.onok, altUi);
                            this.alertResponse(btnCancel, altOpts.oncancel, altUi);
                            this.alertResponse(btClose, altOpts.oncancel, altUi);
                            
                            altFt.appendChild(btnOk);
                            altFt.appendChild(btnCancel);
                            
                            //add bt close
                            altCm.appendChild(btClose);
                            
                            break;
                            
                        /*
                        * Build AlertUi[PROMPT] type
                        */
                        case 'prompt' :
                            
                            dataIn = document.createElement('input');
                            dataIn.setAttribute('type', 'text');
                            
                            proto.addClass(dataIn, 'alt-input');
                            
                            altHd.innerHTML = altOpts.title !== undefined ? altOpts.title : 'Prompt Ui';
                                
                            altBdy.innerHTML = altOpts.content; 
                            altBdy.appendChild(dataIn);
                            
                            //Set Button ok value
                            if("ok-value" in altOpts.opt)
                                btnOk.innerHTML = altOpts.opt['ok-value'];
                                else 
                                    btnOk.innerHTML = btOkv;   
                                            
                            //Set Button cancel value
                            if("cancel-value" in altOpts.opt)
                                btnCancel.innerHTML = altOpts.opt['cancel-value'];
                                else
                                    btnCancel.innerHTML = btCancelV;  

                            this.promptResponse(btnOk, altOpts.onok, altUi, dataIn);
                            this.alertResponse(btnCancel, altOpts.oncancel, altUi);
                            this.alertResponse(btClose, altOpts.oncancel, altUi);
                            
                            altFt.appendChild(btnOk);
                            altFt.appendChild(btnCancel);   
                            
                            //add bt close
                            altCm.appendChild(btClose);
                            
                            //Set key event in input element
                            proto.addEvent(dataIn, 'keydown', function(evt){
                                evt = evt || window.event;
                                var key = evt.keyCode || evt.which;
                                switch (key) {
                                    case 13:
                                        btnOk.focus();
                                        proto.dispatchEvent(btnOk, 'click');  
                                        break;
                                    case 27:
                                        if(btnCancel)
                                            btnCancel.focus();
                                            
                                        proto.dispatchEvent(modal, 'click');    
                                        break;
                                }  
                            });
                            
                            //Set the value default and select
                            if(altOpts.defvalue != undefined) {
                                dataIn.value = altOpts.defvalue;
                                dataIn.select();
                            } else {
                                dataIn.value = '';   
                            }
                            
                            break;
                        /*
                        * Build AlertUi[LOAD] type
                        */
                        case 'load' :
                    
                            var altLoader = document.createElement('div'),
                                altContL  = document.createElement('div'),
                                altContB  = document.createElement('div');
                                
                            //Set classe in alertui body elements
                            altLoader.classList.add('alertui-loader');
                            altContL.classList.add('alt-content-left');
                            altContB.classList.add('alt-content-body');
                            
                            //Set Content dialog
                            altContL.appendChild(altLoader);
                            altContB.innerHTML = altOpts.content;
                            
                            //Add the contents
                            altBdy.appendChild(altContL);
                            altBdy.appendChild(altContB);
                            
                            //Block modal to click close
                            altOpts.opt["modal-close"] = false;
                            
                            //Invoke loadResponse
                            this.loadResponse(altOpts.onload, altUi);
                            
                            break;
                            
                    }
                 
                    altBox.appendChild(altCm);
                    altBox.appendChild(altHd);
                    altBox.appendChild(altBdy);
                    altBox.appendChild(altFt);
                    modal.appendChild(altBox);
                    altUi.appendChild(modal);
                    
                    //Set Event close modal
                    if(altOpts.opt["modal-close"] && altOpts.type === 'alert')
                        this.alertResponse(modal, altOpts.onok, altUi);
                        else if(altOpts.opt["modal-close"])
                            this.alertResponse(modal, altOpts.oncancel, altUi);
                    
                    // Add Object alert in document body
                    document.body.appendChild(altUi);
                    
                    window.focus();
                    
                    if(altOpts.type === 'prompt')
                        dataIn.focus(); //Focus in input in prompt
                        else{
                            altUi.focus();
                        }
                    
                    //Set tecle function
                    proto.addEvent(altUi, 'keydown', function(evt){
                        evt = evt || window.event;
                        var key = evt.keyCode || evt.which;
                        switch (key) {
                            case 13:
                                btnOk.focus();
                                proto.dispatchEvent(btnOk, 'click');  
                                break;
                            case 27:
                                if(btnCancel)
                                    btnCancel.focus();
                                proto.dispatchEvent(modal, 'click');    
                                break;
                        } 
                    });
                },
                
                
                /**
                * Notification messaging type
                * @param note {object}  -Object type Alert Ui notify 
                */
                note : function(note){
                    
                    var altUi
                      , notify = document.createElement('div')
                      , noteClass = '';
                    
                    //Prepared the type message
                    switch (note.noteType) {
                        case 'default':
                            noteClass = 'note-default';
                            break;
                        case 'success':
                            noteClass = 'note-success';
                            break;
                        case 'error':
                            noteClass = 'note-error';
                            break;
                        default:
                            noteClass = 'note-default';
                    }
                    
                    //Set class in notify item
                    proto.addClass(notify, 'altui-note');
                    proto.addClass(notify, noteClass);
                    
                    //Set content value
                    notify.innerHTML = note.content;
                    
                    //Insert notify in note case
                    altUi = document.getElementsByClassName('alert-ui-note')[0];
                    
                    if(altUi){
                        altUi.insertBefore(notify, altUi.childNodes[0]);
                    }   else{
                            altUi = document.createElement('div'); 
                            proto.addClass(altUi, 'alert-ui-note');
                            
                            altUi.insertBefore(notify, altUi.childNodes[0]);
                            document.body.appendChild(altUi);
                    }
                    this.noteResponse(notify, note.onClose, altUi);
                },
                
                /**
                * Modal implementations
                */
                modal : function(){
                    
                    function scan(eClass){
                        return document.getElementsByClassName(eClass);        
                    }
                    
                    /**
                    * Show modal
                    * @param same {object} -- This object
                    */
                    function show(same){
                        var mId,
                            mdEl;
                            
                        mId = same.dataset.modal;
                        mdEl = document.getElementById(mId);
                        
                        proto.addClass(mdEl, 'show');
                        
                    }
                    
                    /**
                    * Close modal
                    * @param mdl {object} -- Object modal
                    */
                    function close(mdl){
                        mdl.classList.add('alert-close');
                        setTimeout(function(){
                           mdl.classList.remove('show', 'alert-close'); 
                        }, callTime);
                    }
                    
                    /**
                    * Set intern modal actions default
                    * @param mdl {object} -- Object modal
                    */
                    function setActions(mdl){
                        var cBt,
                            i;
                        cBt = mdl.getElementsByClassName('altui-close');
                        for( i = 0; i < cBt.length; i++) {
                            /* Set close modal event */
                            proto.addEvent(cBt[i], 'click', function(){
                                close(mdl);     
                            });
                        }
                    }
                    
                    /* Initialize modal */
                    function _init(){
                        var mdLs,
                            mdBt,
                            i;
                            
                        mdLs = scan('alert-ui');
                        mdBt = scan('alert-to');
                        
                        for(i = 0; i < mdLs.length; i++){
                            setActions(mdLs[i]);    
                        }
                        
                        for( i = 0; i < mdBt.length; i++){
                            proto.addEvent(mdBt[i], 'click', function(){
                                var same;
                                same = this;
                                show(same);
                            });
                        }
                        
                    }
                    
                    _init();
                }
                
                
            };
        
        
            /**
            * Return the functions types 
            * @return {action} - Alert Ui functions
            */
            return {
                
                // modal
                modal: (function(){
                    _$generate_.modal();
                })(),
                
                modalClose: function(mdlId){
                    var mdl;
                    mdl = document.getElementById(mdlId);
                    
                    mdl.classList.add('alert-close');
                    setTimeout(function(){
                       mdl.classList.remove('show', 'alert-close'); 
                    }, callTime);  
                },
            
                // return alertui ALERT;
                alert: function(title, content, onOk, option) {
                    alertConfig = {
                        type    : 'alert', 
                        title   : title, 
                        content : content, 
                        onok    : onOk,
                        opt     : option
                    }; _$generate_.message(alertConfig);
                },
                
                // return alertui CONFIRM;
                confirm: function(title, content, onOk, onCancel, option) {
                    alertConfig = {
                        type     : 'confirm', 
                        title    : title, 
                        content  : content,
                        onok     : onOk,
                        oncancel : onCancel,
                        opt      : option
                    }; _$generate_.message(alertConfig);
                },
                
                // return alertui PROMPT
                prompt: function(title, content, onOk, onCancel, defValue, option) {
                    alertConfig = {
                        type     : 'prompt', 
                        title    : title, 
                        content  : content,
                        onok     : onOk,
                        oncancel : onCancel,
                        defvalue : defValue,
                        opt      : option
                    }; _$generate_.message(alertConfig);
                },
                
                // return alertui LOAD
                load: function(content, onLoad) {
                    alertConfig = {
                        type: 'load',
                        content  : content,
                        onload   : onLoad
                    }; _$generate_.message(alertConfig);
                },
                
                // return alertui NOTIFICATION
                notify: function(noteType, content) {
                    noteConfig = {
                        noteType : noteType, 
                        content  : content,
                    }; _$generate_.note(noteConfig);
                },
        };
        
    }
    
    //Set window namespace
    alertuiWin = new Alertui();
    window[namespace] = alertuiWin;
    
})( window, 'alertui' );