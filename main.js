"use strict";

// 10 x 20
document.addEventListener("DOMContentLoaded", function (ev) {
    init();
});

let canvas, ctx, field, frame_timer, gravity_timer, current_piece;
let frame_interval = 16.6;
let gravity_interval = 800;
let block_padding = 1.6;
// left, right, down, space
let input_arr = [0, 0, 0, 0];
let colors = {
    "green": "hsl(120, 60%, 50%)",
    "blue": "hsl(180, 100%, 65%)",
    "yellow": "hsl(60, 100%, 70%)",
    "red": "hsl(0, 100%, 60%)",
    "purple": "hsl(300, 100%, 50%)"
};

function init() {
    canvas = document.querySelector("#main_canvas");
    ctx = canvas.getContext("2d");
    field = new game_field(10, 20);
    field.draw();
    frame_timer = setInterval(function () {
        process_frame()
    }, frame_interval);
    bind_input();
    current_piece = new game_piece(1);
    gravity_timer = setInterval(function(){
        current_piece.move_down();
    }, gravity_interval);
}


function bind_input() {
    document.addEventListener("keydown", function (ev) {
        let key = ev.key;
        if (key === "a" || key === "ArrowLeft") {
            input_arr[0] = 1;
        }
        if (key === "d" || key === "ArrowRight") {
            input_arr[1] = 1;
        }
        if (key === "s" || key === "ArrowDown") {
            input_arr[2] = 1;
        }
        if (key === " " || key === "ArrowUp") {
            input_arr[3] = 1;
        }
    });
    /*
    document.addEventListener("keyup", function (ev) {
        let key = ev.key;
        if (key === "a" || key === "ArrowLeft") {
            input_arr[0] = 0;
        }
        if (key === "d" || key === "ArrowRight") {
            input_arr[1] = 0;
        }
        if (key === "s" || key === "ArrowDown") {
            input_arr[2] = 0;
        }
        if (key === " " || key === "ArrowUp") {
            input_arr[3] = 0;
        }
    });
    */
    
}

// game_field class
class game_field {
    //width in blocks and height in block
    constructor(width, height) {
        this.x_blocks = width;
        this.y_blocks = height;
        this.block_width = canvas.width / width;
        this.block_height = canvas.height / height;
        this.gravity = 1;
        this.pieces = [];
        this.draw = function () {
            //draw gridlines
            for (let i = 0; i < this.y_blocks; i += 1) {
                for (let j = 0; j < this.x_blocks; j += 1) {
                    ctx.save();
                    ctx.lineWidth = 0.5;
                    ctx.strokeStyle = "hsl(0, 0%, 70%)";
                    ctx.beginPath();
                    let starting_point_x = j * field.block_width;
                    let starting_point_y = i * field.block_height;
                    let end_point_x = starting_point_x + field.block_width;
                    let end_point_y = starting_point_y + field.block_height;
                    ctx.moveTo(starting_point_x, starting_point_y);
                    ctx.lineTo(end_point_x, starting_point_y);
                    ctx.lineTo(end_point_x, end_point_y);
                    ctx.lineTo(starting_point_x, end_point_y);
                    ctx.closePath();
                    ctx.stroke();
                    ctx.restore();
                }
            }
            //draw pieces
        }
        this.update = function () {

        }
        this.add_piece = function (piece) {
            this.pieces.push(piece);
        }
    }
}

/*
Patterns:

   1: (Blue)  2:(Yellow)   3:(Green)       4:(Red)       5:(Purple)
                
    *           * *          * *              *             *
    *           * *            * *          * * *           *
    *                                                       *    
    *                                                     * *
    
*/

class game_piece {
    constructor(pattern) {
        this.blocks = [];
        switch(pattern){
            case 1:
                let start_x = 3 * field.block_width;
                let start_y = 0;
                for (let i = 0; i <= 3; i += 1){
                    let block = new game_block(colors["blue"], start_x, start_y);
                    this.blocks.push(block);
                    start_y += field.block_height;
                }
                break;
        }
        this.draw = function(){
            this.blocks.forEach(function(block){
                block.draw();
            })
        };
        this.move_down = function(){
            this.blocks.forEach(function(block){
                block.move_down();
            })
        }
        this.move_right = function(){
            this.blocks.forEach(function(block){
                block.move_right();
            })
        }
        this.move_left = function(){
            this.blocks.forEach(function(block){
                block.move_left();
            })
        }
        
    }
}

class game_block {
    constructor(fill_color, x, y) {
        this.fill_color = fill_color;
        this.top = y;
        this.left = x;
        this.right = x + field.block_width;
        this.bottom = y + field.block_height;
        
        this.draw = function () {
            ctx.beginPath();
            ctx.fillStyle = "hsl(0,0%,20%)";
            ctx.fillRect(this.left, this.top, field.block_width, field.block_height);
            ctx.clearRect(this.left + block_padding, this.top + block_padding, field.block_width - block_padding * 2, field.block_height - block_padding * 2);
            ctx.fillStyle = this.fill_color;
            ctx.fillRect(this.left + block_padding, this.top + block_padding, field.block_width - block_padding * 2, field.block_height - block_padding * 2);
        }
        this.move_right = function () {
            if (this.right < field.x_blocks * field.block_width) {
                this.left += field.block_width;
                this.right += field.block_width;
            }
        }
        this.move_left = function () {
            if (this.left > 0) {
                this.left -= field.block_width;
                this.right -= field.block_width;
            }
        }
        this.move_down = function () {
            if (this.bottom < field.y_blocks * field.block_height) {
                this.top += field.block_height;
                this.bottom += field.block_height;
            }
        }
    }
}

function reset_input_arr() {
    for (let i = 0; i < input_arr.length; i += 1) {
        input_arr[i] = 0;
    }
}

function process_input_on_current_block() {
    console.log(input_arr);
    if (input_arr[0] === 1) {
        current_piece.move_left();
    }
    if (input_arr[1] === 1) {
        current_piece.move_right();
    }
    if (input_arr[2] === 1) {
        current_piece.move_down();
    }

}

function process_frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    process_input_on_current_block();
    reset_input_arr();
    field.draw();
    


    current_piece.draw();
}
