document.addEventListener('DOMContentLoaded', () => {
    // 获取画布和上下文
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    
    // 游戏配置
    const gridSize = 20; // 网格大小
    const tileCount = canvas.width / gridSize; // 网格数量
    
    // 游戏状态
    let gameRunning = false;
    let gameOver = false;
    let score = 0;
    let speed = 7; // 游戏速度
    
    // 蛇的初始位置和速度
    let snake = [
        { x: 5, y: 5 }
    ];
    let velocityX = 0;
    let velocityY = 0;
    
    // 食物位置
    let foodX = 10;
    let foodY = 10;
    
    // 获取DOM元素
    const scoreElement = document.getElementById('score');
    const startButton = document.getElementById('start-btn');
    const restartButton = document.getElementById('restart-btn');
    
    // 开始游戏按钮
    startButton.addEventListener('click', () => {
        if (!gameRunning && !gameOver) {
            gameRunning = true;
            gameLoop();
        }
    });
    
    // 重新开始按钮
    restartButton.addEventListener('click', resetGame);
    
    // 键盘控制
    document.addEventListener('keydown', (e) => {
        if (!gameRunning) return;
        
        // 防止蛇反向移动（不能直接掉头）
        switch(e.key) {
            case 'ArrowUp':
                if (velocityY !== 1) {
                    velocityX = 0;
                    velocityY = -1;
                }
                break;
            case 'ArrowDown':
                if (velocityY !== -1) {
                    velocityX = 0;
                    velocityY = 1;
                }
                break;
            case 'ArrowLeft':
                if (velocityX !== 1) {
                    velocityX = -1;
                    velocityY = 0;
                }
                break;
            case 'ArrowRight':
                if (velocityX !== -1) {
                    velocityX = 1;
                    velocityY = 0;
                }
                break;
        }
    });
    
    // 游戏主循环
    function gameLoop() {
        if (!gameRunning) return;
        
        setTimeout(() => {
            clearCanvas();
            moveSnake();
            checkCollision();
            drawFood();
            drawSnake();
            
            if (!gameOver) {
                gameLoop();
            }
        }, 1000 / speed);
    }
    
    // 清除画布
    function clearCanvas() {
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // 绘制蛇
    function drawSnake() {
        ctx.fillStyle = '#4CAF50';
        
        // 绘制蛇身
        snake.forEach((segment, index) => {
            if (index === 0) {
                // 蛇头
                ctx.fillStyle = '#388E3C';
            } else {
                // 蛇身
                ctx.fillStyle = '#4CAF50';
            }
            
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
            
            // 绘制蛇眼睛（如果是蛇头）
            if (index === 0) {
                ctx.fillStyle = 'white';
                
                // 根据移动方向绘制眼睛
                if (velocityX === 1) { // 向右
                    ctx.fillRect(segment.x * gridSize + gridSize - 7, segment.y * gridSize + 4, 3, 3);
                    ctx.fillRect(segment.x * gridSize + gridSize - 7, segment.y * gridSize + gridSize - 7, 3, 3);
                } else if (velocityX === -1) { // 向左
                    ctx.fillRect(segment.x * gridSize + 4, segment.y * gridSize + 4, 3, 3);
                    ctx.fillRect(segment.x * gridSize + 4, segment.y * gridSize + gridSize - 7, 3, 3);
                } else if (velocityY === -1) { // 向上
                    ctx.fillRect(segment.x * gridSize + 4, segment.y * gridSize + 4, 3, 3);
                    ctx.fillRect(segment.x * gridSize + gridSize - 7, segment.y * gridSize + 4, 3, 3);
                } else if (velocityY === 1) { // 向下
                    ctx.fillRect(segment.x * gridSize + 4, segment.y * gridSize + gridSize - 7, 3, 3);
                    ctx.fillRect(segment.x * gridSize + gridSize - 7, segment.y * gridSize + gridSize - 7, 3, 3);
                } else { // 初始状态
                    ctx.fillRect(segment.x * gridSize + gridSize - 7, segment.y * gridSize + 4, 3, 3);
                    ctx.fillRect(segment.x * gridSize + gridSize - 7, segment.y * gridSize + gridSize - 7, 3, 3);
                }
            }
        });
    }
    
    // 移动蛇
    function moveSnake() {
        if (velocityX === 0 && velocityY === 0) return;
        
        // 创建新的蛇头
        const head = { 
            x: snake[0].x + velocityX, 
            y: snake[0].y + velocityY 
        };
        
        // 将新蛇头添加到蛇身前面
        snake.unshift(head);
        
        // 检查是否吃到食物
        if (head.x === foodX && head.y === foodY) {
            // 增加分数
            score += 10;
            scoreElement.textContent = score;
            
            // 每得100分增加速度
            if (score % 100 === 0) {
                speed += 1;
            }
            
            // 生成新的食物
            generateFood();
        } else {
            // 如果没有吃到食物，移除蛇尾
            snake.pop();
        }
    }
    
    // 绘制食物
    function drawFood() {
        ctx.fillStyle = '#FF5722';
        ctx.fillRect(foodX * gridSize, foodY * gridSize, gridSize - 2, gridSize - 2);
        
        // 添加一点装饰，让食物看起来像苹果
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(foodX * gridSize + gridSize / 2 - 1, foodY * gridSize - 3, 2, 4);
    }
    
    // 生成新的食物
    function generateFood() {
        // 随机生成食物位置
        let newFoodPosition = false;
        
        while (!newFoodPosition) {
            foodX = Math.floor(Math.random() * tileCount);
            foodY = Math.floor(Math.random() * tileCount);
            
            // 确保食物不会出现在蛇身上
            newFoodPosition = true;
            for (let i = 0; i < snake.length; i++) {
                if (snake[i].x === foodX && snake[i].y === foodY) {
                    newFoodPosition = false;
                    break;
                }
            }
        }
    }
    
    // 检查碰撞
    function checkCollision() {
        const head = snake[0];
        
        // 检查是否撞墙
        if (head.x < 0 || head.y < 0 || head.x >= tileCount || head.y >= tileCount) {
            gameOver = true;
            gameRunning = false;
            showGameOver();
            return;
        }
        
        // 检查是否撞到自己
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver = true;
                gameRunning = false;
                showGameOver();
                return;
            }
        }
    }
    
    // 显示游戏结束
    function showGameOver() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'white';
        ctx.font = '30px Microsoft YaHei';
        ctx.textAlign = 'center';
        ctx.fillText('游戏结束!', canvas.width / 2, canvas.height / 2 - 20);
        
        ctx.font = '20px Microsoft YaHei';
        ctx.fillText(`最终得分: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
    }
    
    // 重置游戏
    function resetGame() {
        // 重置游戏状态
        gameRunning = false;
        gameOver = false;
        score = 0;
        speed = 7;
        
        // 重置蛇
        snake = [{ x: 5, y: 5 }];
        velocityX = 0;
        velocityY = 0;
        
        // 重置食物
        generateFood();
        
        // 更新分数显示
        scoreElement.textContent = score;
        
        // 清除画布
        clearCanvas();
        drawSnake();
        drawFood();
    }
    
    // 初始化游戏
    clearCanvas();
    drawSnake();
    drawFood();
}); 