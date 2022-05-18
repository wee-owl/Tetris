import { SIZE_BLOCK, COLUMNS, ROWS } from "../index.js";

export class View {
    constructor (container) {
        this.container = container;

        this.preview();
    }

    colors = {
        J: 'RoyalBlue',
        I: 'Red',
        O: 'Yellow',
        L: 'Coral',
        2: 'LawnGreen',
        T: 'Aqua',
        S: 'Fuchsia',
    };
    
    canvas = document.createElement('canvas');
    context = this.canvas.getContext('2d');

    preview() {
        this.container.innerHTML = '';
        const preview = document.createElement('div');
        preview.classList.add("out-glass");
        preview.innerHTML = '<p>Нажми "ENTER" <br> чтобы начать игру</p>';
        preview.style.cssText = `
            margin-top: 10%;
            font-size: 18px;
            text-align: center;
            padding: 50px;
            grid-column: 1 / 3;
        `;

        this.container.append(preview);
    }

    gameOver() {
        this.container.textContent = '';
        const gameOver = document.createElement('div');
        gameOver.classList.add("out-glass");
        gameOver.innerHTML = '<h2>Game Over</h2><br><p>Нажми "ENTER" <br> чтобы заново начать игру</p>';
        gameOver.style.cssText = `
            margin-top: 10%;
            font-size: 18px;
            text-align: center;
            padding: 50px;
            grid-column: 1 / 3;
        `;

        this.container.append(gameOver);
    }

    init() {
        this.container.textContent = '';
        this.canvas.style.gridArea = 'game';
        this.canvas.classList.add('game-area');
        this.canvas.classList.add('out-glass');
        this.container.append(this.canvas);
        this.canvas.width = SIZE_BLOCK * COLUMNS;
        this.canvas.height = SIZE_BLOCK * ROWS;
    }
    
    createBlockScore() {
        const scoreBlock = document.createElement('div');
        scoreBlock.classList.add("out-glass");
        scoreBlock.style.cssText = `
            font-size: 18px;
            text-align: center;
            padding: 20px;
            grid-area: score;
            margin-top: 47%;
        `;

        const linesElem = document.createElement('p');
        const scoreElem = document.createElement('p');
        const levelElem = document.createElement('p');
        const recordElem = document.createElement('p');

        scoreBlock.append(linesElem, scoreElem, levelElem, recordElem);

        this.container.append(scoreBlock);

        return (lines, score, level, record) => {
            linesElem.textContent = `линия: ${lines}`;
            scoreElem.textContent = `очки: ${score}`;
            levelElem.textContent = `уровень: ${level}`;
            recordElem.textContent = `рекорд: ${record}`;
        }
    }

    createBlockNextTetromino() {
        const tetrominoBlock = document.createElement('div');
        tetrominoBlock.classList.add("out-glass");
        tetrominoBlock.style.cssText = `
            width: ${SIZE_BLOCK * 4}px;
            height: ${SIZE_BLOCK * 4}px;
            padding: 20px;
            grid-area: next;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        tetrominoBlock.append(canvas);

        this.container.append(tetrominoBlock);

        return (tetromino) => {
            canvas.width = SIZE_BLOCK * tetromino.length;
            canvas.height = SIZE_BLOCK * tetromino.length;
            context.clearRect(0, 0, canvas.width, canvas.height);
    
            for (let y = 0; y < tetromino.length; y++) {
                const line = tetromino[y];
        
                for (let x = 0; x < line.length; x++) {
                    const block = line[x];
                    if (block !== 'o') {
                        context.fillStyle = this.colors[block];
                        roundRect(context, x * SIZE_BLOCK, y * SIZE_BLOCK, SIZE_BLOCK, SIZE_BLOCK, 5, true);
                    }
                }
            }
        }
    }

    showArea(area) {
        const context = this.canvas.getContext('2d');

        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        for (let y = 0; y < area.length; y++) {
            const line = area[y];
    
            for (let x = 0; x < line.length; x++) {
                const block = line[x];
                if (block !== 'o') {
                    context.fillStyle = this.colors[block];
                    roundRect(context, x * SIZE_BLOCK, y * SIZE_BLOCK, SIZE_BLOCK, SIZE_BLOCK, 5, true);
                    context.shadowColor = 'rgba(0, 0, 0, 0.4)';
                    context.shadowBlur = 10;
                    context.shadowOffsetX = 5;
                    context.shadowOffsetY = 5;
                }
            }
        }
    };
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke === 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
        var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}
