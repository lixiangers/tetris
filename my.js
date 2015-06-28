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

//数据对应的html元素
var curScoreEle, curSpeedEle, maxScoreEle;

// 记录当前积分
var curScore = 0;
// 记录当前速度
var curSpeed = 1;
// 记录曾经的最高积分
var maxScore = 0;

// 该数组用于记录底下已经固定下来的方块。
var tetris_status = [];

// 记录正在下掉的四个方块
var currentFall;

// 定义方块的颜色
colors = ["#fff", "#f00", "#0f0", "#00f"
    , "#c60", "#f0f", "#0ff", "#609"];

// 定义几种可能出现的方块组合
var blockArr = [
    // 代表第一种可能出现的方块组合：Z
    [
        {x: TETRIS_COLS / 2 - 1, y: 0, color: 1},
        {x: TETRIS_COLS / 2, y: 0, color: 1},
        {x: TETRIS_COLS / 2, y: 1, color: 1},
        {x: TETRIS_COLS / 2 + 1, y: 1, color: 1}
    ],
    // 代表第二种可能出现的方块组合：反Z
    [
        {x: TETRIS_COLS / 2 + 1, y: 0, color: 2},
        {x: TETRIS_COLS / 2, y: 0, color: 2},
        {x: TETRIS_COLS / 2, y: 1, color: 2},
        {x: TETRIS_COLS / 2 - 1, y: 1, color: 2}
    ],
    // 代表第三种可能出现的方块组合： 田
    [
        {x: TETRIS_COLS / 2 - 1, y: 0, color: 3},
        {x: TETRIS_COLS / 2, y: 0, color: 3},
        {x: TETRIS_COLS / 2 - 1, y: 1, color: 3},
        {x: TETRIS_COLS / 2, y: 1, color: 3}
    ],
    // 代表第四种可能出现的方块组合：L
    [
        {x: TETRIS_COLS / 2 - 1, y: 0, color: 4},
        {x: TETRIS_COLS / 2 - 1, y: 1, color: 4},
        {x: TETRIS_COLS / 2 - 1, y: 2, color: 4},
        {x: TETRIS_COLS / 2, y: 2, color: 4}
    ],
    // 代表第五种可能出现的方块组合：J
    [
        {x: TETRIS_COLS / 2, y: 0, color: 5},
        {x: TETRIS_COLS / 2, y: 1, color: 5},
        {x: TETRIS_COLS / 2, y: 2, color: 5},
        {x: TETRIS_COLS / 2 - 1, y: 2, color: 5}
    ],
    // 代表第六种可能出现的方块组合 : 条
    [
        {x: TETRIS_COLS / 2, y: 0, color: 6},
        {x: TETRIS_COLS / 2, y: 1, color: 6},
        {x: TETRIS_COLS / 2, y: 2, color: 6},
        {x: TETRIS_COLS / 2, y: 3, color: 6}
    ],
    // 代表第七种可能出现的方块组合 : ┵
    [
        {x: TETRIS_COLS / 2, y: 0, color: 7},
        {x: TETRIS_COLS / 2 - 1, y: 1, color: 7},
        {x: TETRIS_COLS / 2, y: 1, color: 7},
        {x: TETRIS_COLS / 2 + 1, y: 1, color: 7}
    ]
];


function initView() {
    curScoreEle = document.getElementById("curSpeedEle");
    curSpeedEle = document.getElementById("curScoreEle");
    maxScoreEle = document.getElementById("maxScoreEle");
}
function initData() {
// 读取Local Storage里的curScore记录
    curScore = localStorage.getItem("curScore");
    curScore = curScore == null ? 0 : parseInt(curScore);
    curScoreEle.innerHTML = curScore;

    // 读取Local Storage里的maxScore记录
    maxScore = localStorage.getItem("maxScore");
    maxScore = maxScore == null ? 0 : parseInt(maxScore);
    maxScoreEle.innerHTML = maxScore;

    // 读取Local Storage里的curSpeed记录
    curSpeed = localStorage.getItem("curSpeed");
    curSpeed = curSpeed == null ? 1 : parseInt(curSpeed);
    curSpeedEle.innerHTML = curSpeed;

    // 读取Local Storage里的tetris_status记录
    var tmpStatus = localStorage.getItem("tetris_status");
    tetris_status = tmpStatus == null ? tetris_status : JSON.parse(tmpStatus);
}
function addCanvas() {
// 创建canvas组件
    createCanvas(TETRIS_ROWS, TETRIS_COLS, CELL_SIZE, CELL_SIZE);
    document.body.appendtChild(tetris_canvas);
}
var initBlock = function () {
    var rand = Math.floor(Math.random() * blockArr.length);
    currentFall = [
        {
            x: blockArr[rand][0].x, y: blockArr[rand][0].y
            , color: blockArr[rand][0].color
        },
        {
            x: blockArr[rand][1].x, y: blockArr[rand][1].y
            , color: blockArr[rand][1].color
        },
        {
            x: blockArr[rand][2].x, y: blockArr[rand][2].y
            , color: blockArr[rand][2].color
        },
        {
            x: blockArr[rand][3].x, y: blockArr[rand][3].y
            , color: blockArr[rand][3].color
        }
    ];
};
window.onload = function () {
    addCanvas();
    initView();
    initData();
    initBlock();
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