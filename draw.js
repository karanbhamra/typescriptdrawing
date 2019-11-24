(function () {
    var Canvas = /** @class */ (function () {
        function Canvas(canvas, cxt, width, height) {
            this.cxt = cxt;
            this.width = width;
            this.height = height;
            this.canvas = canvas;
            this.canvas.width = window.innerWidth - 10;
            this.canvas.height = window.innerHeight - 25;
        }
        Canvas.prototype.draw = function (color) {
            this.cxt.fillStyle = color;
            this.cxt.fillRect(0, 0, this.width, this.height);
        };
        return Canvas;
    }());
    var Point = /** @class */ (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        Point.prototype.equals = function (other) {
            if (this.x == other.x && this.y == other.y) {
                return true;
            }
            return false;
        };
        return Point;
    }());
    var Size = /** @class */ (function () {
        function Size(width, height) {
            this.width = width;
            this.height = height;
            this.width = width;
            this.height = height;
        }
        Size.prototype.equals = function (other) {
            if (this.width == other.width && this.height == other.height) {
                return true;
            }
            return false;
        };
        return Size;
    }());
    var Rectangle = /** @class */ (function () {
        function Rectangle(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.left = x;
            this.right = x + width;
            this.top = y;
            this.bottom = y + height;
        }
        Rectangle.prototype.intersectsWith = function (other) {
            if (this.x < other.x + other.width &&
                this.x + this.width > other.x &&
                this.y < other.y + other.height &&
                this.y + this.height > other.y) {
                // collision detected!
                return true;
            }
            return false;
        };
        Rectangle.prototype.equals = function (other) {
            if (this.x == other.x &&
                this.y == other.y &&
                this.width == other.width &&
                this.height == other.height) {
                return true;
            }
            return false;
        };
        Rectangle.prototype.contains = function (point) {
            if (point.x >= this.left &&
                point.x <= this.right &&
                point.y >= this.top &&
                point.y <= this.bottom) {
                return true;
            }
            return false;
        };
        return Rectangle;
    }());
    var Color = /** @class */ (function () {
        function Color(r, g, b) {
            this.r = r;
            this.g = g;
            this.b = b;
        }
        Color.prototype.equals = function (other) {
            if (this.r == other.r && this.g == other.g && this.b == other.b) {
                return true;
            }
            return false;
        };
        return Color;
    }());
    var Ball = /** @class */ (function () {
        function Ball(x, y, radius, color) {
            this.position = new Point(x, y);
            this.size = new Size(radius, radius);
            this.color = color;
            this.hitbox = new Rectangle(this.position.x, this.position.y, this.size.width, this.size.height);
        }
        Ball.prototype.draw = function () {
            throw new Error("Method not implemented.");
        };
        return Ball;
    }());
    var ball = new Ball(0, 0, 25, new Color(255, 0, 0));
    var canvas = document.getElementById("mycanvas");
    var context = canvas.getContext("2d");
    var bgcolor = 'rgb(100,149,237)';
    var background = new Canvas(canvas, context, window.innerWidth, window.innerHeight);
    background.draw(bgcolor);
})();
