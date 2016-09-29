/**
* Alert Ui JS
*
* Licensed under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
*
* Copyright 2016, Gleisson Matos
* http://github.com/gleissonmatos
*/

;( function( window ) {
    
    'use strict';
    
    // common function which is often using
    var proto = {
        //add Class
        addClass: function(el, cls) {
          var elClass = el.className;
          var blank = (elClass !== '') ? ' ' : '';
          var added = elClass + blank + cls;
          el.className = added;
        },
				//remove class
        removeClass: function(el, cls) {
          var elClass = ' '+el.className+' ';
          elClass = elClass.replace(/(\s+)/gi, ' ');
          var removed = elClass.replace(' '+cls+' ', ' ');
          removed = removed.replace(/(^\s+)|(\s+$)/g, '');
          el.className = removed;
        },
    
				//add Event
        addEvent: function(el, type, func) {
          if(el.addEventListener) {
            el.addEventListener(type, func, false);
          } else if(el.attachEvent){ 
            el.attachEvent('on' + type, func);
          } else{ 
            el['on' + type] = func
          }  
        },
        
        //dispatch event
        dispatchEvent : function(el, etype) {
            if (el.fireEvent) {
                el.fireEvent('on' + etype);
            } else {
                var evObj = document.createEvent('Events');
                evObj.initEvent(etype, true, false);
                el.dispatchEvent(evObj);
            }
        },

				// delete element
        removeElement: function(el) {
          (el && el.parentNode) && el.parentNode.removeChild(el);
        },
    };
    
    
    /**
    * Alertui
    * @return {object} options - The options object
    */
    function Alertui() {
    
        var alertConfig = undefined
          , noteConfig = undefined
          , btOkv = 'Ok'
          , callTime = 500
          , noteTime = 6000
          , btCancelV = 'Cancel'
          , Generate   = {
						
								/**
                * Create complete modal element
                * @return elModal   - Alert Ui modal elemento
                */
                createModal : function(){
                    //Create modal panel fixed
                    var elModal = document.createElement('div');
                    
                    //Set modal class 
                    proto.addClass(elModal, 'altui-modal');
                    
                    return elModal;
                },
                
                /**
                * Response alert dialog
                * @param el {object} - Action element
                * @param call {function} - The callback action after the dialog 
                * @param alertEl {object} - The principal element the dialog
                */
                alertResponse : function(el, call, alertEl){
                    proto.addEvent(el, 'click', function(){
                        //Prevent doble clicks
                        el.setAttribute('disabled', 'disabled');
                        proto.addClass(alertEl, 'alert-close');
                        setTimeout(function(){
                            proto.removeElement(alertEl);
                            if(call !== undefined)
                                call();
                                
                        }, callTime);   
                    });
                    
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
                      , dataIn
                    
                    //Create modal element
                    modal = this.createModal();
                    
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
										
										if(altOpts.type === 'alert') {
                    //Alert' type dialog specifications
                    
                        //Set Title dialog
                        altHd.innerHTML = altOpts.title !== null 
                            ? altOpts.title 
                            : 'Alert Ui';
                            
                        //Set Content dialog
                        altBdy.innerHTML = altOpts.content;
                        
                        //Set Button ok value    
                        btnOk.innerHTML = btOkv;
                        
												//Set callback function
                        this.alertResponse(btnOk, altOpts.onok, altUi);
                        
												//add button 'OK' int footer
                        altFt.appendChild(btnOk);
                        
                        
                    } else if(altOpts.type === 'confirm') {
                        //Confirm' type dialog specifications
                        
                    } else if(altOpts.type === 'prompt'){
                        //Prompt' type dialog specifications
                          
                        
                    }
										
										altCm.appendChild(btClose);
                    altBox.appendChild(altCm);
                    altBox.appendChild(altHd);
                    altBox.appendChild(altBdy);
                    altBox.appendChild(altFt);
                    
                    altUi.appendChild(modal);
                    altUi.appendChild(altBox);
                    
                    //Set Event close modal
                    this.alertResponse(modal, altOpts.oncancel, altUi);
                    this.alertResponse(btClose, altOpts.oncancel, altUi);
                    
                    document.body.appendChild(altUi);

                },
                
            };
        
        
            /**
            * Return the functions types 
            * @return {action} - Alert Ui functions
            */
            return {
            
            //alert
            alert: function(title, content, opts, onOk) {
                alertConfig = {
  
                    type   : 'alert', 
                    title : title, 
                    option : opts,
                    content : content, 
                    onok : onOk
                    
                }; Generate.message(alertConfig);
            },
            
            //confirm
            confirm: function(title, content, opts, onOk, onCancel) {
                   alertConfig = {
                       
                    type : 'confirm', 
                    title : title, 
                    content : content,
                    option : opts,
                    onok : onOk,
                    oncancel : onCancel
                    
                }; Generate.message(alertConfig);
            },
            
            //prompt
            prompt: function(title, content, opts, onOk, onCancel) {
                
                alertConfig = {
                    
                    type : 'prompt', 
                    title : title, 
                    content : content,
                    option : opts,
                    onok : onOk,
                    oncancel : onCancel
                    
                }; Generate.message(alertConfig);
                
            },
            
            //notify
            notify: function(noteType, content, opts, onClose) {
                
                noteConfig = {
                    
                    noteType : noteType, 
                    content : content,
                    option : opts,
                    onClose : onClose
                    
                }; Generate.note(noteConfig);
                
            },
            
        };
        
        
    }
    
    window.Alertui = Alertui;

})( window );

var alertui = new Alertui();