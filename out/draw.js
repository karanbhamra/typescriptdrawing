(function () {
    class List {
        constructor() {
            this.list = new Array();
        }
        size() {
            return this.list.length;
        }
        isEmpty() {
            return (this.list.length == 0);
        }
        add(val) {
            this.list.push(val);
        }
        indexOf(val) {
            for (let i = 0; i < this.size(); i++) {
                if (this.list[i] == val) {
                    return i;
                }
            }
            return -1;
        }
        remove(val) {
            let didremove = false;
            let index = this.indexOf(val);
            if (index == -1) {
                return didremove;
            }
            let tempList = new Array();
            for (let i = 0; i < this.size(); i++) {
                if (index != i) {
                    tempList.push(this.list[i]);
                }
            }
            didremove = true;
            this.list = tempList;
            return didremove;
        }
        at(index) {
            if (index < 0 || index >= this.size()) {
                throw new Error("Index is out of range");
            }
            return this.list[index];
        }
        equals(other) {
            if (other.size() != this.size()) {
                return false;
            }
            for (let i = 0; i < this.size(); i++) {
                if (this.list[i] != other.at(i)) {
                    return false;
                }
            }
            return true;
        }
    }
    class Random {
        constructor() {
        }
        next(min = 0, max) {
            let randNum = Math.floor(Math.random() * (max - min)) + min;
            return randNum;
        }
    }
    class Canvas {
        constructor(canvas, cxt, size) {
            this.cxt = cxt;
            this.canvas = canvas;
            this.canvas.width = window.innerWidth - 10;
            this.canvas.height = window.innerHeight - 25;
            this.width = size.width;
            this.height = size.height;
        }
        draw(color) {
            this.cxt.fillStyle = color.getString();
            this.cxt.fillRect(0, 0, this.width, this.height);
        }
        clear(color) {
            this.draw(color);
        }
        getHitbox() {
            let hitbox = new Rectangle(0, 0, this.canvas.width, this.canvas.height);
            return hitbox;
        }
    }
    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        add(other) {
            let newPoint = new Point(this.x + other.x, this.y + other.y);
            return newPoint;
        }
        remove(other) {
            let newPoint = new Point(this.x - other.x, this.y - other.y);
            return newPoint;
        }
        equals(other) {
            if (this.x == other.x && this.y == other.y) {
                return true;
            }
            return false;
        }
    }
    class Size {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.width = width;
            this.height = height;
        }
        equals(other) {
            if (this.width == other.width && this.height == other.height) {
                return true;
            }
            return false;
        }
    }
    class Rectangle {
        constructor(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.left = x;
            this.right = x + width;
            this.top = y;
            this.bottom = y + height;
        }
        intersectsWith(other) {
            if (this.x < other.x + other.width &&
                this.x + this.width > other.x &&
                this.y < other.y + other.height &&
                this.y + this.height > other.y) {
                return true;
            }
            return false;
        }
        equals(other) {
            if (this.x == other.x &&
                this.y == other.y &&
                this.width == other.width &&
                this.height == other.height) {
                return true;
            }
            return false;
        }
        contains(point) {
            if (point.x >= this.left &&
                point.x <= this.right &&
                point.y >= this.top &&
                point.y <= this.bottom) {
                return true;
            }
            return false;
        }
    }
    class Color {
        constructor(r, g, b) {
            this.r = r;
            this.g = g;
            this.b = b;
        }
        equals(other) {
            if (this.r == other.r && this.g == other.g && this.b == other.b) {
                return true;
            }
            return false;
        }
        getString() {
            return `rgb(${this.r},${this.g},${this.b})`;
        }
        getRandomColor(gen) {
            let tempColor = new Color(gen.next(0, 256), gen.next(0, 256), gen.next(0, 256));
            return tempColor;
        }
    }
    class Ball {
        constructor(x, y, radius, speed, color) {
            this.position = new Point(x, y);
            this.size = new Size(radius, radius);
            this.color = color;
            this.speed = speed;
            this.hitbox = new Rectangle(this.position.x, this.position.y, this.size.width, this.size.height);
        }
        update(screen) {
            this.position = this.position.add(this.speed);
            this.checkBounds(screen);
            this.updateHitbox();
        }
        checkBounds(screen) {
            if (this.hitbox.right >= screen.right) {
                this.speed = new Point(-Math.abs(this.speed.x), this.speed.y);
                this.color = this.color.getRandomColor(gen);
            }
            else if (this.hitbox.left <= screen.left) {
                this.speed = new Point(Math.abs(this.speed.x), this.speed.y);
                this.color = this.color.getRandomColor(gen);
            }
            else if (this.hitbox.bottom >= screen.bottom) {
                this.speed = new Point(this.speed.x, -Math.abs(this.speed.y));
                this.color = this.color.getRandomColor(gen);
            }
            else if (this.hitbox.top <= screen.top) {
                this.speed = new Point(this.speed.x, Math.abs(this.speed.y));
                this.color = this.color.getRandomColor(gen);
            }
        }
        updateHitbox() {
            this.hitbox = new Rectangle(this.position.x, this.position.y, this.size.width, this.size.height);
        }
        draw(ctx) {
            ctx.beginPath();
            ctx.fillStyle = this.color.getString();
            ctx.arc(this.hitbox.right, this.hitbox.bottom, this.size.width, 0, 2 * Math.PI, false);
            ctx.fill();
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let canvas;
    let context;
    let bgcolor;
    let background;
    let balls;
    let gen;
    function setup() {
        canvas = document.getElementById("mycanvas");
        context = canvas.getContext("2d");
        background = new Canvas(canvas, context, new Size(window.innerWidth, window.innerHeight));
        bgcolor = new Color(100, 149, 237);
        balls = new List();
        gen = new Random();
        let numBalls = 5;
        for (let i = 0; i < numBalls; i++) {
            balls.add(new Ball(gen.next(0, background.width), gen.next(0, background.height), gen.next(10, 50), new Point(5, 5), new Color(gen.next(0, 256), gen.next(0, 256), gen.next(0, 256))));
        }
    }
    function loop() {
        background.clear(bgcolor);
        for (let i = 0; i < balls.size(); i++) {
            balls.at(i).update(background.getHitbox());
        }
        draw();
    }
    function draw() {
        for (let i = 0; i < balls.size(); i++) {
            balls.at(i).draw(context);
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    setup();
    (function startloop() {
        window.setInterval(loop, 16);
    })();
})();
//# sourceMappingURL=draw.js.map