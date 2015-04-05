export class Base {
    constructor(player) {
        this.player = player;
        this.planet = this.createPlanet();
        this.planet.lastChild.flatten(200);

        this.ring = this.makeRing();
        this.ring.strokeColor = "white";
    }

    createPlanet() {
        return new CompoundPath({
                    children:[
                        new Path.Line([0, 0], [0, view.bounds.bottomLeft.y]), 
                        new Path.Arc([0, 0], [200, view.bounds.centerY], [0, view.bounds.bottomLeft.y])
                    ],
                    fillColor:"white"
                });
    }

    makeRing() {
        return new Path.Arc([50, 0], [250, view.bounds.centerY], [50, view.bounds.bottomLeft.y]);
    }

    positionShip(ship) {
        ship.position = this.ring.getPointAt(view.bounds.centerY).clone();
        ship.rotation = -90;
    }
}