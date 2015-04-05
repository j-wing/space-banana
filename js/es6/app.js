class App {
    constructor() {
        this.arrowPath = null;
        this.ships = []
        this.asteroids = []
        this.assets = new Assets()
    }

    render() {
        var rect = view.bounds;
        var path = new Path.Rectangle(rect);
        path.fillColor = "black";

        // Demo of Assets
        // var ship = this.assets.createShip()
        // ship.rotate(180)
        // ship.position = view.bounds.center
        // ship.position.x -= 200
        // // set thrust.visible to true to see thrust
        // // ship.thrust.visible = false

        // var asteroid = this.assets.createAsteroid(50)
        // asteroid.position = view.bounds.center
        // asteroid.gravityRing.visible = false

        this.generateLayout()
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

    onMouseDown(event) {
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