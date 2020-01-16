let player1, player2;
let PlayerMove;
let Matrix;

function Player(name, mode, crossOrZero) 
{
    this.Name = name;
    this.Mode = mode;
    this.Wins = 0;
    this.CrossOrZero = crossOrZero;
}

function getRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min)) + min;
}

function displayMove() 
{
    if(PlayerMove == 1)
        document.getElementById("plm1").textContent = "Ход игрока " + player1.Name;
    else
        document.getElementById("plm1").textContent = "Ход игрока " + player2.Name;
}

function UpdateInfo() 
{
    document.getElementById("plw1").textContent = player1.Wins;
    document.getElementById("plw2").textContent = player2.Wins;
    if(player1.CrossOrZero) {
            document.getElementById("plt1").textContent = "Крестики";
            document.getElementById("plt2").textContent = "Нолики";
    } else 
    {
        document.getElementById("plt1").textContent = "Нолики";
        document.getElementById("plt2").textContent = "Крестики";
    }
}

function ChangeDataPlayers() 
{
    player1.Name = document.getElementById("pl1").value;
    player2.Name = document.getElementById("pl2").value;
    player1.CrossOrZero = Boolean(document.getElementById("gm2").value);
    player2.CrossOrZero = !Boolean(document.getElementById("gm2").value);
    player2.Mode = document.getElementById("gm1").value;
    UpdateInfo();
    NewGame();
}

function DrawCross(context) 
{
    context.strokeStyle = "black";
    context.fillStyle = "red";
    context.beginPath();

    context.moveTo(85, 0);
    context.lineTo(150, 68);
    context.lineTo(215, 0);
    context.lineTo(225, 10);

    context.lineTo(157, 75);
    context.lineTo(225, 140);
    context.lineTo(215, 150);
    context.lineTo(150, 82);

    context.lineTo(85, 150);
    context.lineTo(75, 140);
    context.lineTo(147, 75);
    context.lineTo(75, 10);

    context.lineTo(85, 0);

    context.closePath();
    context.stroke();
    context.fill();
}

function DrawZero(context) 
{
    context.strokeStyle = "black";
    context.fillStyle = "purple";
    context.beginPath();

    context.arc(150,75,75,0,Math.PI*2,true);

    context.closePath();
    context.stroke();
    context.fill();
    
    context.fillStyle = "aqua";
    context.beginPath();
    context.arc(150,75,60,0,Math.PI*2,true);
    context.closePath();
    context.fill();   
}

function OnClickCanvas(id) 
{
    if(Matrix == undefined)
            return;

    let num = parseInt(id) - 1;
    let i = parseInt(num/3);
    let j = num%3;

    if(Matrix[i][j] == 0) 
    {
        if(PlayerMove == 1) {
            if(player1.CrossOrZero == true)
                DrawCross(document.getElementById(id).getContext('2d'));
            else
                DrawZero(document.getElementById(id).getContext('2d'));

            Matrix[i][j] = 1;
        }
        else if(PlayerMove == 2 && player2.Mode == "Human"){
            if(player2.CrossOrZero == true)
                DrawCross(document.getElementById(id).getContext('2d'));
            else
                DrawZero(document.getElementById(id).getContext('2d'));

            Matrix[i][j] = 2;
        }
        
        let winner = CheckWin();
        if(winner != -1) 
        {
            if(winner == 1) 
            {
                player1.Wins++;
                alert("Победил игрок " + player1.Name);
            }
            else if(winner == 2) 
            {
                player2.Wins++;
                alert("Победил игрок " + player2.Name);
            }
            UpdateInfo();
            NewGame();
            return;
        }else if(CheckPat()) 
        {
            alert("Победила дружба!");
            UpdateInfo();
            NewGame();
            return;
        }

        PlayerMove = PlayerMove == 1 ? 2 : 1;
        displayMove();
        if(PlayerMove == 2 && player2.Mode == "AI") 
        {
            MoveAI();
            PlayerMove = PlayerMove == 1 ? 2 : 1;
            displayMove();
            winner = CheckWin();
        if(winner != -1) 
        {
            if(winner == 1) 
            {
                player1.Wins++;
                alert("Победил игрок " + player1.Name);
            }
            else if(winner == 2) 
            {
                player2.Wins++;
                alert("Победил игрок " + player2.Name);
            }
            
            UpdateInfo();
            NewGame();
            return;
        } else if(CheckPat()) 
        {
            alert("Победила дружба!");
            UpdateInfo();
            NewGame();
            return;
        }

        }
            
    }

}

function CheckWin() 
{
    if(Matrix == undefined)
             return -1;

    for(let i = 0; i < 3; i++) 
    {
        if(Matrix[i][0] > 0 && Matrix[i][0] == Matrix[i][1] && Matrix[i][1] == Matrix[i][2] && Matrix[i][0] == Matrix[i][2] ) 
        {
            return Matrix[i][0];
        }
        if(Matrix[0][i] > 0 && Matrix[0][i] == Matrix[1][i] && Matrix[1][i] == Matrix[2][i] && Matrix[0][i] == Matrix[2][i]) 
        {
            return Matrix[0][i];
        }
    } 
    if(Matrix[1][1] > 0 && (Matrix[0][0] == Matrix[1][1] && Matrix[1][1] == Matrix[2][2] && Matrix[0][0] == Matrix[2][2] ||
        Matrix[2][0] == Matrix[1][1] && Matrix[1][1] == Matrix[0][2] && Matrix[2][0] == Matrix[0][2])) 
        {
            return Matrix[1][1];
        }
        return -1;
}

function CheckPat() 
{
    for(let i = 0; i < 3; i++) 
    {
        for(let j = 0; j < 3; j++) 
        {
            if(Matrix[i][j] == 0) 
                return false;
        }
    }
    return true;
}

function ClearField() 
{
    for(let i = 0; i < 9; i++) 
    {
        document.getElementById(i + 1 + "canvas").getContext('2d').clearRect(0, 0, 300, 150);
    }
}

function NewGame() 
{
    if(Matrix == undefined)
        InitGame();

    ClearField();

    for(let i = 0; i < 3; i++) 
    {
        for (let j = 0; j < 3; j++) 
        {
            Matrix[i][j] = 0;
        }
    }

    PlayerMove = getRandomInt(1, 3);
    displayMove();
    UpdateInfo();

    if(PlayerMove == 2 && player2.Mode == "AI") 
        {
            MoveAI();
            PlayerMove = PlayerMove == 1 ? 2 : 1;
            displayMove();
    }

}

function InitGame() 
{
    player1 = new Player(document.getElementById("pl1").value, "Human", Boolean(document.getElementById("gm2").value));
    player2 = new Player(document.getElementById("pl2").value, document.getElementById("gm1").value, !Boolean(document.getElementById("gm2").value));
    Matrix = new Array();
    Matrix[0] = new Array();
    Matrix[1] = new Array();
    Matrix[2] = new Array();
}


function MoveAI() 
{
    let winX = -1, winY = -1;
    let enemyX = -1, enemyY = -1;
    let freeX = -1, freeY = -1;

    for(let i = 0; i < 3; i++) 
    {
        if(Matrix[i][0] == 2 && Matrix[i][1] == 2 && Matrix[i][2] == 0) {
            winX = i;
            winY = 2;
        }
        else if(Matrix[i][1] == 2 && Matrix[i][2] == 2 && Matrix[i][0] == 0) {
        winX = i;
        winY = 0;
        }
        else if(Matrix[i][0] == 2 && Matrix[i][2] == 2 && Matrix[i][1] == 0) {
        winX = i;
        winY = 1;
        }
            
        else if(Matrix[0][i] == 2 && Matrix[1][i] == 2 && Matrix[2][i] == 0) {
            winX = 2;
            winY = i;
        }
        else if(Matrix[1][i] == 2 && Matrix[2][i] == 2 && Matrix[0][i] == 0) {
        winX = 0;
        winY = i;
        }
        else if(Matrix[0][i] == 2 && Matrix[2][i] == 2 && Matrix[1][i] == 0) {
        winX = 1;
        winY = i;
        }
        /////////////////////////////////////////
        if(Matrix[i][0] == 1 && Matrix[i][1] == 1 && Matrix[i][2] == 0) {
            enemyX = i;
            enemyY = 2;
        }
        else if(Matrix[i][1] == 1 && Matrix[i][2] == 1 && Matrix[i][0] == 0) {
            enemyX = i;
            enemyY = 0;
        }
        else if(Matrix[i][0] == 1 && Matrix[i][2] == 1 && Matrix[i][1] == 0) {
            enemyX = i;
            enemyY = 1;
        }
            
        else if(Matrix[0][i] == 1 && Matrix[1][i] == 1 && Matrix[2][i] == 0) {
            enemyX = 2;
            enemyY = i;
        }
        else if(Matrix[1][i] == 1 && Matrix[2][i] == 1 && Matrix[0][i] == 0) {
            enemyX = 0;
            enemyY = i;
        }
        else if(Matrix[0][i] == 1 && Matrix[2][i] == 1 && Matrix[1][i] == 0) {
            enemyX = 1;
            enemyY = i;
        }
        
    } 

    if(Matrix[0][0] == 2 && Matrix[1][1] == 2 && Matrix[2][2] == 0) {
        winX = 2;
        winY = 2;
    }
    else if(Matrix[1][1] == 2 && Matrix[2][2] == 2 && Matrix[0][0] == 0) {
    winX = 0;
    winY = 0;
    }
    else if(Matrix[0][0] == 2 && Matrix[2][2] == 2 && Matrix[1][1] == 0) {
    winX = 1;
    winY = 1;
    }
        
    else if(Matrix[0][2] == 2 && Matrix[1][1] == 2 && Matrix[2][0] == 0) {
        winX = 2;
        winY = 0;
    }
    else if(Matrix[1][1] == 2 && Matrix[2][0] == 2 && Matrix[0][2] == 0) {
    winX = 0;
    winY = 2;
    }
    else if(Matrix[0][2] == 2 && Matrix[2][0] == 2 && Matrix[1][1] == 0) {
    winX = 1;
    winY = 1;
    }

    if(Matrix[0][0] == 1 && Matrix[1][1] == 1 && Matrix[2][2] == 0) {
        enemyX = 2;
        enemyY = 2;
    }
    else if(Matrix[1][1] == 1 && Matrix[2][2] == 1 && Matrix[0][0] == 0) {
        enemyX = 0;
        enemyY = 0;
    }
    else if(Matrix[0][0] == 1 && Matrix[2][2] == 1 && Matrix[1][1] == 0) {
        enemyX = 1;
        enemyY = 1;
    }
        
    else if(Matrix[0][2] == 1 && Matrix[1][1] == 1 && Matrix[2][0] == 0) {
        enemyX = 2;
        enemyY = 0;
    }
    else if(Matrix[1][1] == 1 && Matrix[2][0] == 1 && Matrix[0][2] == 0) {
        enemyX = 0;
        enemyY = 2;
    }
    else if(Matrix[0][2] == 1 && Matrix[2][0] == 1 && Matrix[1][1] == 0) {
        enemyX = 1;
        enemyY = 1;
    }
    
    if(Matrix[0][0] == 0) 
    {
        freeX = 0;
        freeY = 0;
    }
    else if(Matrix[0][2] == 0) 
    {
        freeX = 0;
        freeY = 2;
    }
    else if(Matrix[2][0] == 0) 
    {
        freeX = 2;
        freeY = 0;
    }
    else if(Matrix[2][2] == 0) 
    {
        freeX = 2;
        freeY = 2;
    }
    else if(Matrix[1][1] == 0) 
    {
        freeX = 1;
        freeY = 1;
    }
    else if(Matrix[0][1] == 0) 
    {
        freeX = 0;
        freeY = 1;
    }
    else if(Matrix[1][0] == 0) 
    {
        freeX = 1;
        freeY = 0;
    }
    else if(Matrix[1][2] == 0) 
    {
        freeX = 1;
        freeY = 2;
    }
    else if(Matrix[2][1] == 0) 
    {
        freeX = 2;
        freeY = 1;
    }


    if(winX != -1 && winY != -1) 
    {
        if(player2.CrossOrZero == true)
            DrawCross(document.getElementById(winX*3 + winY + 1 + "canvas").getContext('2d'));
        else
        DrawZero(document.getElementById(winX*3 + winY + 1 + "canvas").getContext('2d'));

            Matrix[winX][winY] = 2;
    }
    else if(enemyX != -1 && enemyY != -1) 
    {
        if(player2.CrossOrZero == true)
            DrawCross(document.getElementById(enemyX*3 + enemyY + 1 + "canvas").getContext('2d'));
        else
            DrawZero(document.getElementById(enemyX*3 + enemyY + 1 +"canvas").getContext('2d'));

            Matrix[enemyX][enemyY] = 2;
    }
    else  
    {
        if(player2.CrossOrZero == true)
            DrawCross(document.getElementById(freeX*3 + freeY + 1 +"canvas").getContext('2d'));
        else
            DrawZero(document.getElementById(freeX*3 + freeY + 1 +"canvas").getContext('2d'));

            Matrix[freeX][freeY] = 2;
    }



}