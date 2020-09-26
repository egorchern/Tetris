"use strict";
document.addEventListener("DOMContentLoaded", function(ev){
    init();
});

let canvas;
let ctx;
let field;
function init(){
    canvas = document.querySelector("#main_canvas");
    ctx = canvas.getContext("2d");
    field = new game_field(10, 20);
}

let frame_interval = 41.6;


// game_field class
class game_field{
    //width in blocks and height in block
    constructor(width, height){

        this.block_width = canvas.width / width;
        this.block_height = canvas.height / height;
    }
}
class game_piece{
    constructor(pattern){
        
    }
}

function process_frame(){

}

