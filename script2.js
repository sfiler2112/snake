console.log('work, you dog!');

// Phase determines how fast the worm is moving and how many points are rewarded for food consumption.  The phase is set by surpassing certain point-collection milestones, like reaching 10,000 points.  
const PhaseState = Object.freeze({
    phaseI: "PHASE I",
    phaseII: "PHASE II",
    phaseIII: "PHASE III",
    phaseIV: "PHASE IV"
});

// WORM CONTROLLER
var wormController = (function() {
    
    var wormHead, bodySegments, hitWallBool, hitBodyBool, lastMove; 
    
    wormHead = {
        x_position: 150, 
        y_position: 285, 
        direction: "LEFT", 
        previous_x_pos: -1, 
        previous_y_pos: -1
    };
    
    bodySegments = [];
    
    function generateNewSegment(precedingSegment) {
        var newSegment = {
            preceding_segment: precedingSegment,
            x_position: precedingSegment.x_position,
            y_position: precedingSegment.y_position,
            previous_x_pos: precedingSegment.previous_x_pos,
            previous_y_pos: precedingSegment.previous_y_pos
        }
        return newSegment;
    }
    
    return {
        getWormHead: function() {
            return wormHead;
        }, 
        getBodySegments: function() {
            return bodySegments
        },
        addWormSegment: function () {
            var new_segment
            if(bodySegments.length > 0) {
                bodySegments.push(generateNewSegment(bodySegments[bodySegments.length - 1]));
            } else {
                bodySegments.push(generateNewSegment(wormHead));
            }
        }
    }
    
})();


// FOOD CONTROLLER
var foodController = (function() {
    
})();


// UI CONTROLLER
var uiController = (function() {
    
})();


// GAME CONTROLLER
var gameController = (function(wormCtrl) {
    var test_function = function() {
        console.log(wormCtrl.getWormHead().x_position);
    };
    
    return {
        init: function() {
            test_function();
        }
    }
})(wormController);


gameController.init();
















































const canvas = document.getElementById("canvas")
const canvas_context = canvas.getContext('2d')
// Phases determine the worm update speed and points per food collision.  Phase I is the slowest with the fewest points, Phase IV is the fastest with the most points per food collision.
//const PhaseState = Object.freeze({
//    phaseI: "PHASE I",
//    phaseII: "PHASE II",
//    phaseIII: "PHASE III",
//    phaseIV: "PHASE IV"
//});
var food_x_position, food_y_position, points, points_per_food, worm, frame_count, total_frames, frame_update_value, current_phase;

function init() {
    
    food_x_position = 150;
    food_y_position = 150;
    points = 0;
    points_per_food = 1000;
    worm = new worm();
    frame_count = 0;
    total_frames = 0;
    frame_update_value = 30; // The number of frames counted before the worm updates it's position.  This value will decrease at intervals of points earned.
    current_phase = PhaseState.phaseI;
    document.addEventListener("keydown", keyPressAction);
    
    window.requestAnimationFrame(drawScene);
}

function worm() {
    this.worm_head = new wormHead(), this.body_segments = [], this.hit_wall = false, this.hit_body = false, this.last_move = "";
}

function wormSegment(preceding_segment) {
    this.preceding_segment = preceding_segment,
    this.x_position = preceding_segment.x_position,
    this.y_position = preceding_segment.y_position,
    this.previous_x_pos = preceding_segment.previous_x_pos,
    this.previous_y_pos = preceding_segment.previous_y_pos;
}

function wormHead() {
    this.x_position = 150, 
    this.y_position = 285, 
    this.direction = "LEFT", 
    this.previous_x_pos = -1, 
    this.previous_y_pos = -1;
}

function addWormSegment() {
    var new_segment;
    if(worm.body_segments.length > 0) {
        new_segment = new wormSegment(worm.body_segments[worm.body_segments.length - 1])
    } else {
        new_segment = new wormSegment(worm.worm_head)
    }
    worm.body_segments.push(new_segment)
}

function updateWorm() {
    var current_x_pos, current_y_pos;
    current_x_pos = worm.worm_head.x_position;
    current_y_pos = worm.worm_head.y_position;
    worm.worm_head.previous_x_pos = current_x_pos;
    worm.worm_head.previous_y_pos = current_y_pos;
    
    switch(worm.worm_head.direction) {
        case "RIGHT": 
            if(current_x_pos < 285) {
                worm.worm_head.x_position = current_x_pos + 15;
                worm.last_move = "RIGHT";
            } else {
                worm.worm_head.x_position = 285;
                worm.hit_wall = true;
            }
            break;
        case "LEFT":
            if(current_x_pos > 0) {
                worm.worm_head.x_position = current_x_pos - 15;
                worm.last_move = "LEFT";
            } else {
                worm.worm_head.x_position = 0;
                worm.hit_wall = true;
            }
            break;
        case "UP":
            if(current_y_pos > 0) {
                worm.worm_head.y_position = current_y_pos - 15;
                worm.last_move = "UP";
            } else {
                worm.worm_head.y_position = 0; 
                worm.hit_wall = true;
            }
            break;
        case "DOWN": 
            if(current_y_pos < 285) {
                worm.worm_head.y_position = current_y_pos + 15;
                worm.last_move = "DOWN";
            } else {
                worm.worm_head.y_position = 285;
                worm.hit_wall = true;
            }
            break;
        default:
            break;
    }
    
    worm.body_segments.forEach(function(item, index, array) {
        item.previous_x_pos = item.x_position;
        item.previous_y_pos = item.y_position;
        item.x_position = item.preceding_segment.previous_x_pos;
        item.y_position = item.preceding_segment.previous_y_pos;
    })
    
    if(bodyCollisionCheck(worm.worm_head.x_position, worm.worm_head.y_position)) {
        console.log("hit a body segment! x, y: " + worm.worm_head.x_position + ", " + worm.worm_head.y_position)
        worm.hit_body = true;
    }
    
    if(foodCollisionCheck(worm.worm_head.x_position, worm.worm_head.y_position)) {
        randomizeFoodPosition();
        points += points_per_food;
        console.log("points: " + points);
        document.getElementById("points-display").textContent = "POINTS: " + points;
        addWormSegment();
    } 
        
    
}
 


function bodyCollisionCheck(x_position, y_position) {
    var collision_detected = false;
     worm.body_segments.forEach(function(segment){
         var shared_x, shared_y
         shared_x = false;
         shared_y = false;
         
         if(segment.x_position === x_position) {
             shared_x = true;
         }
         if(segment.y_position === y_position) {
             shared_y = true;
         }
         
         if(shared_x && shared_y) {
             console.log("something hitting body! x, y: " + segment.x_position + ", " + segment.y_position)
             collision_detected = true;
             return;
         }

    });
    if(collision_detected) {
        return true;
    } else {
        return false;
    }
//    if(worm.hit_body) {
//        return true;
//    } else {
//        return false;
//    }
}

function foodCollisionCheck(x_position, y_position) {
    if(x_position === food_x_position && y_position === food_y_position) {
        return true;
    } else {
        return false;
    }
}



function randomizeFoodPosition() {
    var random_x, random_y;
    
    random_x = Math.floor(Math.random() * 19);
    random_y = Math.floor(Math.random() * 19);
    
    food_x_position = random_x * 15;
    food_y_position = random_y * 15;
    
    // Check to make sure the food wasn't randomized on a tile already occupied by the worm head or one of its segments.
    if(foodCollisionCheck(worm.worm_head.x_position, worm.worm_head.y_position) || bodyCollisionCheck(food_x_position, food_y_position)) {
        console.log("bad randomized food position!");
        randomizeFoodPosition();
    } else {
        console.log("successfully randomized food position");
    }
                                
}

function drawFood() {
    canvas_context.fillStyle = 'green';
    canvas_context.fillRect(food_x_position, food_y_position, 15, 15);
}

function drawWorm() {
    canvas_context.fillStyle = 'black';
    canvas_context.fillRect(worm.worm_head.x_position, worm.worm_head.y_position, 15, 15);
    canvas_context.fillStyle = 'blue';
    worm.body_segments.forEach(function(segment) {
        canvas_context.fillRect(segment.x_position, segment.y_position, 15, 15);
    })
}

// Each tile is 15x15 pixels.  The scene is made up of 20x20 tiles.  
function drawScene() {
    canvas_context.fillStyle = 'antiquewhite';
    canvas_context.fillRect(0, 0, 300, 300);
    drawFood();
    frame_count += 1;
    total_frames += 1;
    
    if(points >= 10000 && current_phase === PhaseState.phaseI) {
        console.log("changing to phase II!")
        current_phase = PhaseState.phaseII;
        
    } else if (points >= 25000 && current_phase === PhaseState.phaseII) {
        console.log("changing to phase III!")
        current_phase = PhaseState.phaseIII
        
    } else if (points >= 50000 && current_phase === PhaseState.phaseIII) {
        console.log("changing to phase IV!")
        current_phase = PhaseState.phaseIV
    }
    
    switch(current_phase) {
        case PhaseState.phaseI:
            frame_update_value = 30;
            points_per_food = 1000;
            break;
        case PhaseState.phaseII:
            frame_update_value = 20;
            points_per_food = 1500;
            break;
        case PhaseState.phaseIII:
            frame_update_value = 15;
            points_per_food = 2500;
            break;
        case PhaseState.phaseIV:
            frame_update_value = 10;
            points_per_food = 5000;
            break;
        default:
            break;
    }
    
    if(frame_count === frame_update_value) {
        frame_count = 0;
        updateWorm();
    }
    
    if(worm.hit_wall) {
        console.log("hit the wall! x, y: " + worm.worm_head.x_position + ", " + worm.worm_head.y_position);
        console.log(total_frames);
        console.log("you ruined everything!");
        window.requestAnimationFrame(drawGameOver);
        
    } else if (worm.hit_body){
        console.log(total_frames);
        console.log("you hit yourself!?");
        window.requestAnimationFrame(drawGameOver);
        
    } else {
        drawWorm();
        window.requestAnimationFrame(drawScene);
    }    
}

function drawGameOver() {
    canvas_context.fillStyle = 'red';
    canvas_context.fillRect(0, 0, 300, 300);
}

function keyPressAction(event){
    if (event.defaultPrevented) {
        return;
    }
    
    console.log("worms key press: " + event.key.toLowerCase());
    
    switch(event.key.toLowerCase()) {
        case 'a':
            if(worm.last_move != "RIGHT") {
                worm.worm_head.direction = "LEFT";
            }
            break;
        case 'w':
            if(worm.last_move != "DOWN") {
                worm.worm_head.direction = "UP";
            }
            break;
        case 's':
            if(worm.last_move != "UP") {
                worm.worm_head.direction = "DOWN";
            }
            break;
        case 'd':
            if(worm.last_move != "LEFT") {
                worm.worm_head.direction = "RIGHT";
            }
            break;
        default:
            break;
    }
}

init();
