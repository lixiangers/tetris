/**
 * Created by zky-android on 2015/6/26.
 */
//����
var TETRIS_ROWS = 20;
//����
var TETRIS_COLS = 20;
//ÿһ������Ŀ���
var CELL_SIZE = 24;

// ��¼��ǰ����
var curScore = 0;
// ��¼��ǰ�ٶ�
var curSpeed = 1;
// ��¼��������߻���
var maxScore = 0;

// ��¼��ǰ�Ƿ���Ϸ�е����
var isPlaying = true;

//����
var tetris_canvas;
//����2D����
var tetris_ctx;

//���ݶ�Ӧ��htmlԪ��
var curScoreEle, curSpeedEle, maxScoreEle;

// ��¼��ǰ����
var curScore = 0;
// ��¼��ǰ�ٶ�
var curSpeed = 1;
// ��¼��������߻���
var maxScore = 0;

// û������0
var NO_BLOCK = 0;

// ���������ڼ�¼�����Ѿ��̶������ķ��顣
var tetris_status = [];


// ��¼�����µ����ĸ�����
var currentFall;


// ���巽�����ɫ
colors = ["#fff", "#f00", "#0f0", "#00f"
    , "#c60", "#f0f", "#0ff", "#609"];

// ���弸�ֿ��ܳ��ֵķ������
var blockArr = [
    // �����һ�ֿ��ܳ��ֵķ�����ϣ�Z
    [
        {x: TETRIS_COLS / 2 - 1, y: 0, color: 1},
        {x: TETRIS_COLS / 2, y: 0, color: 1},
        {x: TETRIS_COLS / 2, y: 1, color: 1},
        {x: TETRIS_COLS / 2 + 1, y: 1, color: 1}
    ],
    // ����ڶ��ֿ��ܳ��ֵķ�����ϣ���Z
    [
        {x: TETRIS_COLS / 2 + 1, y: 0, color: 2},
        {x: TETRIS_COLS / 2, y: 0, color: 2},
        {x: TETRIS_COLS / 2, y: 1, color: 2},
        {x: TETRIS_COLS / 2 - 1, y: 1, color: 2}
    ],
    // ��������ֿ��ܳ��ֵķ�����ϣ� ��
    [
        {x: TETRIS_COLS / 2 - 1, y: 0, color: 3},
        {x: TETRIS_COLS / 2, y: 0, color: 3},
        {x: TETRIS_COLS / 2 - 1, y: 1, color: 3},
        {x: TETRIS_COLS / 2, y: 1, color: 3}
    ],
    // ��������ֿ��ܳ��ֵķ�����ϣ�L
    [
        {x: TETRIS_COLS / 2 - 1, y: 0, color: 4},
        {x: TETRIS_COLS / 2 - 1, y: 1, color: 4},
        {x: TETRIS_COLS / 2 - 1, y: 2, color: 4},
        {x: TETRIS_COLS / 2, y: 2, color: 4}
    ],
    // ��������ֿ��ܳ��ֵķ�����ϣ�J
    [
        {x: TETRIS_COLS / 2, y: 0, color: 5},
        {x: TETRIS_COLS / 2, y: 1, color: 5},
        {x: TETRIS_COLS / 2, y: 2, color: 5},
        {x: TETRIS_COLS / 2 - 1, y: 2, color: 5}
    ],
    // ��������ֿ��ܳ��ֵķ������ : ��
    [
        {x: TETRIS_COLS / 2, y: 0, color: 6},
        {x: TETRIS_COLS / 2, y: 1, color: 6},
        {x: TETRIS_COLS / 2, y: 2, color: 6},
        {x: TETRIS_COLS / 2, y: 3, color: 6}
    ],
    // ��������ֿ��ܳ��ֵķ������ : ��
    [
        {x: TETRIS_COLS / 2, y: 0, color: 7},
        {x: TETRIS_COLS / 2 - 1, y: 1, color: 7},
        {x: TETRIS_COLS / 2, y: 1, color: 7},
        {x: TETRIS_COLS / 2 + 1, y: 1, color: 7}
    ]
];

//执行向下timer
var curTimer;


function initView() {
    curScoreEle = document.getElementById("curSpeedEle");
    curSpeedEle = document.getElementById("curScoreEle");
    maxScoreEle = document.getElementById("maxScoreEle");
}
function initData() {
// ��ȡLocal Storage���curScore��¼
    curScore = localStorage.getItem("curScore");
    curScore = curScore == null ? 0 : parseInt(curScore);
    curScoreEle.innerHTML = curScore;

    // ��ȡLocal Storage���maxScore��¼
    maxScore = localStorage.getItem("maxScore");
    maxScore = maxScore == null ? 0 : parseInt(maxScore);
    maxScoreEle.innerHTML = maxScore;

    // ��ȡLocal Storage���curSpeed��¼
    curSpeed = localStorage.getItem("curSpeed");
    curSpeed = curSpeed == null ? 1 : parseInt(curSpeed);
    curSpeedEle.innerHTML = curSpeed;

    //Ĭ��ÿ������û��
    for (var i = 0; i < TETRIS_ROWS; i++) {
        tetris_status[i] = [];
        for (var j = 0; j < TETRIS_COLS; j++) {
            tetris_status[i][j] = NO_BLOCK;
        }
    }

    // ��ȡLocal Storage���tetris_status��¼
    var tmpStatus = localStorage.getItem("tetris_status");
    tetris_status = tmpStatus == null ? tetris_status : JSON.parse(tmpStatus);
}
function addCanvas() {
// ����canvas���
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
                // û�з���ĵط����ư�ɫ
                tetris_ctx.fillStyle = 'white';
                // ���ƾ���
                tetris_ctx.fillRect(j * CELL_SIZE + 1
                    , i * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
            }
            else {
                // ���������ɫ
                tetris_ctx.fillStyle = colors[tetris_status[i][j]];
                // ���ƾ���
                tetris_ctx.fillRect(j * CELL_SIZE + 1
                    , i * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
            }
        }
    }
}
function startTimer() {
    curTimer = setInterval("moveDown()", 500 / curSpeed);
}
window.onload = function () {
    addCanvas();
    initView();
    initData();
    initBlock();
    drawBlock();
    startTimer();
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

    // �������������Ӧ��·��
    for (var i = 0; i < cols; i++) {
        tetris_ctx.moveTo(i * cellWidth, 0);
        tetris_ctx.lineTo(i * cellWidth, rows * cellHeight);
    }

    tetris_ctx.closePath();
    // ���ñʴ���ɫ
    tetris_ctx.strokeStyle = "#aaa";
    // ����������ϸ
    tetris_ctx.lineWidth = 0.3;
    // ��������
    tetris_ctx.stroke();
};


window.onkeydown = function (evt) {
    switch (evt.keyCode) {
        // �����ˡ����¡���ͷ
        case 40:
            if (!isPlaying)
                return;
            moveDown();
            break;
    }
};

//�����ƶ�
var moveDown = function () {
    // �����ܷ��µ������
    var canDown = true;

    for (var i = 0; i < currentFall.length; i++) {
        // �ж��Ƿ��Ѿ���������¡�
        if (currentFall[i].y >= TETRIS_ROWS - 1) {
            canDown = false;
            break;
        }

        // �ж���һ���Ƿ��з��顱, �����һ���з��飬�������µ�
        if (tetris_status[currentFall[i].y + 1][currentFall[i].x] != NO_BLOCK) {
            canDown = false;
            break;
        }
    }

    if (canDown) {
        // ������ǰ��ÿ������ı���ɫͿ�ɰ�ɫ
        for (var i = 0; i < currentFall.length; i++) {
            var cur = currentFall[i];
            // û�з���ĵط����ư�ɫ
            tetris_ctx.fillStyle = 'white';
            // ���ƾ���
            tetris_ctx.fillRect(cur.x * CELL_SIZE + 1
                , cur.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);

            // ����ÿ������, ����ÿ�������y�����1��
            // Ҳ���ǿ��Ʒ��鶼�µ�һ��
            cur.y++;
        }

        // �����ƺ��ÿ������ı���ɫͿ�ɸ÷������ɫֵ
        for (var i = 0; i < currentFall.length; i++) {
            var cur = currentFall[i];
            // ���������ɫ
            tetris_ctx.fillStyle = colors[cur.color];
            // ���ƾ���
            tetris_ctx.fillRect(cur.x * CELL_SIZE + 1
                , cur.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
        }
    }
    else {
        for (var i = 0; i < currentFall.length; i++) {
            var cur = currentFall[i];
            if (cur.y < 2)//�Ƿ�����
            {
                // ���Local Storage�еĵ�ǰ����ֵ����Ϸ״̬����ǰ�ٶ�
                localStorage.removeItem("curScore");
                localStorage.removeItem("tetris_status");
                localStorage.removeItem("curSpeed");
                clearInterval(curTimer);
                isPlaying = false;
                if (confirm("���Ѿ����ˣ��Ƿ����������")) {
                    // ��ȡLocal Storage���maxScore��¼
                    maxScore = localStorage.getItem("maxScore");
                    maxScore = maxScore == null ? 0 : maxScore;
                    // �����ǰ���ִ���localStorage�м�¼����߻���
                    if (curScore >= maxScore) {
                        // ��¼��߻���
                        localStorage.setItem("maxScore", curScore);
                    }
                }
                return;
            } else {
                // ��ÿ�����鵱ǰ����λ�ø�Ϊ��ǰ�������ɫֵ
                tetris_status[cur.y][cur.x] = cur.color;
            }
        }

        // �ж��Ƿ��С�������������
        lineFull();
        // ʹ��Local Storage��¼����˹�������Ϸ״̬
        localStorage.setItem("tetris_status", JSON.stringify(tetris_status));
        //ԭ����һ�鵽�׺� ��ʼһ���µķ��顣
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

        // �����ǰ����ȫ���з�����
        if (flag) {
            // ����ǰ��������100
            curScoreEle.innerHTML = curScore += 100;
            // ��¼��ǰ����
            localStorage.setItem("curScore", curScore);

            // �ѵ�ǰ�е����з�������һ�С�
            for (var k = i; k > 0; k--) {
                for (var l = 0; l < TETRIS_COLS; l++) {
                    tetris_status[k][l] = tetris_status[k - 1][l];
                }
            }
            // ������������»���һ�鷽��
            drawBlock();      //��
        }
    }
};

window.onkeydown = function (evt) {
    switch (evt.keyCode) {
        // �����ˡ����¡���ͷ
        case 40:
            if (!isPlaying)
                return;
            moveDown();
            break;
        // �����ˡ����󡱼�ͷ
        case 37:
            if (!isPlaying)
                return;
            moveLeft();
            break;
        // �����ˡ����ҡ���ͷ
        case 39:
            if (!isPlaying)
                return;
            moveRight();
            break;
        // 按下了“向上”箭头
        case 38:
            if (!isPlaying)
                return;
            rotate();
            break;
    }
};

var moveLeft = function () {
    var canLeft = true;
    for (var i = 0; i < currentFall.length; i++) {
        var cur = currentFall[i];
        if (cur.x <= 0) {
            canLeft = false;
            break;
        }

        if (tetris_status[cur.y][cur.x - 1] != NO_BLOCK) {
            canLeft = false;
            break;
        }
    }

    if (canLeft) {
        for (var i = 0; i < currentFall.length; i++) {
            var cur = currentFall[i];
            tetris_ctx.fillStyle = "white";
            tetris_ctx.fillRect(cur.x * CELL_SIZE + 1, cur.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);

            cur.x--;
        }

        for (var i = 0; i < currentFall.length; i++) {
            var cur = currentFall[i];
            tetris_ctx.fillStyle = colors[cur.color];
            tetris_ctx.fillRect(cur.x * CELL_SIZE + 1, cur.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
        }
    }
};


var moveRight = function () {
    var canRight = true;
    for (var i = 0; i < currentFall.length; i++) {
        var cur = currentFall[i];
        if (cur.x >= TETRIS_COLS - 1) {
            canRight = false;
            break;
        }

        if (tetris_status[cur.y][cur.x + 1] != NO_BLOCK) {
            canRight = false;
            break;
        }
    }

    if (canRight) {
        for (var i = 0; i < currentFall.length; i++) {
            var cur = currentFall[i];
            tetris_ctx.fillStyle = "white";
            tetris_ctx.fillRect(cur.x * CELL_SIZE + 1, cur.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);

            cur.x++;
        }

        for (var i = 0; i < currentFall.length; i++) {
            var cur = currentFall[i];
            tetris_ctx.fillStyle = colors[cur.color];
            tetris_ctx.fillRect(cur.x * CELL_SIZE + 1, cur.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
        }
    }
};

// 定义旋转方块的函数
var rotate = function () {
    // 定义记录能否旋转的旗标
    var canRotate = true;
    for (var i = 0; i < currentFall.length; i++) {
        var preX = currentFall[i].x;
        var preY = currentFall[i].y;
        // 始终以第三个方块作为旋转的中心,
        // i == 2时，说明是旋转的中心
        if (i != 2) {
            // 计算方块旋转后的x、y坐标
            var afterRotateX = currentFall[2].x + preY - currentFall[2].y;
            var afterRotateY = currentFall[2].y + currentFall[2].x - preX;
            // 如果旋转后所在位置已有方块，表明不能旋转
            if (tetris_status[afterRotateY][afterRotateX + 1] != NO_BLOCK) {
                canRotate = false;
                break;
            }
            // 如果旋转后的坐标已经超出了最左边边界
            if (afterRotateX < 0 || tetris_status[afterRotateY - 1][afterRotateX] != NO_BLOCK) {
                moveRight();
                afterRotateX = currentFall[2].x + preY - currentFall[2].y;
                afterRotateY = currentFall[2].y + currentFall[2].x - preX;
                break;
            }
            if (afterRotateX < 0 || tetris_status[afterRotateY - 1][afterRotateX] != NO_BLOCK) {
                moveRight();
                break;
            }
            // 如果旋转后的坐标已经超出了最右边边界
            if (afterRotateX >= TETRIS_COLS - 1 ||
                tetris_status[afterRotateY][afterRotateX + 1] != NO_BLOCK) {
                moveLeft();
                afterRotateX = currentFall[2].x + preY - currentFall[2].y;
                afterRotateY = currentFall[2].y + currentFall[2].x - preX;
                break;
            }
            if (afterRotateX >= TETRIS_COLS - 1 ||
                tetris_status[afterRotateY][afterRotateX + 1] != NO_BLOCK) {
                moveLeft();
                break;
            }
        }
    }
    // 如果能旋转
    if (canRotate) {
        // 将旋转移前的每个方块的背景色涂成白色
        for (var i = 0; i < currentFall.length; i++) {
            var cur = currentFall[i];
            // 设置填充颜色
            tetris_ctx.fillStyle = 'white';
            // 绘制矩形
            tetris_ctx.fillRect(cur.x * CELL_SIZE + 1
                , cur.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
        }
        for (var i = 0; i < currentFall.length; i++) {
            var preX = currentFall[i].x;
            var preY = currentFall[i].y;
            // 始终以第三个方块作为旋转的中心,
            // i == 2时，说明是旋转的中心
            if (i != 2) {
                currentFall[i].x = currentFall[2].x +
                    preY - currentFall[2].y;
                currentFall[i].y = currentFall[2].y +
                    currentFall[2].x - preX;
            }
        }
        // 将旋转后的每个方块的背景色涂成各方块对应的颜色
        for (var i = 0; i < currentFall.length; i++) {
            var cur = currentFall[i];
            // 设置填充颜色
            tetris_ctx.fillStyle = colors[cur.color];
            // 绘制矩形
            tetris_ctx.fillRect(cur.x * CELL_SIZE + 1
                , cur.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
        }
    }
};