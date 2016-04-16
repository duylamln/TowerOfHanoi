define([], function () {
    return function (opts) {

        var self = this;
        this.index = opts.index;
        this.canvas = opts.canvas;
        this.name = opts.name;
        this.top = opts.top;
        this.left = opts.left;
        this.width = opts.width;
        this.height = opts.height;
        var rect = new fabric.Rect({
            //stroke: "blue",
            //strokeWidth: 2,
            fill: 'red',
            selectable: false,
            height: this.height,
            width: this.width,
            hasControls: false,
            hasBorders: false
        });
        var caption = new fabric.Text("" + opts.index, {
            fontSize: 15,
            left: (this.width / 2) - 5,
            top: (this.height / 2) - 7,
            fill: "yellow"
        });
        this.shape = new fabric.Group([rect, caption], {
            left: opts.left,
            top: opts.top,
            selectable: false,
            hasControls: false,
            hasBorders: false
        });
        this.isPossibleToMoveAside = false;
        this.isSelected = false;
        this.tower = opts.tower;
        this.makeMySelfSelected = function () {
            this.isSelected = true;
            var rect = this.shape.item(0);
            rect.setGradient("fill", {
                x1: 0,
                y1: rect.height / 2,
                x2: rect.width,
                y2: rect.height / 2,
                colorStops: {
                    0: "red",
                    0.5: "blue",
                    1: "red"
                }
            });
            //this.shape.item(0).stroke = "red";
            //this.shape.item(0).fill = "blue";
            
            //var rect = this.shape.item(0);
            //rect.setGradient("fill", {
            //    x1: 0,
            //    y1: rect.height / 2,
            //    x2: rect.width,
            //    y2: rect.height / 2,
            //    colorStops: {
            //        0: "blue",
            //        0.5: "red",
            //        1: "blue"
            //    }
            //});
        };
        this.makeMySelfUnSelected = function () {
            this.isSelected = false;
            var rect = this.shape.item(0);
            rect.setGradient("fill", {
                x1: 0,
                y1: rect.height / 2,
                x2: rect.width,
                y2: rect.height / 2,
                colorStops: {
                    0: "#00ffff",
                    0.5: "#b366ff",
                    1: "#00ffff"
                }
            });
            //this.shape.item(0).stroke = "blue";
            //this.shape.item(0).fill = "red";
        };
        this.render = function () {
            var rect = this.shape.item(0);
            rect.setGradient("fill", {
                x1: 0,
                y1: rect.height / 2,
                x2: rect.width,
                y2: rect.height / 2,
                colorStops: {
                    0: "#00ffff",
                    0.5: "#b366ff",
                    1: "#00ffff"
                }
            });
            this.canvas.add(this.shape);
        };

        this.moveTo = function (property, position) {
            //this.shape[property] = position;
            this.shape.item(0).animate(property, position, {
                duration: 200,
                onChange: this.canvas.renderAll.bind(this.canvas),
                onComplete: opts && opts.onComplete,
                easing: fabric.util.easeInCubic
            });
            this.shape.item(1).animate(property, adjustPosition(property, position), {
                duration: 200,
                onChange: this.canvas.renderAll.bind(this.canvas),
                onComplete: opts && opts.onComplete,
                easing: fabric.util.easeInCubic
            });

            function adjustPosition(property, position) {
                if (property == "left") {
                    return position + (self.width / 2) - 5;
                } else {
                    return position + (self.height / 2) - 7;
                }
            }
        };
    };
});