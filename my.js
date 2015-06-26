/**
 * Created by zky-android on 2015/6/26.
 */
//行数
var TETRIS_ROWS = 20;
//列数
var TETRIS_COLS = 20;
//每一个方块的宽、高
var CELL_SIZE = 24;

// 记录当前积分
var curScore = 0;
// 记录当前速度
var curSpeed = 1;
// 记录曾经的最高积分
var maxScore = 0;

// 记录当前是否游戏中的旗标
var isPlaying = true;

//画布
var tetris_canvas;
//画布2D对象
var tetris_ctx;

window.onload = function()
{
    // 创建canvas组件
    createCanvas(TETRIS_ROWS , TETRIS_COLS , CELL_SIZE , CELL_SIZE);
    document.body.appendChild(tetris_canvas);
};

var createCanvas = function (rows, cols, cellWidth, cellHeight) {
    tetris_canvas = document.createElement("canvas");
    tetris_canvas.width = cols * cellWidth;
    tetris_canvas.height = rows * cellHeight;
    tetris_canvas.style.border = "1px solid black";

    tetris_ctx = tetris_canvas.getContext("2d");
    tetris_ctx.beginPath();

    for (var i = 0; i < rows; i++) {
        tetris_ctx.moveTo(0, i * cellHeight);
        tetris_ctx.lineTo(cols * cellWidth, i * cellHeight);
    }

    // 绘制竖向网络对应的路径
    for (var i = 0; i < cols; i++) {
        tetris_ctx.moveTo(i * cellWidth, 0);
        tetris_ctx.lineTo(i * cellWidth, rows * cellHeight);
    }

    tetris_ctx.closePath();
    // 设置笔触颜色
    tetris_ctx.strokeStyle = "#aaa";
    // 设置线条粗细
    tetris_ctx.lineWidth = 0.3;
    // 绘制线条
    tetris_ctx.stroke();
};