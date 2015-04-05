export class Ship {
    constructor() {
        this.object = this.createShip(false);
    }

    createShip(thrustVisible) {
        var thrust = new Path([10,4],[20,7.5],[30,4],[20, -20])
        thrust.closed = true;
        thrust.visible = thrustVisible;


        var ship = new Path([0,0], [20,50], [40,0], [20,7.5])
        ship.closed = true

        var group = new Group(ship, thrust)

        // Styling
        ship.fillColor = 'white'
        thrust.fillColor = '#F77542'

        /* Notes
        - set `thrust.visible = false` to hide thrust
        - rotate/scale using .rotate() and .scale(factor)
        */
        group.thrust = thrust
        return group
    }

}