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

window.onload = function()
{
    // ����canvas���
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