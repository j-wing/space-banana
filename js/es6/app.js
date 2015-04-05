import {Base} from "dist/base"

class App {
    constructor() {
        this.fireLine = null;
        this.ships = [];
        this.asteroids = [];
        this.assets = new Assets();

        this.shipMotion = new Point({angle:0, length:0});
    }

    render() {
        var rect = view.bounds;
        var path = new Path.Rectangle(rect);
        path.fillColor = "black";


        // // Demo of Assets
        // var ship = assets.createShip()
        // ship.thrust.visible = false

        // var asteroid = assets.createAsteroid(50)
        // asteroid.position = view.bounds.center
        this.homeBase = new Base(1);
        this.playerShip = this.assets.createShip(false);
        this.homeBase.positionShip(this.playerShip);
        this.generateLayout();
    }

    onFrame(event) {
        // console.log(this.shipMotion);
        this.playerShip.position = this.playerShip.position.add(this.shipMotion);
        if (this.shipMotion.length > .2) {
            this.playerShip.thrust.visible = true;
        }
        else {
            this.playerShip.thrust.visible = false;
        }

        this.shipMotion = this.shipMotion.multiply(.992);
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
            var delta = this.playerShip.position.subtract(event.point);
            delta.length /= 20
            this.shipMotion = delta;
            this.fireLine.remove();
            this.fireLine = null;
        }

    }

    generateLayout() {
        /* Generates layout, with a default number of asteroids */
        var globalBounds = view.bounds.clone()
        console.log(globalBounds)
        globalBounds.width -= 400
        globalBounds.x += 200

        for (var i=0; i < 10; i++) {
            console.log("hi")
            var asteroid = undefined;
            do {
                if (asteroid !== undefined) {
                    asteroid.remove()
                }
                var radius = _.random(20, 60)
                asteroid = this.assets.createAsteroid(radius)

                var bounds = globalBounds.clone()
                bounds.width -= radius*2 + 50
                bounds.height -= radius*2 + 50
                bounds.x += radius
                bounds.y += radius

                asteroid.position = bounds.bottomRight.multiply(Point.random()).add(bounds.topLeft)
                // this.asteroids.push(asteroid)
            } while (this.collidesWith(asteroid, this.asteroids))

            this.asteroids.push(asteroid)
        }

        console.log(this.asteroids)
    }

    collidesWith(asteroid, prevAsteroids) {
        for (var i=0; i < prevAsteroids.length; i++) {
            var a = prevAsteroids[i]
            if (a.intersects(asteroid) || a.isInside(asteroid.bounds) || asteroid.isInside(a.bounds)) {
                return true
            }
        }
        return false
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
        this.fireLine.strokeWidth = 3;
    }
}

window.App = App