import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={() => props.onClick()}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(225).fill(null),
            xIsNext: true,
        };
    }

    handleClick(i) {
        const squares = this.state.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext,
        });
    }

    renderSquare(i) {
        return (
            <Square
                value={this.state.squares[i]}
                onClick={() => this.handleClick(i)}
            />
        );
    }

    renderBoard() {
        const board = [];
        for (let i = 0; i < 15; i++) {
            let row = [];
            for (let j = i * 15; j < i * 15 + 15; j++) {
                row.push(this.renderSquare(j));
            }
            board.push(<div className="board-row">{row}</div>);
        }
        return board;
    }

    render() {
        const winner = calculateWinner(this.state.squares);
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div>
                <div className="status">{status}</div>
                {this.renderBoard()}
            </div>
        );
    }
}

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateLines() {
    const res = [];
    for (let i = 0; i < 15; i++) {
        // get winning row lines
        for (let j = i * 15; j <= i * 15 + 10; j++) {
            res.push([j, j+1, j+2, j+3, j+4]);
        }
        // get winning col lines
        for (let j = i; j <= i + 150; j += 15) {
            res.push([j, j+15, j+30, j+45, j+60]);
        }
        // get winning diag lines
        for (let j = 0; j <= 11 - i; j++) {
            let col1 = i + 16 * j;
            res.push([col1, col1+16, col1+32, col1+48, col1+64]);
            let col2 = 14 * (j + 1) - i;
            res.push([col2, col2+14, col2+28, col2+42, col2+56]);
            let row1 = 15 * i + 16 * j;
            res.push([row1, row1+16, row1+32, row1+48, row1+64]);
            let row2 = 15 * i + 14 * (j + 1);
            res.push([row2, row2+14, row2+28, row2+42, row2+56]);
        }
    }
    return res;
}

function calculateWinner(squares) {
    const lines = calculateLines();
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c, d, e] = lines[i];
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c] &&
            squares[a] === squares[d] &&
            squares[a] === squares[e]
        ) {
            return squares[a];
        }
    }
    return null;
}