"use strict";
document.addEventListener("DOMContentLoaded", function(ev){
    init();
});

let canvas;
let ctx;
let field;
let frame_timer;
let frame_interval = 16.6;
let test;
function init(){
    canvas = document.querySelector("#main_canvas");
    ctx = canvas.getContext("2d");
    field = new game_field(15, 20);
    frame_timer = setInterval(function(){process_frame()}, frame_interval);
    test = new game_block("hsl(120, 60%, 50%)", 40, 40);
}




// game_field class
class game_field{
    //width in blocks and height in block
    constructor(width, height){

        this.block_width = canvas.width / width;
        this.block_height = canvas.height / height;
        this.gravity = 1;
        this.pieces = [];
        this.draw = function(){
            alert("draw works");
        }
        this.add_piece = function(piece){
            this.pieces.push(piece);
        }
    }
}
/*
Patterns:

    1:           2:           3:             4:             5:
                
    *           * *          * *              *             *
    *           * *            * *          * * *           *
    *                                                       *    
    *                                                     * *





*/

class game_piece{
    constructor(pattern){
        this.blocks = [];
    }
}

class game_block{
    constructor(fill_color, x, y){
        this.fill_color = fill_color;
        this.top = y;
        this.left = x;
        this.right = x + field.block_width;
        this.bottom = y + field.block_height;
        this.draw = function(){
            ctx.beginPath();
            ctx.fillStyle = "hsl(0,0%,20%)"
            ctx.fillRect(this.left, this.top, this.right, this.bottom);
            ctx.clearRect(this.left + 3, this.top + 3, this.right - 6, this.bottom - 6);
            ctx.fillStyle = this.fill_color;
            ctx.fillRect(this.left + 3, this.top + 3, this.right - 6, this.bottom - 6);
        }
    }
}


function process_frame(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    test.top += 2;
    //test.bottom += 1;
    test.draw();
}

