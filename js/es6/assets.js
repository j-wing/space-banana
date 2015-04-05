
// alert("hello world!")

class Assets {

	constructor() {
	}

	createShip() {
		var thrust = new Path([10,4],[20,7.5],[30,4],[20, -20])
		thrust.closed = true

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

	createAsteroid(radius) {
		var numSides = _.random(5, 12)
		var regShape = new Path.RegularPolygon(new Point(0,0), numSides, radius)
		var shape = new Path()

		// make regShape slightly irregular
		for (var i=0; i < numSides; i++) {
			var pt = regShape.segments[i].point
			var offset = (new Point(20, 20)).multiply(Point.random()).negate()
			pt = pt.add(offset)

			shape.add(pt)
		}

		shape.fillColor = 'white'

		var gravityRing = new Path.Circle(new Point(-10,-10), radius + 20)
		gravityRing.strokeColor = "#FFF"

		var group = new Group(shape, gravityRing)
		group.gravityRing = gravityRing
		return group
	}

}

window.Assets = Assets