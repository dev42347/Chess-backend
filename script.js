const socket = new WebSocket('ws://localhost:8080');

socket.onopen = () => {
    console.log('Connected to the server');
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'init' || data.type === 'update') {
        renderBoard(data.state);
    }

    if (data.type === 'invalid') {
        alert('Invalid move!');
    }

    if (data.type === 'gameover') {
        alert(`Game Over! Winner: Player ${data.winner}`);
    }
};

const renderBoard = (state) => {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = ''; // Clear the board

    state.board.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            const cellElement = document.createElement('div');
            cellElement.className = 'cell';
            if (cell) {
                cellElement.textContent = cell;
            }
            boardElement.appendChild(cellElement);
        });
    });
};

let selectedPiece = null;

document.getElementById('board').addEventListener('click', (event) => {
    const target = event.target;
    if (target.className === 'cell' && selectedPiece) {
        const move = { type: 'move', player: 'A', move: `${selectedPiece}:${target.dataset.move}` };
        socket.send(JSON.stringify(move));
        selectedPiece = null;
    } else if (target.className === 'cell' && target.textContent.startsWith('A-')) {
        selectedPiece = target.textContent;
    }
});
