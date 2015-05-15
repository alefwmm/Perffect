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
        * config: {
        *     container: [Object]   [required] the container node
        *     selector:  [String]   [optional] the selector of the elements to be managed
        *     select:    [Function] [optional] if selector not set, this function is used
        *     gutter:    [Number]   [optional] size in pixels of the relative gutter
        *     auto:      [Boolean]  [optional] auto starter
        *     align:     [String]   [optional] center or left
        * }
        */
        function LayoutManager(config) {
            // REQUIRED
            this.container = config.container;

            // OPTIONAL
            this.select = config.select  || childrenSelector(config.container, config.selector) || null;
            this.gutter = config.gutter  || 0;
            this.auto   = config.notAuto || true;
            this.align  = config.align   || 'center';

            // INTERNAL
            this.elements = null;

            // SPECIAL
            this.$rearrangePointer = this.rearrange.bind(this);
            this.$lastRAF = null;

            if (this.auto) this.rearrange();
        }

        /*
        * Returns a function to select the required elements
        *
        * container: [Object] [required] container object
        * selector:  [String] [required] class selector
        *
        */
        function childrenSelector(container, selector) {
            return function () {
                return container.querySelectorAll(selector);
            };
        }

        /*
        * Binds setTimeout to 33ms
        *
        * callback: [Function] [required] The callback function
        */
        function getTimeout(callback) {
            return window.setTimeout(callback, 33);
        }

        /*
        * Cross-browser Request Animation Frame
        *
        * callback: [Function] [required] The callback function
        * thisArg:  [Object]   [optional] Callback reset of the this pointer
        * args:     [Array]    [optional] Callback arguments
        */
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

        /*
        * Cross-browser Cancel Animation Frame
        *
        * id: [?] [required] Returned ID from Request Animation Frame
        * */
        function cancelFrame(id) {
            var caf =
                window.cancelAnimationFrame ||
                window.mozCancelAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.clearTimeout;

            return caf(id);
        }

        /*
        * Calculates container height and children positions
        *
        * container: [Object]   [required] The container
        * elements:  [NodeList] [required] The elements to be managed
        * gutter:    [Number]   [required] Distance between the elements
        */
        function layout(container, elements, gutter, align) {
            var width, offset, columnCount, columnWidth, columnOffset;

            columnWidth = elements.item(0).offsetWidth + gutter;
            width       = container.offsetWidth;

            columnCount  = Math.trunc(width / columnWidth);
            columnCount  = (columnCount > elements.length) ? elements.length : columnCount;
            offset       = (width - columnCount * columnWidth - gutter) / 2;
            offset       = (align == "center") ? offset : 0;
            columnOffset = new Array(columnCount);

            for (var i = 0; i < columnCount; i++) columnOffset[i] = 0;

            // Calculates positions
            for (
                var i = 0, j = 0, length = elements.length, node = elements.item(i), height = 0;
                i < length;
                ++i, j = i % columnCount, node = elements.item(i)
            ) {
                var left, top;

                left = offset + columnWidth * j;
                top  = columnOffset[j];

                node.style.position = "absolute";
                node.style.left = left + "px";
                node.style.top = top + "px";

                columnOffset[j] += node.offsetHeight + gutter;

                if (columnOffset[j] > height) height = columnOffset[j];
            }

            height = height - gutter;
            container.style.position = "relative";
            container.style.height = height + "px";

        }

        /*
        * Updates events and elements
        */
        LayoutManager.prototype.update = function () {
            this.elements = this.select();

            Resizer.add(this.container, this.$rearrangePointer);
            for (
                var i = 0, length = this.elements.length, node = this.elements.item(i);
                i < length;
                ++i, node = this.elements.item(i)
            ) {
                Resizer.add(node, this.$rearrangePointer);
            }
        }

        /*
        * Rearranges all elements
        */
        LayoutManager.prototype.rearrange = function () {
            if (this.$lastRAF) cancelFrame(this.$lastRAF);
            this.update();
            requestFrame(layout, null, [this.container, this.elements, this.gutter, this.align]);
        }

        return LayoutManager;
    } ();
}
