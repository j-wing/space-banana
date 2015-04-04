class App {
    constructor() {
        this.canvas = $("canvas");
        this.ctx = this.canvas[0].getContext("2d");
    }

    render() {
        var rect = view.bounds;
        var path = new Path.Rectangle(rect);
        path.fillColor = "black";
    }

    onMouseDown(event) {
        var c = new Path.Circle(event.point, _.random(100));
        c.fillColor = "white";
    }
}

window.App = App