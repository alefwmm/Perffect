/*
* Author: Alef Miranda
*
* Description: A simple layout composition plugin. Just works if the elements
* have the same width.
*
*/

'use strict';
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
        function LayoutManager(container, selector, gutter) {
            this.container = container;
            this.selector = selector;
            this.gutter = gutter;

            this.elements = null;
            this.__arrangePointer = null;

            this.init();
        }

        /*
        * Initializer
        *
        * Automatically calls the layout script
        */
        LayoutManager.prototype.init = function () {
            this.__arrangePointer = this.arrange.bind(this);
            this.refresh();

            this.attachEvents();
            window.addEventListener('resize', this.lazyLayout.bind(this));

            this.layout();
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
            this.dettachEvents();
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
                addResizeListener(node, this.__arrangePointer);
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
                removeResizeListener(node, this.__arrangePointer);
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
