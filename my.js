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

// 没方块是0
var NO_BLOCK = 0;

// 该数组用于记录底下已经固定下来的方块。
var tetris_status = [];
for (var i = 0; i < TETRIS_ROWS; i++) {
    tetris_status[i] = [];
    for (var j = 0; j < TETRIS_COLS; j++) {
        tetris_status[i][j] = NO_BLOCK;
    }
}

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
    document.body.appendChild(tetris_canvas);
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
function drawBlock() {
    for (var i = 0; i < TETRIS_ROWS; i++) {
        for (var j = 0; j < TETRIS_COLS; j++) {
            if (tetris_status[i][j] == NO_BLOCK) {
                // 没有方块的地方绘制白色
                tetris_ctx.fillStyle = 'white';
                // 绘制矩形
                tetris_ctx.fillRect(j * CELL_SIZE + 1
                    , i * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
            }
            else {
                // 设置填充颜色
                tetris_ctx.fillStyle = colors[tetris_status[i][j]];
                // 绘制矩形
                tetris_ctx.fillRect(j * CELL_SIZE + 1
                    , i * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
            }
        }
    }
}
window.onload = function () {
    addCanvas();
    initView();
    initData();
    initBlock();
    drawBlock();
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

//向下移动
var moveDown = function () {
    // 定义能否下掉的旗标
    var canDown = true;

    for (var i = 0; i < currentFall.length; i++) {
        // 判断是否已经到“最底下”
        if (currentFall[i].y >= TETRIS_ROWS - 1) {
            canDown = false;
            break;
        }

        // 判断下一格是否“有方块”, 如果下一格有方块，不能向下掉
        if (tetris_status[currentFall[i].y + 1][currentFall[i].x] != NO_BLOCK) {
            canDown = false;
            break;
        }
    }

    if (canDown) {
        // 将下移前的每个方块的背景色涂成白色
        for (var i = 0; i < currentFall.length; i++) {
            var cur = currentFall[i];
            // 没有方块的地方绘制白色
            tetris_ctx.fillStyle = 'white';
            // 绘制矩形
            tetris_ctx.fillRect(cur.x * CELL_SIZE + 1
                , cur.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);

            // 遍历每个方块, 控制每个方块的y坐标加1。
            // 也就是控制方块都下掉一格
            cur.y++;
        }

        // 将下移后的每个方块的背景色涂成该方块的颜色值
        for (var i = 0; i < currentFall.length; i++) {
            var cur = currentFall[i];
            // 设置填充颜色
            tetris_ctx.fillStyle = colors[cur.color];
            // 绘制矩形
            tetris_ctx.fillRect(cur.x * CELL_SIZE + 1
                , cur.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
        }
    }
    else {
        for (var i = 0; i < currentFall.length; i++) {
            var cur = currentFall[i];
            if (cur.y < 2)//是否输了
            {
                // 清空Local Storage中的当前积分值、游戏状态、当前速度
                localStorage.removeItem("curScore");
                localStorage.removeItem("tetris_status");
                localStorage.removeItem("curSpeed");
                isPlaying = false;
                if (confirm("您已经输了！是否参数排名？")) {
                    // 读取Local Storage里的maxScore记录
                    maxScore = localStorage.getItem("maxScore");
                    maxScore = maxScore == null ? 0 : maxScore;
                    // 如果当前积分大于localStorage中记录的最高积分
                    if (curScore >= maxScore) {
                        // 记录最高积分
                        localStorage.setItem("maxScore", curScore);
                    }
                }
                return;
            } else {
                // 把每个方块当前所在位置赋为当前方块的颜色值
                tetris_status[cur.y][cur.x] = cur.color;
            }
        }

        // 判断是否有“可消除”的行
        lineFull();
        // 使用Local Storage记录俄罗斯方块的游戏状态
        localStorage.setItem("tetris_status", JSON.stringify(tetris_status));
        // 开始一组新的方块。
        initBlock();
    }
};

var lineFull = function () {
    for (var i = 0; i < TETRIS_ROWS; i++) {
        var flag = true;
        for (var j = 0; j < TETRIS_COLS; j++) {
            if (tetris_status[i][j] == NO_BLOCK) {
                flag = false;
                break;
            }
        }

        // 如果当前行已全部有方块了
        if (flag) {
            // 把当前行的所有方块下移一行。
            for (var k = i; k > 0; k--) {
                for (var l = 0; l < TETRIS_COLS; l++) {
                    tetris_status[k][l] = tetris_status[k - 1][l];
                }
            }
            // 消除方块后，重新绘制一遍方块
            drawBlock();      //②
        }
    }
};

window.onkeydown = function (evt) {
    switch (evt.keyCode) {
        // 按下了“向下”箭头
        case 40:
            if (!isPlaying)
                return;
            moveDown();
            break;
    }
}