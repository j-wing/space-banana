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
        this.shipAngle = 0;
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
        this.enemyBase = new Base(2);

        this.playerShip = this.assets.createShip();
        this.playerShip.thrust.visible = false
        this.playerShip.scale(0.75)

        this.homeBase.positionShip(this.playerShip);
        this.generateLayout();
    }

    onFrame(event) {
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
            this.addGravityAccel();
            this.playerShip.position = this.playerShip.position.add(this.shipMotion);
            if (this.shipMotion.length > .20) {
                this.playerShip.thrust.visible = true;
            }
            else {
                this.playerShip.thrust.visible = false;
            }

            keepInView(this.playerShip);

            if (this.shouldScrollLeft()) {
                this.scrollLeft();
            }
            else if (this.shouldScrollRight()) {
                this.scrollRight();
            }

            this.shipMotion = this.shipMotion.multiply(.992);
        }
    }

    addGravityAccel() {
        var shipWeight = 1;
        var G = 4;

        var gForce = new Point({angle:0, length:0});
        for (var i=0;i < this.asteroids.length;i++) {
            var dist = this.playerShip.position.subtract(this.asteroids[i].position);
            dist.length = this.asteroids[i].radius * G / Math.pow(dist.length, 2);
            gForce = gForce.add(dist.negate());
        }
        this.shipMotion = this.shipMotion.add(gForce);
    }

    getShipViewportPos() {
        // Note: left offset is negative
        return this.playerShip.position.x + $("#game").position().left;
    }

    shouldScrollLeft() {
        return this.getShipViewportPos() < (window.innerWidth * .1);
    }

    shouldScrollRight() {
        return this.getShipViewportPos() > (window.innerWidth * .8);
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
            delta.length /= 10;
            this.shipMotion = delta;
            this.fireLine.remove();
            this.fireLine = null;
            this.shipAbleToLaunch = false;
        }

    }

    generateLayout() {
        /* Generates layout, with a default number of asteroids */
        var globalBounds = view.bounds.clone()
        globalBounds.width -= 400
        globalBounds.x += 200

        for (var i=0; i < NUM_ASTEROIDS; i++) {
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

    scrollRight() {
        var rightPos = $("#game").position().left;
        if (rightPos - SCROLL_AMOUNT < -CANVAS_WIDTH + $(window).width()) {
            rightPos = -CANVAS_WIDTH + $(window).width() + SCROLL_AMOUNT;
        }
        TweenLite.to("#game", 0.3, {
            left: rightPos - SCROLL_AMOUNT,
            ease:Linear.ease
        });
    }

    scrollLeft() {
        var leftPos = $("#game").position().left
        if (leftPos + SCROLL_AMOUNT > 0) {
            leftPos = -SCROLL_AMOUNT;
        }

        TweenLite.to("#game", 0.3, {
            left: leftPos + SCROLL_AMOUNT,
            ease:Linear.ease
        });
    }

    onKeyDown(event) {
        switch(event.key) {
            case "right":
                this.playerShip.rotate(TURN_AMT);
                this.shipAngle += TURN_AMT;

                break;
            case "left":
                this.playerShip.rotate(-TURN_AMT);
                this.shipAngle -= TURN_AMT;
                break;
            case "up":
                this.shipMotion = this.shipMotion.add(new Point({angle:this.shipAngle, length:.05}));
                break;

        }
            // if (event.key === "right") {
            //     // this.scrollRight();
            //     this.playerShip.rotate(3);
            // }
            // else if (event.key === "left") {
            //     // this.scrollLeft(); 
            //     this.playerShip.rotate(-3);

            // }
    }

    beginShipFire(event) {
        this.fireLine = new Path(this.playerShip.bounds.center, this.playerShip.bounds.center);
        this.fireLine.strokeColor = "#F77542";
        this.fireLine.strokeWidth = 3;
    }
}

window.App = App