/**
 * Alert Ui JS
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2016, Gleisson Matos
 * http://github.com/gleissonmatos
 */

;
(function(window) {

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
            var elClass = ' ' + el.className + ' ';
            elClass = elClass.replace(/(\s+)/gi, ' ');
            var removed = elClass.replace(' ' + cls + ' ', ' ');
            removed = removed.replace(/(^\s+)|(\s+$)/g, '');
            el.className = removed;
        },

        //add Event
        addEvent: function(el, type, func) {
            if (el.addEventListener) {
                el.addEventListener(type, func, false);
            } else if (el.attachEvent) {
                el.attachEvent('on' + type, func);
            } else {
                el['on' + type] = func
            }
        },

        //dispatch event
        dispatchEvent: function(el, etype) {
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

        var alertConfig = undefined,
            noteConfig = undefined,
            btOkv = 'Ok',
            callTime = 500,
            noteTime = 6000,
            btCancelV = 'Cancel',
            Generate = {


                /**
                 * Messaging types option selected
                 * @param obj   - Object with the configurations
                 */
                message: function(altOpts) {

                    var altUi = document.createElement('div'),
                        altBox = document.createElement('div'),
                        altCm = document.createElement('div'),
                        btClose = document.createElement('button'),
                        altHd = document.createElement('div'),
                        altBdy = document.createElement('div'),
                        altFt = document.createElement('div'),
                        btnOk = document.createElement('button'),
                        btnCancel = document.createElement('button'),
                        modal

                    //Set elements class   
                    proto.addClass(altUi, 'alert-ui');
                    proto.addClass(altBox, 'altui-dialog');
                    proto.addClass(altCm, 'altui-cmd');
                    proto.addClass(altHd, 'altui-header');
                    proto.addClass(altBdy, 'altui-body');
                    proto.addClass(altFt, 'altui-footer');

                    proto.addClass(btnOk, 'alt-btn alt-primary');
                    proto.addClass(btnCancel, 'alt-btn alt-default');

                    proto.addClass(btClose, 'altui-close');

                },

            };


        /**
         * Return the functions types 
         * @return alert ui function
         */
        return {

            // alert
            alert: function(title, content, opts, onOk) {},

            // confirm
            confirm: function(title, content, opts, onOk, onCancel) {},

            // prompt
            prompt: function(title, content, opts, onOk, onCancel) {},

            // notify
            notify: function(noteType, content, opts, onClose) {},

        };


    }

    window.Alertui = Alertui;

})(window);