"use strict";


/*
TODO
LOSE CONDITIONS
MOBILE COMPATIBILITY
HOLD PIECE FUNCTIONALITY
*/


// 10 x 20
document.addEventListener("DOMContentLoaded", function (ev) {
    init();
});

let canvas, ctx, field, frame_timer, gravity_timer, second_canvas, second_ctx, menu;

let frame_interval = 16.6;
let gravity_interval = 900;
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
/*
Patterns:

   1: (Blue)  2:(Yellow)   3:(Green)       4:(Red)       5:(Purple)             
                
    *           * *          * *              *             *
    *           * *            * *          * * *           *
    *                                                       *    
    *                                                     * *
    
*/
let shapes = {
    1: [
        [1],
        [1],
        [1],
        [1]
    ],
    2: [
        [1, 1],
        [1, 1]
    ],
    3: [
        [1, 1, 0],
        [0, 1, 1]
    ],
    4: [
        [0, 1, 0],
        [1, 1, 1]
    ],
    5: [
        [0, 1],
        [0, 1],
        [0, 1],
        [1, 1]
    ]
}
let shape_color = {
    1: "blue",
    2: "yellow",
    3: "green",
    4: "red",
    5: "purple"
}

//gives random integer between min(inclusive) and max(inclusive)
function get_random_int(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rotate_array_clockwise(arr) {
    let local_arr = arr;
    let new_arr = [];
    let old_row_length = local_arr[0].length;
    let old_column_length = local_arr.length;
    for (let i = 0; i < old_row_length; i += 1) {
        let new_row = [];
        for (let j = 0; j < old_column_length; j += 1) {
            new_row.push(0);
        }
        new_arr.push(new_row);
    }



    for (let i = local_arr.length - 1; i >= 0; i -= 1) {
        let row = local_arr[i];
        for (let j = 0; j < row.length; j += 1) {
            new_arr[j][local_arr.length - 1 - i] = row[j];
        }
    }
    return new_arr;


}


function init() {
    
    second_canvas = document.querySelector("#secondary_canvas");
    second_ctx = second_canvas.getContext("2d");
    
    canvas = document.querySelector("#main_canvas");
    ctx = canvas.getContext("2d");
    field = new game_field(10, 20);
    
    frame_timer = setInterval(function () {
        process_frame()
    }, frame_interval);
    bind_input();

    gravity_timer = setInterval(function () {
        field.current_piece.move_down();
    }, gravity_interval);
    menu = new side_menu();
    field.generate_pieces_queue();
    
    field.generate_new_current_piece();
    
    field.draw();
    
    //menu.draw();


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
class side_menu{
    constructor(){
        this.score = 0;
        this.pieces_x_offset = 40;
        this.pieces_y_offset = 20;
        this.increase_score_by = function (amount){
            this.score += amount;
            
        }
        this.draw = function (){
            second_ctx.restore();
            second_ctx.clearRect(0, 0, second_canvas.width, second_canvas.height);
            second_ctx.font = "35px serif";
            second_ctx.fillText("Next:", 25, 29);
            second_ctx.fillText(`Score: ${this.score}`, 25, second_canvas.height * 0.9, 125);
            let y_counter = 75;
            field.pieces_queue.forEach(num => {
                let piece = new game_piece(num, this.pieces_x_offset, y_counter, true);
                let height = piece.get_vertical_height();
                y_counter += height + this.pieces_y_offset;
                piece.draw();

            })
        }
    }
}

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
        this.pieces_queue = [];
        this.pause = function () {
            clearInterval(gravity_timer);
        }
        this.resume = function () {
            gravity_timer = setInterval(function () {
                field.current_piece.move_down();
            }, gravity_interval);
        }
        this.generate_pieces_queue = function () {
            while (this.pieces_queue.length < 4) {


                let num = get_random_int(1, Object.keys(shapes).length);
                while (this.pieces_queue.includes(num) === true) {
                    num = get_random_int(1, Object.keys(shapes).length);
                }
                this.pieces_queue.push(num);
                
            }
        }
        this.clear_empty_pieces = function (pieces) {
            let some_deleted;
            do{
                some_deleted = false;
                for(let i = 0; i < pieces.length; i += 1){
                    if(pieces[i].blocks.length === 0){
                        pieces.splice(i, 1);
                        some_deleted = true;
                        break;
                    }
                }
            }
            while(some_deleted === true)
            return pieces;
        }
        this.clear_horizontal_lines = function () {
            let pieces = this.pieces;
            let times_cleared = 0;
            let re_run_loop = false;
            do {

                let some_found = false;
                for (let i = this.y_blocks * this.block_height; i >= 0; i -= this.block_height) {
                    let horizontal_block_count = 0;
                    let pieces_above_indecis = [];
                    let blocks_above_indecis = [];
                    let pieces_indecis = [];
                    let block_indecis = [];
                    for (let j = 0; j < pieces.length; j += 1) {
                        let scoped_piece = pieces[j];
                        for (let k = 0; k < scoped_piece.blocks.length; k += 1) {
                            let scoped_block = scoped_piece.blocks[k];
                            if (scoped_block.bottom === i) {
                                horizontal_block_count += 1;
                                pieces_indecis.push(j);
                                block_indecis.push(k);
                            } else if (scoped_block.bottom < i) {
                                pieces_above_indecis.push(j);
                                blocks_above_indecis.push(k);
                            }
                        }
                    }
                    if (horizontal_block_count === this.x_blocks) {

                        times_cleared += 1;
                        for (let j = 0; j < pieces_indecis.length; j += 1) {
                            
                            pieces[pieces_indecis[j]].delete_block(block_indecis[j]);
                            for (let k = 0; k < pieces_indecis.length; k += 1) {
                                if (pieces_indecis[k] === pieces_indecis[j]) {

                                    block_indecis[k] -= 1;

                                }
                            }
                        }
                        
                        for (let j = 0; j < pieces_above_indecis.length; j += 1) {
                            
                            
                            pieces[pieces_above_indecis[j]].blocks[blocks_above_indecis[j]].top += this.block_height;
                            pieces[pieces_above_indecis[j]].blocks[blocks_above_indecis[j]].bottom += this.block_height;
                            
                           
                            
                            



                        }
                        let run_again;
                        do{
                            run_again = false;
                            for(let j = 0; j < pieces_above_indecis.length; j += 1){
                                let touches_bottom = pieces[pieces_above_indecis[j]].touches_bottom();
                                let touches_other_piece_bottom = pieces[pieces_above_indecis[j]].touches_other_piece_bottom(pieces, pieces_above_indecis[j]);
                                
                                if(touches_bottom === false && touches_other_piece_bottom === false){
                                    run_again = true;
                                    
                                    pieces[pieces_above_indecis[j]].blocks.forEach(block => {
                                        block.move_down();
                                    })
                                    break;
                                }
                            }
                        }
                        while(run_again === true);

                        some_found = true;
                        break;

                    }


                }
                re_run_loop = some_found;
            }
            while (re_run_loop === true)

            





            menu.increase_score_by(times_cleared);
            
            pieces = this.clear_empty_pieces(pieces);
            this.pieces = pieces;
        }
        this.generate_new_current_piece = function () {
            let num = this.pieces_queue[0];
            this.pieces_queue.splice(0, 1);
            
            this.current_piece = new game_piece(num);
            menu.draw();
        }
        this.deactivate_piece = function () {

            this.pieces.push(this.current_piece);
            this.generate_pieces_queue();
            this.clear_horizontal_lines();
            //menu.draw();
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



class game_piece {
    // pattern num from shapes dictionary
    constructor(pattern_num, x = 0, y = 0, secondary = false) {
        this.blocks = [];
        this.pattern = shapes[pattern_num];
        this.color = colors[shape_color[pattern_num]];
        this.start_x = x;
        this.start_y = y;

        this.initialize_pattern = function () {
            if (this.blocks.length != 0) {
                let least_x = Infinity;
                let least_y = Infinity;
                this.blocks.forEach(block => {
                    if (block.left < least_x) {
                        least_x = block.left;
                    }
                    if (block.top < least_y) {
                        least_y = block.top;
                    }
                });
                while (least_x + this.pattern[0].length * field.block_width > canvas.width) {
                    least_x -= field.block_width;
                }
                while (least_y + this.pattern.length * field.block_height > canvas.height) {
                    least_y -= field.block_height;
                }


                this.start_x = least_x;
                this.start_y = least_y;
            }
            this.blocks = [];
            let start_x = this.start_x;
            let start_y = this.start_y;
            for (let i = 0; i < this.pattern.length; i += 1) {

                let row = this.pattern[i];
                for (let j = 0; j < row.length; j += 1) {
                    let data = row[j];
                    if (data != 1) {

                        start_x += field.block_width;
                    } else {
                        let block = new game_block(this.color, start_x, start_y, secondary);
                        this.blocks.push(block);
                        start_x += field.block_width;
                    }

                }
                start_x = this.start_x;
                start_y += field.block_height;
            }
            //this.start_y = start_y;
        }
        this.initialize_pattern_test = function (pattern) {
            let imaginary_blocks = [];
            let start_x = this.start_x;
            let start_y = this.start_y;
            if (this.blocks.length != 0) {
                let least_x = Infinity;
                let least_y = Infinity;
                this.blocks.forEach(block => {
                    if (block.left < least_x) {
                        least_x = block.left;
                    }
                    if (block.top < least_y) {
                        least_y = block.top;
                    }
                });
                while (least_x + pattern[0].length * field.block_width > canvas.width) {
                    least_x -= field.block_width;
                }
                while (least_y + pattern.length * field.block_height > canvas.height) {
                    least_y -= field.block_height;
                }


                start_x = least_x;
                start_y = least_y;
            }


            for (let i = 0; i < pattern.length; i += 1) {

                let row = pattern[i];
                for (let j = 0; j < row.length; j += 1) {
                    let data = row[j];
                    if (data != 1) {

                        start_x += field.block_width;
                    } else {
                        let block = new game_block(this.color, start_x, start_y);
                        imaginary_blocks.push(block);
                        start_x += field.block_width;
                    }

                }
                start_x = this.start_x;
                start_y += field.block_height;
            }
            return imaginary_blocks;

        }
        this.get_vertical_height = function(){
            let smallest_top = Infinity;
            let biggest_bottom = -Infinity;
            this.blocks.forEach(block => {
                if(block.top < smallest_top){
                    smallest_top = block.top;

                }
                if(block.bottom > biggest_bottom){
                    biggest_bottom = block.bottom;
                }
            })
            return biggest_bottom - smallest_top;
        }
        this.delete_block = function (index) {
            this.blocks.splice(index, 1);
        }
        this.rotate_clockwise = function () {
            let new_pattern = rotate_array_clockwise(this.pattern);

            let imaginary_blocks = this.initialize_pattern_test(new_pattern);
            let other_pieces = field.pieces;
            let inside_of_another = false;
            for (let i = 0; i < other_pieces.length; i += 1) {
                let other_piece = other_pieces[i];
                for (let j = 0; j < imaginary_blocks.length; j += 1) {
                    let cur_block = imaginary_blocks[j];
                    if (cur_block.inside_of_another_piece(other_piece) === true) {
                        inside_of_another = true;
                        break;
                    }
                }
                if (inside_of_another === true) {
                    break;
                }
            }
            if (inside_of_another === false) {
                this.pattern = new_pattern;

                this.initialize_pattern();
            }


        }
        this.initialize_pattern();
        this.draw = function () {
            this.blocks.forEach(function (block) {
                block.draw();
            })
        };
        this.touches_other_piece_bottom = function (pieces, excluded = -1) {
            for (let i = 0; i < pieces.length; i += 1) {
                if(excluded === i){
                    continue;
                }
                let other_piece = pieces[i];
                for (let j = 0; j < this.blocks.length; j += 1) {
                    if (this.blocks[j].touches_other_piece_bottom(other_piece) === true) {
                        
                        return true;
                    }
                }

            }
            return false;
        }
        this.touches_other_piece_right = function () {
            for (let i = 0; i < field.pieces.length; i += 1) {
                let other_piece = field.pieces[i];
                for (let j = 0; j < this.blocks.length; j += 1) {
                    if (this.blocks[j].touches_other_piece_right(other_piece) === true) {
                        return true;
                    }
                }

            }
            return false;
        }
        this.touches_other_piece_left = function () {
            for (let i = 0; i < field.pieces.length; i += 1) {
                let other_piece = field.pieces[i];
                for (let j = 0; j < this.blocks.length; j += 1) {
                    if (this.blocks[j].touches_other_piece_left(other_piece) === true) {
                        return true;
                    }
                }

            }
            return false;
        }

        this.touches_bottom = function () {
            let touches_bottom = false;
            for (let i = 0; i < this.blocks.length; i += 1) {
                let item = this.blocks[i];
                let temp = item.touches_bottom();
                if (temp === true) {
                    touches_bottom = true;
                    break;
                }
            }
            return touches_bottom;
        }
        this.move_down = function () {
            let touches_bottom = this.touches_bottom();
            let touches_other_piece_bottom = this.touches_other_piece_bottom(field.pieces);
            if (touches_bottom === false && touches_other_piece_bottom === false) {
                this.blocks.forEach(block => {
                    block.move_down();
                });
                touches_bottom = this.touches_bottom();
                touches_other_piece_bottom = this.touches_other_piece_bottom(field.pieces);
                if (touches_bottom === true || touches_other_piece_bottom === true) {
                    field.deactivate_piece();
                }
            } else if (touches_bottom === false || touches_other_piece_bottom === false) {
                field.deactivate_piece();
            }

        }
        this.move_right = function () {
            let touches_right = false;
            let touches_other_piece_right = this.touches_other_piece_right();
            for (let i = 0; i < this.blocks.length; i += 1) {
                let item = this.blocks[i];
                let temp = item.touches_right();
                if (temp === true) {
                    touches_right = true;
                    break;
                }
            }
            if (touches_right === false && touches_other_piece_right === false) {

                this.blocks.forEach(block => {
                    block.move_right();
                })
            }
        }
        this.move_left = function () {
            let touches_left = false;
            let touches_other_piece_left = this.touches_other_piece_left();
            for (let i = 0; i < this.blocks.length; i += 1) {
                let item = this.blocks[i];
                let temp = item.touches_left();
                if (temp === true) {
                    touches_left = true;
                    break;
                }
            }
            if (touches_left === false && touches_other_piece_left === false) {
                this.blocks.forEach(block => {
                    block.move_left();
                })
            }
        }


    }
}

class game_block {
    constructor(fill_color, x, y, secondary = false) {
        this.fill_color = fill_color;
        this.top = y;
        this.left = x;
        this.right = x + field.block_width;
        this.bottom = y + field.block_height;

        this.draw = function () {
            
            if(secondary === false){
                ctx.beginPath();
                ctx.fillStyle = "hsl(0,0%,20%)";
                ctx.fillRect(this.left, this.top, field.block_width, field.block_height);
                ctx.clearRect(this.left + block_padding, this.top + block_padding, field.block_width - block_padding * 2, field.block_height - block_padding * 2);
                ctx.fillStyle = this.fill_color;
                ctx.fillRect(this.left + block_padding, this.top + block_padding, field.block_width - block_padding * 2, field.block_height - block_padding * 2);
            }
            else{
                second_ctx.save();
                second_ctx.beginPath();
                second_ctx.fillStyle = "hsl(0,0%,20%)";
                second_ctx.fillRect(this.left, this.top, field.block_width, field.block_height);
                second_ctx.clearRect(this.left + block_padding, this.top + block_padding, field.block_width - block_padding * 2, field.block_height - block_padding * 2);
                second_ctx.fillStyle = this.fill_color;
                second_ctx.fillRect(this.left + block_padding, this.top + block_padding, field.block_width - block_padding * 2, field.block_height - block_padding * 2);
                second_ctx.restore();
            }
            
            
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
            if (this.right === field.x_blocks * field.block_width) {
                return true;
            } else {
                return false;
            }
        }
        this.touches_left = function () {
            if (this.left === 0) {
                return true;
            } else {
                return false;
            }
        }
        this.touches_bottom = function () {
            if (this.bottom === field.y_blocks * field.block_height) {
                return true;
            } else {
                return false;
            }
        }
        this.touches_other_piece_bottom = function (piece) {
            let other_piece_blocks = piece.blocks;
            for (let i = 0; i < other_piece_blocks.length; i += 1) {
                let other_block = other_piece_blocks[i];
                if (this.bottom === other_block.top && this.left === other_block.left && this.right === other_block.right) {
                    return true;
                }
            }
            return false;
        }
        this.touches_other_piece_right = function (piece) {
            let other_piece_blocks = piece.blocks;
            for (let i = 0; i < other_piece_blocks.length; i += 1) {
                let other_block = other_piece_blocks[i];
                if (this.right === other_block.left && this.top === other_block.top && this.bottom === other_block.bottom) {
                    return true;
                }
            }
            return false;
        }
        this.touches_other_piece_left = function (piece) {
            let other_piece_blocks = piece.blocks;
            for (let i = 0; i < other_piece_blocks.length; i += 1) {
                let other_block = other_piece_blocks[i];
                if (this.left === other_block.right && this.top === other_block.top && this.bottom === other_block.bottom) {
                    return true;
                }
            }
            return false;
        }
        this.inside_of_another_piece = function (piece) {
            let other_piece_blocks = piece.blocks;
            for (let i = 0; i < other_piece_blocks.length; i += 1) {
                let other_block = other_piece_blocks[i];
                if (this.top === other_block.top && this.left === other_block.left && this.right === other_block.right && this.bottom === other_block.bottom) {
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
    if (input_arr[3] === 1) {
        field.current_piece.rotate_clockwise();
    }

}

function process_frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    process_input_on_current_block();
    reset_input_arr();
    field.draw();




}