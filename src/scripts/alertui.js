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
        },
    };
    
    
    /**
    * Alertui API
    * @return {action} options - The options object
    */
    function Alertui() {
        //vars and default values
        var alertConfig = undefined     // Object config the alertui functions
          , noteConfig = undefined     // Object config the alertui notifications
          , btOkv = 'Ok'              // Default button primary
          , btCancelV = 'Cancel'     // Default button secundary
          , callTime = 500          // Delay to callback execution
          , noteTime = 6000        // Time default the exhibition the note
          , block = false         // Var 'block' to prevent doble clicks in actions
          , Generate = {
                
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
                * Response note dialog
                * @param el {object} - Action element
                * @param call {function} - The callback action after the dialog 
                * @param alertEl {object} - The principal element the dialog
                * @param elDataIn {object} - Element to enter data
                */
                promptResponse : function(el, call, alertEl, elDataIn){
                    
                    var reqValue;
                    
                    proto.addEvent(el, 'click', function(){
                        
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
                    });
                },
                
                
                /**
                * Response alert dialog
                * @param el {object} - Action element
                * @param call {function} - The callback action after the dialog 
                * @param alertEl {object} - The principal element the dialog
                */
                alertResponse : function(el, call, alertEl){
                        
                    proto.addEvent(el, 'click', function(){
                        
                        //Prevent doble click
                        if(block) return false;
                        block = true;
                        
                        proto.addClass(alertEl, 'alert-close');
                        setTimeout(function(){
                            proto.removeElement(alertEl);
                            if(call !== undefined) call(); //Execute callback
                            
                            block = false;
                        }, callTime);   
                    });
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
                    
                    var altUi= document.createElement('div')
                      , altBox = document.createElement('div')
                      , altCm = document.createElement('div')
                      , btClose = document.createElement('button')
                      , altHd = document.createElement('div')
                      , altBdy = document.createElement('div')
                      , altFt = document.createElement('div')
                      , btnOk  = document.createElement('button')
                      , btnCancel = document.createElement('button')
                      , modal
                      , dataIn;
                    
                    //Prevent undefined object
                    if (typeof altOpts.opt !== "object") 
                        altOpts.opt = {}; 
                    
                     //Create modal element
                    modal = this.createModal();
                    if(!("modal-close" in altOpts.opt))
                        altOpts.opt["modal-close"] = true;

                    //Set elements class   
                    proto.addClass( altUi, 'alert-ui');
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
                   
                    if(altOpts.type === 'alert') {
                    //Alert' type dialog specifications
                    
                        //Set Title dialog
                        altHd.innerHTML = altOpts.title !== null 
                                        ? altOpts.title 
                                        : 'Alert Ui';
                            
                        //Set Content dialog
                        altBdy.innerHTML = altOpts.content;
                        
                        //Set Button ok value
                        if("ok-value" in altOpts.opt)
                            btnOk.innerHTML = altOpts.opt['ok-value'];
                            else
                                btnOk.innerHTML = btOkv;
                        
                        this.alertResponse(btnOk, altOpts.onok, altUi);
                            
                        altFt.appendChild(btnOk);
                        
                        
                    } else if(altOpts.type === 'confirm') {
                        //Confirm' type dialog specifications
                        
                        altHd.innerHTML = altOpts.title !== undefined
                            ? altOpts.title 
                            : 'Alert Ui';
                            
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
                        
                        altFt.appendChild(btnOk);
                        altFt.appendChild(btnCancel);
                        
                    } else if(altOpts.type === 'prompt'){
                        
                        dataIn = document.createElement('input');
                        dataIn.setAttribute('type', 'text');
                        
                        proto.addClass(dataIn, 'alt-input');
                        
                        altHd.innerHTML = altOpts.title !== undefined
                            ? altOpts.title 
                            : 'Prompt Ui';
                            
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
                        
                        altFt.appendChild(btnOk);
                        altFt.appendChild(btnCancel);    
                        
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
                    }
                    
                    //Organizer enter elements
                    altCm.appendChild(btClose);
                    altBox.appendChild(altCm);
                    altBox.appendChild(altHd);
                    altBox.appendChild(altBdy);
                    altBox.appendChild(altFt);
                    altUi.appendChild(modal);
                    altUi.appendChild(altBox);
                    
                    //Set Event close modal
                    if(altOpts.type === 'alert' && altOpts.opt["modal-close"]) { //If alert default ok event
                        this.alertResponse(modal, altOpts.onok, altUi);
                        this.alertResponse(btClose, altOpts.onok, altUi);
                    } else if(altOpts.opt["modal-close"]) {
                        this.alertResponse(modal, altOpts.oncancel, altUi);
                        this.alertResponse(btClose, altOpts.oncancel, altUi);
                    }
                    
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
                }
            };
        
        
            /**
            * Return the functions types 
            * @return {action} - Alert Ui functions
            */
            return {
            
                // return alertui ALERT;
                alert: function(title, content, onOk, option) {
                    alertConfig = {
                        type    : 'alert', 
                        title   : title, 
                        content : content, 
                        onok    : onOk,
                        opt     : option
                    }; Generate.message(alertConfig);
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
                    }; Generate.message(alertConfig);
                },
                
                // return alertui PROMPT
                prompt: function(title, content, onOk, onCancel, option) {
                    alertConfig = {
                        type     : 'prompt', 
                        title    : title, 
                        content  : content,
                        onok     : onOk,
                        oncancel : onCancel,
                        opt      : option
                    }; Generate.message(alertConfig);
                },
                
                // return alertui NOTIFICATION
                notify: function(noteType, content, pdefault) {
                    noteConfig = {
                        noteType : noteType, 
                        content  : content,
                        iNvalue  : pdefault,
                    }; Generate.note(noteConfig);
                },
        };
    }
    
    //Set window namespace
    alertuiWin = new Alertui();
    window[namespace] = alertuiWin;

})( window, 'alertui' );