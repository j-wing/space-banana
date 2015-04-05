import {Base} from "dist/base"

class App {
    constructor() {
        this.fireLine = null;
    }

    render() {
        var rect = view.bounds;
        var path = new Path.Rectangle(rect);
        path.fillColor = "black";

        var assets = new Assets()

        // // Demo of Assets
        // var ship = assets.createShip()
        // ship.rotate(180)
        // ship.position = view.bounds.center
        // ship.position.x -= 200
        // // set thrust.visible to true to see thrust
        // ship.thrust.visible = false

        // var asteroid = assets.createAsteroid(50)
        // asteroid.position = view.bounds.center
        this.homeBase = new Base(1);
        this.playerShip = assets.createShip(false);
        this.homeBase.positionShip(this.playerShip);
    }

    onMouseDown(event) {
        // if (this.arrow != null) {
        //     this.arrow.remove();
        // }
        // this.arrowCenter = event.point;
        // this.arrowPath = window.arrowPath = new Path.RegularPolygon(event.point, 3, 20);
        // this.arrowPath.fillColor = "white";

        // this.arrowMagLine = new Path([0, 0], [0,60]);
        // this.arrowMagLine.position = event.point;
        // this.arrowMagLine.strokeColor = "white";

        if (event.item == this.playerShip) {
            this.beginShipFire(event);
        }

        // this.arrow = new Group(this.arrowPath, this.arrowMagLine);
        // this.arrow.position = event.point//.add(new Point(0, 0));
        // this.arrow.selected = true;
        // this.arrow.bounds.selected = true;
        // this.arrow.rotate(90, this.arrowCenter);
        // this.arrowRotation = 90
    }

    onMouseUp(event) {
        if (this.fireLine != null) {
            this.fireLine.remove();
        }

    }

    onMouseDrag(event) {
        if (this.fireLine != null) {
            if (event.delta.x > 0) {
                return;
            }

            this.fireLine.lastSegment.point = event.point;
            var closest = this.homeBase.ring.getNearestPoint(event.point);
            this.playerShip.position = closest;
            this.fireLine.firstSegment.point = closest;
        }
    }

    onMouseMove(event) {
    }

    beginShipFire(event) {
        this.fireLine = new Path(this.playerShip.bounds.center, this.playerShip.bounds.center);
        this.fireLine.strokeColor = "#F77542";
    }
}

window.App = App