define([], function () {
    return function (options) {
        var self = this;
        this.index = options.index;
        this.name = options.name;
        this.maximumNumberOfDisks = options.maximunNumberOfDisks || 3;
        this.disks = [];
        
        this.top = options.top;
        this.left = options.left;
        this.shape = new fabric.Line([this.left, 100, this.left, 450], {
            stroke: 'blue',
            strokeWidth: 2,
            selectable: false
        });
        
        this.indicator = new fabric.Text(options.name, {
            fontSize: 20,
            top: this.top + 20,
            left: this.left,
            fill: "blue",
            selectable: false,
            hasControls: false,
            hasBorders: false
        });

        this.area = new fabric.Rect({
            fill: 'white',
            top: 100,
            left: this.left - 150,
            selectable: false,
            height: 350,
            width: 300,
            hasControls: false,
            hasBorders: false,
            opacity: 0.5,
            tower: this
        });
        this.canvas = options.canvas;

        this.pushDisk = function(disk) {
            var self = this;
            disk.moveTo("left", this.left - (disk.width / 2));
            self.disks.push(disk);
            disk.tower = self;
        };
        this.getTopDisk = function() {
            return this.disks[this.disks.length - 1];
        };
        this.dropDownTopDisk = function () {
            var numberOfCurrentDisks = this.disks.length - 1;
            var topDisk = this.disks[numberOfCurrentDisks];
            var rightDownDisk = this.disks[numberOfCurrentDisks - 1];
            if (rightDownDisk && topDisk.width > rightDownDisk.width) {
                console.log("Can not drop down");
                return false;
            }
            var topPos = this.top - ((numberOfCurrentDisks) * (topDisk.height));
            topDisk.moveTo("top", topPos);
            topDisk.isPossibleToMoveAside = false;
            return true;
        };
        this.tossTopDisk = function () {
            var numberOfCurrentDisks = this.disks.length - 1;
            var topDisk = this.disks[numberOfCurrentDisks];
            topDisk.moveTo("top", 100);
            topDisk.isPossibleToMoveAside = true;
            return topDisk;
        };

        this.throwTopDiskTo = function (targetTower) {
            var disk = this.popDisk();
            targetTower.pushDisk(disk);
        };

        this.popDisk = function () {
            return this.disks.pop();
        };

        this.makeMySelfSelected = function () {
            this.isSelected = true;
            this.indicator.fill = "red";
        };
        this.makeMySelfUnSelected = function () {
            this.isSelected = false;
            this.indicator.fill = "blue";
        };
        this.render = function () {
            this.canvas.add(this.area);
            this.canvas.add(this.shape);
            this.indicator.left = this.indicator.left - (this.indicator.getWidth() / 2);
            this.canvas.add(this.indicator);
            
        };
    };
});

