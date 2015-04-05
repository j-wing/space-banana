class App {
    constructor() {
        this.arrowPath = null;
    }

    render() {
        var rect = view.bounds;
        var path = new Path.Rectangle(rect);
        path.fillColor = "black";

        var assets = new Assets()

        // Demo of Assets
        var ship = assets.createShip()
        ship.rotate(180)
        ship.position = view.bounds.center
        ship.position.x -= 200
        // set thrust.visible to true to see thrust
        ship.thrust.visible = false

        var asteroid = assets.createAsteroid(50)
        asteroid.position = view.bounds.center
        asteroid.gravityRing.visible = false
    }

    onMouseDown(event) {
        if (this.arrow != null) {
            this.arrow.remove();
        }
        this.arrowCenter = event.point;
        this.arrowPath = window.arrowPath = new Path.RegularPolygon(event.point, 3, 20);
        this.arrowPath.fillColor = "white";

        this.arrowMagLine = new Path([0, 0], [0,60]);
        this.arrowMagLine.position = event.point;
        this.arrowMagLine.strokeColor = "white";

        // this.arrow = new Group(this.arrowPath, this.arrowMagLine);
        // this.arrow.position = event.point//.add(new Point(0, 0));
        // this.arrow.selected = true;
        // this.arrow.bounds.selected = true;
        // this.arrow.rotate(90, this.arrowCenter);
        // this.arrowRotation = 90
    }

    onMouseUp(event) {

    }

    onMouseDrag(event) {
    }

    onMouseMove(event) {
        if (this.arrowPath != null) {
            var delta = this.arrowCenter.add(event.point.negate());
            // if (delta.angle > 90 || delta.angle < -90) {
            //     return;
            // }
            // this.arrowPath.rotation += 10;
            this.arrowPath.rotate(delta.angle - this.arrowPath.rotation, this.arrowCenter)//, this.arrowCenter)    //, this.arrow.bounds.center)//, this.arrowPath.bounds.center);
            // this.arrowMagLine.lastSegment.point = event.point;
        }
    }
}

window.App = App