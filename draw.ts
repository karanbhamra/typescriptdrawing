(function () {

    class List<T> implements IEquateable<List<T>>{
        private list: Array<T>;

        constructor() {
            this.list = new Array<T>();
        }

        size(): number {
            return this.list.length;
        }

        isEmpty(): boolean {
            return (this.list.length == 0);
        }

        add(val: T): void {
            this.list.push(val);
        }

        indexOf(val: T): number {
            for (let i = 0; i < this.size(); i++) {
                if (this.list[i] == val) {
                    return i;
                }
            }
            return -1;
        }

        remove(val: T): boolean {
            let didremove = false;
            let index = this.indexOf(val);

            if (index == -1) {

                return didremove;
            }

            let tempList = new Array<T>();

            for (let i = 0; i < this.size(); i++) {
                if (index != i) {
                    tempList.push(this.list[i]);
                }
            }
            didremove = true;
            this.list = tempList;

            return didremove;
        }

        at(index: number): T {
            if (index < 0 || index >= this.size()) {
                throw new Error("Index is out of range");
            }
            return this.list[index];
        }

        equals(other: List<T>): boolean {
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

        next(min: number = 0, max: number): number {

            let randNum = Math.floor(Math.random() * (max - min)) + min;
            return randNum;
        }
    }

    class Canvas {
        cxt: CanvasRenderingContext2D;
        width: number;
        height: number;
        canvas: HTMLCanvasElement;

        constructor(canvas, cxt, size: Size) {
            this.cxt = cxt;

            this.canvas = canvas;
            this.canvas.width = window.innerWidth - 10;
            this.canvas.height = window.innerHeight - 25;

            this.width = size.width;
            this.height = size.height;
        }

        draw(color: Color): void {
            this.cxt.fillStyle = color.getString();
            this.cxt.fillRect(0, 0, this.width, this.height);
        }

        clear(color: Color): void {
            this.draw(color);
        }

        getHitbox(): Rectangle {
            let hitbox = new Rectangle(0, 0, this.canvas.width, this.canvas.height);

            return hitbox;
        }

    }

    interface IEquateable<T> {
        equals(other: T): boolean;
    }

    class Point implements IEquateable<Point>{

        constructor(public readonly x: number, public readonly y: number) {
        }


        add(other: Point): Point {
            let newPoint = new Point(this.x + other.x, this.y + other.y);
            return newPoint;
        }

        remove(other: Point): Point {
            let newPoint = new Point(this.x - other.x, this.y - other.y);
            return newPoint;
        }

        equals(other: Point): boolean {
            if (this.x == other.x && this.y == other.y) {
                return true;
            }
            return false;
        }
    }

    class Size implements IEquateable<Size> {
        constructor(public readonly width: number, public readonly height: number) {
            this.width = width;
            this.height = height;
        }

        equals(other: Size): boolean {
            if (this.width == other.width && this.height == other.height) {
                return true;
            }
            return false;
        }
    }

    class Rectangle implements IEquateable<Rectangle>{
        left: number;
        right: number;
        top: number;
        bottom: number;

        constructor(public readonly x: number, public readonly y: number, public readonly width: number, public readonly height: number) {
            this.left = x;
            this.right = x + width;
            this.top = y;
            this.bottom = y + height;
        }

        intersectsWith(other: Rectangle): boolean {
            if (this.x < other.x + other.width &&
                this.x + this.width > other.x &&
                this.y < other.y + other.height &&
                this.y + this.height > other.y) {
                return true;
            }

            return false;
        }

        equals(other: Rectangle) {
            if (this.x == other.x &&
                this.y == other.y &&
                this.width == other.width &&
                this.height == other.height) {
                return true;
            }
            return false;
        }

        contains(point: Point): boolean {
            if (point.x >= this.left &&
                point.x <= this.right &&
                point.y >= this.top &&
                point.y <= this.bottom) {
                return true;
            }
            return false;
        }
    }

    interface Sprite {
        position: Point;
        size: Size;
        hitbox: Rectangle;
        draw(ctx: CanvasRenderingContext2D): void;
    }

    class Color implements IEquateable<Color> {
        constructor(public readonly r: number, public readonly g: number, public readonly b: number) {

        }
        equals(other: Color): boolean {
            if (this.r == other.r && this.g == other.g && this.b == other.b) {
                return true;
            }
            return false;
        }

        getString(): string {
            return `rgb(${this.r},${this.g},${this.b})`;
        }

        getRandomColor(gen: Random): Color {

            let tempColor = new Color(gen.next(0, 256), gen.next(0, 256), gen.next(0, 256));
            return tempColor;
        }
    }

    class Ball implements Sprite {
        position: Point;
        size: Size;
        hitbox: Rectangle;
        color: Color
        speed: Point;
        constructor(x: number, y: number, radius: number, speed: Point, color: Color) {
            this.position = new Point(x, y);
            this.size = new Size(radius, radius);
            this.color = color;
            this.speed = speed;
            this.hitbox = new Rectangle(this.position.x, this.position.y, this.size.width, this.size.height);

        }

        update(screen: Rectangle): void {
            this.position = this.position.add(this.speed);

            this.checkBounds(screen);

            this.updateHitbox();
        }

        checkBounds(screen: Rectangle): void {

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

        updateHitbox(): void {
            this.hitbox = new Rectangle(this.position.x, this.position.y, this.size.width, this.size.height);
        }

        draw(ctx: CanvasRenderingContext2D): void {
            ctx.beginPath();
            ctx.fillStyle = this.color.getString();
            ctx.arc(this.hitbox.right, this.hitbox.bottom, this.size.width, 0, 2 * Math.PI, false);
            ctx.fill();
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;
    let bgcolor: Color;
    let background: Canvas;
    let balls: List<Ball>;
    let gen: Random;

    function setup() {
        canvas = document.getElementById("mycanvas") as HTMLCanvasElement;
        context = canvas.getContext("2d");
        background = new Canvas(canvas, context, new Size(window.innerWidth, window.innerHeight));
        bgcolor = new Color(100, 149, 237);

        balls = new List<Ball>();

        gen = new Random();
        let numBalls = 5;

        for (let i = 0; i < numBalls; i++) {
            balls.add(new Ball(
                gen.next(0, background.width),
                gen.next(0, background.height),
                gen.next(10, 50),
                new Point(5, 5),
                new Color(gen.next(0, 256), gen.next(0, 256), gen.next(0, 256))));
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