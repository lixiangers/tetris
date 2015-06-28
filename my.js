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

    // ��ȡLocal Storage���tetris_status��¼
    var tmpStatus = localStorage.getItem("tetris_status");
    tetris_status = tmpStatus == null ? tetris_status : JSON.parse(tmpStatus);
}
function addCanvas() {
// ����canvas���
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