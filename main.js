"use strict";

// 10 x 20
document.addEventListener("DOMContentLoaded", function (ev) {
    init();
});

let canvas, ctx, field, frame_timer, current_block;
let frame_interval = 800;
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
    current_block = new game_block(colors["purple"], 2 * field.block_width, 0);
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
            for(let i = 0; i < this.y_blocks; i += 1 ){
                for(let j = 0; j < this.x_blocks; j += 1){
                    ctx.save();
                    ctx.lineWidth = 0.5;
                    ctx.strokeStyle = "hsl(0, 0%, 85%)";
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
            ctx.clearRect(this.left + 2, this.top + 2, field.block_width - 4, field.block_height - 4);
            ctx.fillStyle = this.fill_color;
            ctx.fillRect(this.left + 2, this.top + 2, field.block_width - 4, field.block_height - 4);
        }
    }
}


function process_frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    field.draw();
    if (current_block.bottom < canvas.height) {
        current_block.top += field.block_height;
        current_block.bottom += field.block_height;
    }

    current_block.draw();
}
