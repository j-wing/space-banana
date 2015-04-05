import {Base} from "dist/base"
function keepInView(item) {
    var position = item.position;
    var itemBounds = item.bounds;
    var bounds = view.bounds;

    if (itemBounds.left > bounds.width) {
        alert("You win!");
        window.app.gameEnded = true;
    }


    if (itemBounds.top > view.size.height) {
        position.y = -itemBounds.height;
    }

    if (position.y < -itemBounds.height) {
        position.y = bounds.height  + itemBounds.height / 2;
    }
}

class App {
    constructor() {
        this.fireLine = null;
        this.ships = [];
        this.asteroids = [];
        this.assets = new Assets();

        this.shipMotion = new Point({angle:0, length:0});
        this.shipAbleToLaunch = true;
        this.gameEnded = false;
        this.exploding = false;
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

        this.playerShip = this.assets.createShip();
        this.playerShip.thrust.visible = false
        this.playerShip.scale(0.75)

        this.homeBase.positionShip(this.playerShip);
        this.generateLayout();
    }

    onFrame(event) {
        // console.log(this.shipMotion);
        if (this.exploding) {
            this.playerShip.opacity *= 0.98;
            if (this.playerShip.opacity < .1) {
                this.playerShip.remove();
            }
        }
        else if (this.gameEnded && !this.exploding) {
            this.asplode();
        }
        else if (this.shipNearCollision()) {
            this.shipMotion = this.shipMotion.add(this.shipMotion.negate().multiply(.9));

        }
        else if (this.shipHasCollided()) {
            this.asplode();
            this.gameEnded = true;
        }

        else if (!this.shipAbleToLaunch) {
            this.playerShip.position = this.playerShip.position.add(this.shipMotion);
            if (this.shipMotion.length > .20) {
                this.playerShip.thrust.visible = true;
            }
            else {
                this.playerShip.thrust.visible = false;
            }

            keepInView(this.playerShip);

            this.shipMotion = this.shipMotion.multiply(.992);
        }
    }

    asplode() {
        this.exploding = true;
    }

    shipNearCollision() {
        for (var i=0; i < this.asteroids.length; i++) {
            var closest = this.playerShip.firstChild.getNearestPoint(this.asteroids[i].firstChild.bounds.center);
            if (closest.subtract(this.playerShip.position).length < 5) {
                return true;
            }
        }
        return false;
    }

    shipHasCollided() {
        for (var i in this.asteroids) {
            if (this.playerShip.intersects(this.asteroids[i].firstChild)) {
                return true;
            }
        }
        return false;
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

        if (event.item == this.playerShip && this.shipAbleToLaunch) {
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
            this.playerShip.angle = this.fireLine.angle
            this.fireLine.remove();
            this.fireLine = null;
            this.shipAbleToLaunch = false;
        }

    }

    generateLayout() {
        /* Generates layout, with a default number of asteroids */
        var globalBounds = view.bounds.clone()
        globalBounds.width -= 600
        globalBounds.x += 300

        for (var i=0; i < 20; i++) {
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
        if (this.fireLine != null && this.shipAbleToLaunch) {

            if (this.playerShip.prevRotation !== undefined) {
                this.playerShip.rotate(-this.playerShip.prevRotation, this.fireLine.firstSegment.point)
            }

            this.fireLine.lastSegment.point = event.point;
            var vector = this.fireLine.lastSegment.point.add((this.fireLine.firstSegment.point).negate())
            this.playerShip.prevRotation = vector.angle + 180
            var center = this.playerShip.bounds.center.clone()
            this.playerShip.rotate(this.playerShip.prevRotation, this.fireLine.firstSegment.point)

        } else if (this.shipAbleToLaunch) {
            var closest = this.homeBase.ring.getNearestPoint(event.point);
            this.playerShip.position = closest;
        }
    }

    onMouseMove(event) {
    }

    onKeyDown(event) {
        if (event.key === "right") {
            // console.log(prevLeft/)
            console.log("right key pressed")
            var rightPos = $("#game").position().left
            if (rightPos - 200 < -2000 + $(window).width()) {
                rightPos = -2000 + $(window).width() + 200
            }
            TweenLite.to("#game", 0.3, {
                left: rightPos - 200
            })
        }
        if (event.key === "left") {
            var leftPos = $("#game").position().left
            if (leftPos + 200 > 0) {
                leftPos = -200
            }
            TweenLite.to("#game", 0.3, {
                left: leftPos + 200
            })
        }
    }

    beginShipFire(event) {
        this.fireLine = new Path(this.playerShip.bounds.center, this.playerShip.bounds.center);
        this.fireLine.strokeColor = "#F77542";
        this.fireLine.strokeWidth = 3;
    }
}

window.App = App