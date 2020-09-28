"use strict";

// 10 x 20
document.addEventListener("DOMContentLoaded", function (ev) {
    init();
});

let canvas, ctx, field, frame_timer, gravity_timer;
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


function rotate_array_clockwise(arr){
    let local_arr = arr;
    let new_arr = [];
    let old_row_length = local_arr[0].length;
    let old_column_length = local_arr.length;
    for(let i = 0; i < old_row_length; i += 1){
        let new_row = [];
        for(let j = 0; j < old_column_length; j += 1){
            new_row.push(0);
        }
        new_arr.push(new_row);
    }
    
    
    
    for(let i = local_arr.length - 1; i >= 0; i -= 1){
        let row = local_arr[i];
        for(let j = 0; j < row.length; j += 1){
            new_arr[j][local_arr.length - 1 - i] = row[j];
        }
    }
    return new_arr;
   
    
}


function init() {
    
    canvas = document.querySelector("#main_canvas");
    ctx = canvas.getContext("2d");
    field = new game_field(10, 20);
    
    frame_timer = setInterval(function () {
        process_frame()
    }, frame_interval);
    bind_input();
    field.current_piece = new game_piece(1);
    gravity_timer = setInterval(function () {
        field.current_piece.move_down();
    }, gravity_interval);
    field.draw();
    
   
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
        this.current_piece;
        
        this.generate_new_current_piece = function(){
            this.current_piece = new game_piece(1);
        }
        this.deactivate_piece = function(){
            
            this.pieces.push(this.current_piece);
            
            
            this.generate_new_current_piece();
            
        }
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
            //draw current piece;
            this.current_piece.draw();

            //draw inactive pieces;
            this.pieces.forEach(piece => {
                piece.draw();
            })
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
    // enter pattern in array format [[0,1,0],[1,1,1]] like that. this is shape 4;
    constructor(pattern) {
        this.blocks = [];
        
        this.draw = function () {
            this.blocks.forEach(function (block) {
                block.draw();
            })
        };
        this.touches_other_piece_bottom = function(){
            for(let i = 0; i < field.pieces.length; i += 1){
                let current_piece = field.pieces[i];
                
            }
        }
        this.touches_bottom = function(){
            let touches_bottom = false;
            for (let i = 0; i < this.blocks.length; i += 1){
                let item = this.blocks[i];
                let temp = item.touches_bottom();
                if (temp === true){
                    touches_bottom = true;
                    break;
                }
            }
            return touches_bottom;
        }
        this.move_down = function () {
            let touches_bottom = this.touches_bottom();
            if (touches_bottom === false){
                this.blocks.forEach(block => {
                    block.move_down();
                });
                touches_bottom = this.touches_bottom();
                if(touches_bottom === true){
                    field.deactivate_piece();
                }
            }
            
        }
        this.move_right = function () {
            let touches_right = false;
            for (let i = 0; i < this.blocks.length; i += 1){
                let item = this.blocks[i];
                let temp = item.touches_right();
                if (temp === true){
                    touches_right = true;
                    break;
                }
            }
            if (touches_right === false){
                this.blocks.forEach(block => {
                    block.move_right();
                })
            }
        }
        this.move_left = function () {
            let touches_left = false;
            for (let i = 0; i < this.blocks.length; i += 1){
                let item = this.blocks[i];
                let temp = item.touches_left();
                if (temp === true){
                    touches_left = true;
                    break;
                }
            }
            if (touches_left === false){
                this.blocks.forEach(block => {
                    block.move_left();
                })
            }
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

            this.left += field.block_width;
            this.right += field.block_width;

        }
        this.move_left = function () {

            this.left -= field.block_width;
            this.right -= field.block_width;

        }
        this.move_down = function () {

            this.top += field.block_height;
            this.bottom += field.block_height;

        }
        this.touches_right = function () {
            if(this.right === field.x_blocks * field.block_width){
                return true;
            }
            else{
                return false;
            }
        }
        this.touches_left = function(){
            if(this.left === 0){
                return true;
            }
            else{
                return false;
            }
        }
        this.touches_bottom = function(){
            if(this.bottom === field.y_blocks * field.block_height){
                return true;
            }
            else{
                return false;
            }
        }
        this.touches_other_piece_bottom = function(piece){
            let other_piece_blocks = piece.blocks;
            for (let i = 0; i < other_piece_blocks.length; i += 1){
                let other_block = other_piece_blocks[i];
                if (this.bottom === other_block.top){
                    return true;
                }
            }
            return false;
        }
        
    }
}

function reset_input_arr() {
    for (let i = 0; i < input_arr.length; i += 1) {
        input_arr[i] = 0;
    }
}

function process_input_on_current_block() {
    
    if (input_arr[0] === 1) {
        field.current_piece.move_left();
    }
    if (input_arr[1] === 1) {
        field.current_piece.move_right();
    }
    if (input_arr[2] === 1) {
        field.current_piece.move_down();
    }

}

function process_frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    process_input_on_current_block();
    reset_input_arr();
    field.draw();



    
}


