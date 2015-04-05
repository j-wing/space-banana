export class Base {
    constructor(player) {
        this.player = player;
        if (player == 1) {
            this.baseX = 0;
            this.planetBulgeOffset = 200
            this.offsetFactor = 1;
        }
        else {
            this.baseX = view.bounds.right;
            this.planetBulgeOffset = this.baseX - 200;
            this.offsetFactor = -1;
        }

        this.planet = this.createPlanet();
        // this.planet.lastChild.flatten(100);

        this.ring = this.makeRing();
        this.ring.strokeColor = "white";
    }

    createPlanet() {
        return new CompoundPath({
                    children:[
                        new Path.Line([this.baseX, 0], [this.baseX, view.bounds.bottom]),
                        new Path.Arc([this.baseX, 0], [this.planetBulgeOffset, view.bounds.centerY], [this.baseX, view.bounds.bottom])
                    ],
                    fillColor:"white"
                });
    }

    makeRing() {
        return new Path.Arc(
            [this.baseX + 50*this.offsetFactor, 0], 
            [this.planetBulgeOffset + 50*this.offsetFactor, view.bounds.centerY], 
            [this.baseX + 50*this.offsetFactor, view.bounds.bottom]
        );
    }

    positionShip(ship) {
        ship.position = this.ring.getPointAt(view.bounds.centerY).clone();
        ship.rotation = -90;
    }
}