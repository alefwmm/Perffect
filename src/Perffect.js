/*
* Author: Alef Miranda
*
* Description: A simple layout composition plugin. Just works if the elements
* have the same width.
*
* Resize handlers: Base on sdecima/javascript-detect-element-resize and
* http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/.
*
*/

'use strict';

// Let resize handlers be defined only once
if (!(window.addResizeListener && window.removeResizeListener && window.hasResizeListener)) {
    (function(){

        // Fixed timeout of 33 miliseconds (30 FPS)
        function getTimeout(callback) {
            return window.setTimeout(callback, 33);
        }

        // Select the correct Request Animation Frame function
        function requestFrame(callback) {
            var raf =
                window.requestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                getTimeout;

            return raf(callback);
        }

        // Select the corrent Cancel Animation Frame function
        function cancelFrame(id) {
            var caf =
                window.cancelAnimationFrame ||
                window.mozCancelAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.clearTimeout;

            return caf(id);
        }

        // Calls for each callback function
        function call(element, event) {
            var trigger = element.$resizeTrigger;
            var callbacks = trigger.$resizeListeners;

            for (
                var i = 0,
                    length = callbacks.length,
                    callback = callbacks[i];
                i < length;
                ++i,
                    callback = callbacks[i]
            ) {
                callback.call(trigger, event);
            }
        }

        // On resize event, call!
        function resizeListener(event) {
            var element = event.target || event.srcElement;

            if (element.$resizeRAF) cancelFrame(element.$resizeRAF);

            element.$resizeRAF = requestFrame(function () {
                return call(element, event);
            });
        }

        // Onload event reset on trap element
        function load() {
            this.contentDocument.defaultView.$resizeTrigger = this.$resizeElement;
            this.contentDocument.defaultView.addEventListener('resize', resizeListener);
        }

        // Creates a new HTMLObjectElement and assign the correct properties
        function trapElement(element) {
            var style, trap;

            style
                = "display: block; position: absolute; top: 0; left: 0; height: 100%;"
                +" width: 100%; overflow: hidden; pointer-events: none; z-index: -1;";

            trap = document.createElement("object");
            trap.setAttribute("style", style);
            trap.$resizeElement = element;
            trap.onload = load;
            trap.type = "text/html";
            trap.data = "about:blank";

            element.$resizeTrigger = trap;
            element.appendChild(trap);
        }

        // Registers resize event on element
        window.addResizeListener = function (element, callback) {
            var position;

            if (!element.$resizeListeners) {
                element.$resizeListeners = [];

                element.style.position = "relative";
                trapElement(element);
            }

            position = element.$resizeListeners.indexOf(callback);

            if (position == -1) {
                element.$resizeListeners.push(callback);
            }
        }

        // Erase resize event on element
        window.removeResizeListener = function (element, callback) {
            var position;

            if (element.$resizeListeners.length) {

                position = element.$resizeListeners.indexOf(callback);

                if (position >= 0) {
                    element.$resizeListeners.splice(position, 1);
                }
            }

            if (!element.$resizeListeners.length) {
                element.$resizeTrigger.contentDocument.defaultView.removeEventListener('resize', resizeListener);
                element.removeChild(element.$resizeTrigger);
                delete element.$resizeTrigger;
                delete element.$resizeListeners;
            }
        }
    })();
}

// Let the library be defined only once.
if(!window.Perffect) {

    // Setting the library declaration to true
    window.Perffect = true;

    // Perffect variable holds the constructor
    var Perffect = function () {

        /*
        * Constructor
        *
        * container: the node to be managed
        * selector: the children selector
        * gutter: size in pixels of the relative gutter
        */
        function LayoutManager(container, selector, gutter, notAuto) {
            this.container = container;
            this.selector = selector;
            this.gutter = gutter;

            this.elements = null;

            this.$arrangePointer = this.arrange.bind(this);
            this.started = false;

            if (!notAuto) this.rearrange();
        }

        /*
        * Rearrange only after some time after the window's resize event
        */
        LayoutManager.prototype.lazyLayout = function () {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(function () {
                this.arrange();
            }.bind(this), 300);
        }

        LayoutManager.prototype.rearrange = function () {

            if (!this.started) {
                window.addEventListener('resize', this.lazyLayout.bind(this));
                this.started = true;
            } else {
                this.dettachEvents();
            }

            this.refresh();
            this.attachEvents();
            this.layout();
        }

        /*
        * Resize event attachment
        *
        * Attachs a resize event to every container children
        */
        LayoutManager.prototype.attachEvents = function () {
            for(
                var i = 0,
                    length = this.elements.length,
                    node = this.elements.item(i);
                i < length;
                i++,
                    node = this.elements.item(i)
            ) {
                addResizeListener(node, this.$arrangePointer);
            }
        }
        /*
        * Resize event dettachment
        *
        * Attachs a resize event to every container children
        */
        LayoutManager.prototype.dettachEvents = function () {
            for(
                var i = 0,
                    length = this.elements.length,
                    node = this.elements.item(i);
                i < length;
                i++,
                    node = this.elements.item(i)
            ) {
                removeResizeListener(node, this.$arrangePointer);
            }
        }

        /*
        * Calls refresh and layout functions
        */
        LayoutManager.prototype.arrange = function () {
            this.refresh();
            this.layout();
        }

        /*
        * Registers the children elements of the container
        */
        LayoutManager.prototype.refresh = function () {
            this.elements = this.container.querySelectorAll(this.selector);

            // Resetting container width
            this.container.style.position = "relative";
            this.container.style.width = "auto";
            this.container.style.marginLeft = "auto";
            this.container.style.marginRight = "auto";
        }

        /*
        * Calculates container size and children positions
        */
        LayoutManager.prototype.layout = function () {
            var containerWidth, containerHeight, elementWidth, columns, count, multiplier;

            elementWidth = this.elements.item(0).offsetWidth;
            count = Math.trunc(this.container.offsetWidth / (elementWidth + this.gutter));
            multiplier = (this.elements.length > count) ? count : this.elements.length;
            containerWidth = multiplier * elementWidth + (multiplier - 1) * this.gutter;
            columns = new Array(count);

            for(var i = 0; i < count; i++)
                columns[i] = 0;

            for (
                var i = 0,
                    column = 0,
                    containerHeight = 0,
                    length = this.elements.length,
                    node = this.elements.item(i);
                i < length;
                ++i,
                    column = (column + 1) % count,
                    node = this.elements.item(i)
            ) {
                var left, top;

                left = column * elementWidth;
                if (column > 0)
                    left += column * this.gutter;

                top = columns[column] | 0;

                node.style.position = "absolute";
                node.style.left = left + "px";
                node.style.top = top + "px";

                columns[column] += node.offsetHeight + this.gutter;

                if (columns[column] > containerHeight)
                    containerHeight = columns[column];
            }

            containerHeight = containerHeight - this.gutter;

            this.container.style.height = containerHeight + "px";
            this.container.style.width = containerWidth + "px";
        }

        return LayoutManager;
    } ();
}
