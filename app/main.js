(function () {
    function TowerOfHanoi() {

        var canvas = new fabric.Canvas("tower");
        var numberOfDisks = 8;
        var defaultDiskWidth = 30;
        var defaultDiskHeight = 20;
        var defaultDecreaseWidth = 25;
        var maxTopPosition = 450;
        var minTopPosition = 100;
        var defaultDistanceBetweenTowTower = 300;
        var defaultPaddingLeft = 200;

        var self = this;

        self.selectedDisk = null;
        self.selectedTower = null;


        self.init = init;
        self.towers = [];
        self.addTower = function (tower) {
            this.towers.push(tower);
        };

        function init() {
            drawBackground();
            drawTowers();
            drawDisks();
            setupCurrentObject();
            setupKeyboard();
        }


        function drawBackground() {
            var bottomLine = new fabric.Line([0, 450, 1200, 450], {
                stroke: 'blue',
                strokeWidth: 2,
            });
            
            canvas.add(bottomLine);
        }

        function drawTowers() {
            for (var i = 0; i < 3; i++) {
                var topPos = maxTopPosition - defaultDiskHeight;
                var leftPos = defaultDistanceBetweenTowTower + i * defaultDistanceBetweenTowTower;
                var tower = new Tower({
                    index: i,
                    name: "Tower " + (i + 1),
                    maximunNumberOfDisks: 3,
                    top: topPos,
                    left: leftPos,
                    canvas: canvas,
                    shape: new fabric.Line([leftPos, minTopPosition, leftPos, maxTopPosition], {
                        stroke: 'blue',
                        strokeWidth: 2,
                    })
                });
                self.addTower(tower);
                canvas.add(tower.shape);
            }
        }

        function drawDisks() {
            var maxWidthDisk = defaultDiskWidth * numberOfDisks;
            for (var i = 0; i < numberOfDisks; i++) {
                var disk = new fabric.Rect({
                    stroke: "red",
                    strokeWidth: 2,
                    fill: 'blue',
                    selectable: true,
                    height: defaultDiskHeight,
                    width: maxWidthDisk - (i * defaultDecreaseWidth)
                });
                disk.set({
                    text: i + 1,
                    file: "white"
                });
                self.towers[0].pushDisk(disk);
                self.towers[0].dropDownTopDisk();

            }
            for (var i = 0; i < self.towers[0].disks.length; i++) {
                canvas.add(self.towers[0].disks[i]);
            }
        }

        function setupCurrentObject() {
            self.selectedTower = self.towers[0];
            self.selectedDisk = self.selectedTower.makeTopDiskAsDefaultAndRollbackCurrentSelectedDisk(self.selectedDisk);
            canvas.renderAll();
        }

        function setupKeyboard() {
            document.onkeydown = function (event) {
                var key = window.event ? window.event.keyCode : event.keyCode;
                switch (key) {
                    case 37: // left
                        onLeftButtonPressed();
                        break;
                    case 39: // right
                        onRightButtonPressed();
                        break;
                    case 38: // up
                        onTopButtonPressed();
                        break;
                    case 40: // down
                        onDownButtonPressed();
                        break;
                }
                canvas.renderAll();
            };
        }

        function onLeftButtonPressed() {
            var leftTower = getLeftTower();
            if (self.selectedDisk.isPossibleToMoveAside) {
                self.selectedTower.throwDiskTo(leftTower);
                self.selectedTower = leftTower;
            } else {
                findNearestLeftTowerHasDisk();
                self.selectedDisk = self.selectedTower.makeTopDiskAsDefaultAndRollbackCurrentSelectedDisk(self.selectedDisk);
            }
        }

        function onRightButtonPressed() {
            var rightTower = getRightTower();
            if (self.selectedDisk.isPossibleToMoveAside) {
                self.selectedTower.throwDiskTo(rightTower);
                self.selectedTower = rightTower;
            } else {
                findNearestRightTowerHasDisk();
                self.selectedDisk = self.selectedTower.makeTopDiskAsDefaultAndRollbackCurrentSelectedDisk(self.selectedDisk);
            }
        }

        function getLeftTower() {
            var selectedIndex = self.selectedTower.index;
            var leftIndex = selectedIndex - 1;
            if (leftIndex < 0) {
                leftIndex = 2;
            }
            return self.towers[leftIndex];
        }

        function findNearestLeftTowerHasDisk() {
            self.selectedTower = getLeftTower();
            if (self.selectedTower.disks == 0) {
                findNearestLeftTowerHasDisk();
            }
        }

        function findNearestRightTowerHasDisk() {
            self.selectedTower = getRightTower();
            if (self.selectedTower.disks == 0) {
                findNearestRightTowerHasDisk();
            }
        }

        function getRightTower() {
            var selectedIndex = self.selectedTower.index;
            var rightIndex = selectedIndex + 1;
            if (rightIndex > 2) {
                rightIndex = 0;
            }
            return self.towers[rightIndex];
        }

        function onTopButtonPressed() {
            self.selectedTower.tossTopDisk();
        }

        function onDownButtonPressed() {
            self.selectedTower.dropDownTopDisk();
        }
    }

    function Tower(options) {
        this.index = options.index;
        this.maximumNumberOfDisks = options.maximunNumberOfDisks || 3;
        this.disks = [];
        this.top = options.top;
        this.left = options.left;
        this.shape = options.shape;
        this.pushDisk = function (disk) {
            var self = this;
            moveDiskWithAnimation(disk, "left", this.left - (disk.width / 2));

            self.disks.push(disk);
            disk.tower = self;
        };
        this.dropDownTopDisk = function () {
            var numberOfCurrentDisks = this.disks.length - 1;
            var topDisk = this.disks[numberOfCurrentDisks];
            var rightDownDisk = this.disks[numberOfCurrentDisks - 1];
            if (rightDownDisk && topDisk.width > rightDownDisk.width) {
                console.log("Can not drop down");
                return;
            }
            var topPos = this.top - ((numberOfCurrentDisks) * topDisk.height);
            moveDiskWithAnimation(topDisk, "top", topPos);
            topDisk.isPossibleToMoveAside = false;
        };
        this.tossTopDisk = function () {
            var numberOfCurrentDisks = this.disks.length - 1;
            var topDisk = this.disks[numberOfCurrentDisks];
            moveDiskWithAnimation(topDisk, "top", 100);
            topDisk.isPossibleToMoveAside = true;
            return topDisk;
        };

        this.throwDiskTo = function (targetTower) {
            var disk = this.popDisk();
            targetTower.pushDisk(disk);
        };

        this.makeTopDiskAsDefaultAndRollbackCurrentSelectedDisk = function (currentSelectedDisk) {
            if (currentSelectedDisk) {
                currentSelectedDisk.stroke = "red";
                currentSelectedDisk.fill = "blue";
            }
            var numberOfCurrentDisks = this.disks.length - 1;
            var topDisk = this.disks[numberOfCurrentDisks];
            topDisk.stroke = "blue";
            topDisk.fill = "red";
            return topDisk;

        };
        this.popDisk = function () {
            return this.disks.pop();
        };

        function moveDiskWithAnimation(disk, property, to, opts) {
            disk.animate(property, to, {
                duration: 200,
                onChange: options.canvas.renderAll.bind(options.canvas),
                onComplete: opts && opts.onComplete,
                easing: fabric.util.easeInCubic
            });
        }
    }

    var game = new TowerOfHanoi();
    game.init();
})();
