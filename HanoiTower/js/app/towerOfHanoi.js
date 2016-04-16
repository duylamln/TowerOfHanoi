define(["app/tower", "app/disk"], function (Tower, Disk) {
    return function (options) {

        var canvas = new fabric.Canvas(options.canvasElementId, {
            hoverCursor: 'pointer',
            selection: false
        });


        var numberOfDisks = options.numberOfDisks || 5;

        var defaultDiskWidth = 30;
        var defaultDiskHeight = 20;
        var defaultDecreaseWidth = 25;
        var maxTopPosition = 450;
        var minTopPosition = 100;
        var defaultDistanceBetweenTower = 300;

        var self = this;
        self.start = start;

        /*set up*/
        var selectedDisk = null;
        var selectedTower = null;

        var towers = [];

        function start() {
            drawBackground();
            drawTowers();
            drawDisks();
            setupCurrentObject();
            setupKeyboard();
            setupMouse();
        }

        function drawBackground() {
            var bottomLine = new fabric.Line([0, 450, 1200, 450], {
                stroke: 'blue',
                strokeWidth: 2,
                selectable: false
            });

            canvas.add(bottomLine);
        }

        function drawTowers() {
            for (var i = 0; i < 3; i++) {
                var topPos = maxTopPosition - defaultDiskHeight;
                var leftPos = defaultDistanceBetweenTower + i * defaultDistanceBetweenTower;
                var name = i == 0 ? "Source" : (i == 1 ? "Temporary" : "Destination");
                var tower = new Tower({
                    index: i,
                    name: name,
                    maximunNumberOfDisks: 3,
                    top: topPos,
                    left: leftPos,
                    canvas: canvas
                });
                addTower(tower);
                tower.render();
            }
        }

        function addTower(tower) {
            towers.push(tower);
        }

        function drawDisks() {
            var maxWidthDisk = defaultDiskWidth * numberOfDisks;
            for (var i = 0; i < numberOfDisks; i++) {
                var disk = new Disk({
                    name: "Disk " + (numberOfDisks - i),
                    index: numberOfDisks - i,
                    height: defaultDiskHeight,
                    width: maxWidthDisk - (i * defaultDecreaseWidth),
                    canvas: canvas
                });

                towers[0].pushDisk(disk);
                towers[0].dropDownTopDisk(disk);
                disk.render();

            }
        }

        function setupCurrentObject() {
            selectedTower = towers[0];
            selectedTower.makeMySelfSelected();
            selectedDisk = selectedTower.getTopDisk();
            selectedDisk.makeMySelfSelected();
            canvas.renderAll();
        }

        function setupKeyboard() {
            document.onkeydown = function (event) {
                var key = window.event ? window.event.keyCode : event.keyCode;
                switch (key) {
                    case 37:
                        // left
                        onLeftButtonPressed();
                        break;
                    case 39:
                        // right
                        onRightButtonPressed();
                        break;
                    case 38:
                        // up
                        onTopButtonPressed();
                        break;
                    case 40:
                        // down
                        onDownButtonPressed();
                        break;
                }
                canvas.renderAll();
            };
        }

        var onDrag = false;

        function setupMouse() {
            canvas.on({
                "mouse:down": function (e) {
                    if (!e.target || !e.target.tower) return;
                    removeSelectedFirst();
                    selectedTower = e.target.tower;
                    selectedDisk = selectedTower.tossTopDisk();
                    selectedDisk.makeMySelfSelected();
                    onDrag = true;
                    canvas.renderAll();
                },
                "mouse:up": function (e) {
                    if (!e.target || !e.target.tower) return;
                    selectedTower = e.target.tower;
                    if (selectedTower.dropDownTopDisk()) {
                        removeSelectedFirst();
                        selectedTower.makeMySelfUnSelected();
                        selectedTower = null;
                        onDrag = false;
                    }
                    canvas.renderAll();
                },
                "mouse:move": function (e) {
                    if (!e.target || !e.target.tower) return;
                    if (onDrag) {
                        var newTower = e.target.tower;
                        if (newTower != selectedTower) {
                            selectedTower.throwTopDiskTo(newTower);
                            selectedTower.makeMySelfUnSelected();
                            selectedTower = newTower;
                            selectedTower.makeMySelfSelected();
                        }
                    } else {
                        removeSelectedFirst();
                        selectedTower = e.target.tower;
                        selectedTower.makeMySelfSelected();
                        selectedDisk = selectedTower.getTopDisk();
                        selectedDisk && selectedDisk.makeMySelfSelected();
                    }
                    canvas.renderAll();
                }
            });
        }

        function removeSelectedFirst() {
            selectedTower && selectedTower.makeMySelfUnSelected();
            selectedDisk && selectedDisk.makeMySelfUnSelected();
        }

        function onTopButtonPressed() {
            selectedTower.tossTopDisk();
        }

        function onDownButtonPressed() {
            selectedTower.dropDownTopDisk();
        }

        function onLeftButtonPressed() {
            var leftTower = getLeftTower();
            if (selectedDisk.isPossibleToMoveAside) {
                selectedTower.throwTopDiskTo(leftTower);
                selectedTower.makeMySelfUnSelected();
                selectedTower = leftTower;
                selectedTower.makeMySelfSelected();

            } else {
                selectedTower = findNearestLeftTowerHasDisk();
                selectedDisk.makeMySelfUnSelected();
                selectedDisk = selectedTower.getTopDisk();
                selectedDisk.makeMySelfSelected();
            }
        }

        function onRightButtonPressed() {
            var rightTower = getRightTower();
            if (selectedDisk.isPossibleToMoveAside) {
                selectedTower.throwTopDiskTo(rightTower);
                selectedTower.makeMySelfUnSelected();
                selectedTower = rightTower;
                selectedTower.makeMySelfSelected();
            } else {
                selectedTower = findNearestRightTowerHasDisk();
                selectedDisk.makeMySelfUnSelected();
                selectedDisk = selectedTower.getTopDisk();
                selectedDisk.makeMySelfSelected();
            }
        }

        function getLeftTower() {
            var selectedIndex = selectedTower.index;
            var leftIndex = selectedIndex - 1;
            if (leftIndex < 0) {
                leftIndex = 2;
            }
            return towers[leftIndex];
        }

        function findNearestLeftTowerHasDisk() {
            var leftTower = getLeftTower();
            selectedTower = leftTower;
            if (leftTower.disks == 0) {
                return findNearestLeftTowerHasDisk();
            }
            return leftTower;
        }

        function findNearestRightTowerHasDisk() {
            var rightTower = getRightTower();
            selectedTower = rightTower;
            if (selectedTower.disks == 0) {
                return findNearestRightTowerHasDisk();
            }
            return rightTower;
        }

        function getRightTower() {
            var selectedIndex = selectedTower.index;
            var rightIndex = selectedIndex + 1;
            if (rightIndex > 2) {
                rightIndex = 0;
            }
            return towers[rightIndex];
        }


    };
});