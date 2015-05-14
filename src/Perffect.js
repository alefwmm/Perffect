/*
* Author: Alef Miranda
*
* Description: A simple layout composition plugin. Just works if the elements
* have the same width.
*
*/

// Let the library be defined only once.
if(!window.Perffect) {

    // Constructor
    window.Perffect = function () {

        /*
        * Constructor
        *
        * config {
        *     container: the node to be managed
        *     selector: the children selector
        *     gutter: size in pixels of the relative gutter
        *     notAuto: auto starts Perffect if false
        * }
        */
        function LayoutManager(config) {
            this.container = config.container;
            this.selector = config.selector;
            this.gutter = config.gutter || 0;
            this.notAuto = config.notAuto || false;

            this.elements = null;

            this.$arrangePointer = this.arrange.bind(this);
            this.$lastRAF = null;
            this.started = false;

            if (!this.notAuto) this.rearrange();
        }

        // Fixed timeout of 33 miliseconds (30 FPS)
        function getTimeout(callback) {
            return window.setTimeout(callback, 33);
        }

        // Select the correct Request Animation Frame function
        function requestFrame(callback, thisArg, args) {
            var raf =
                window.requestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                getTimeout;

            return raf(function () {
                callback.apply(thisArg, args);
            });
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

        // Rearranges the whole layout
        LayoutManager.prototype.rearrange = function () {

            if (!this.started) {
                Resizer.add(this.container, function () {
                    if (this.$lastRAF) cancelFrame(this.$lastRAF);
                    this.$lastRAF = requestFrame(this.rearrange, this);
                }.bind(this));
                this.started = true;
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
                Resizer.add(node, function () {
                    if (this.$lastRAF) cancelFrame(this.$lastRAF);
                    this.$lastRAF = requestFrame(this.$arrangePointer, this);
                }.bind(this));
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
            if (typeof this.selector === "string") {
                this.elements = this.container.querySelectorAll(this.selector);
            } else {
                this.elements = this.selector();
            }

            this.container.style.position = "relative";
        }

        /*
        * Calculates container size and children positions
        */
        LayoutManager.prototype.layout = function () {
            var containerWidth, containerHeight, elementWidth, columns, count, multiplier, leftSpace;

            if(!this.elements.length) return;

            elementWidth = this.elements.item(0).offsetWidth;
            count = Math.trunc(this.container.offsetWidth / (elementWidth + this.gutter));
            multiplier = (this.elements.length > count) ? count : this.elements.length;
            containerWidth = multiplier * elementWidth + (multiplier - 1) * this.gutter;
            leftSpace = (this.container.offsetWidth - containerWidth) / 2;
            if (leftSpace > elementWidth) leftSpace = 0;
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

                left = column * elementWidth + leftSpace;
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
        }

        return LayoutManager;
    } ();
}
