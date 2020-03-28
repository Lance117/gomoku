import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import './index.css';

function Square(props) {
    let name = props.status ? 'square ' + props.status : 'square unclicked';
    if (props.isWinner) name = name + ' is-winner';
    return (
        <button className={name} cur-piece={props.curPiece} onClick={() => props.onClick()}>
            {props.value}
        </button>
    );
}

function Restart(props) {
    let title;
    if (props.mode === 'default') {
        title = 'Single Player Mode';
    } else if (props.mode === 'ai') {
        title = 'Play Against Computer';
    }
    return (
        <Modal isOpen={props.modal} toggle={props.toggle}>
            <ModalHeader toggle={props.toggle}>{title}</ModalHeader>
            <ModalBody>
               Are you sure you want to restart? 
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={props.reset}>Restart</Button>{' '}
                <Button color="secondary" onClick={props.toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    )
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(225).fill(null),
            xIsNext: true,
            winner: null,
            numSquares: 225,
            openModal: false,
            mode: 'default',
            selectedMode: null,
        };
    }

    handleClick(i) {
        const squares = this.state.squares.slice();
        if (this.state.winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext,
            winner: calculateWinner(squares),
            numSquares: this.state.numSquares - 1
        });
    }

    toggle(mode) {
        this.setState({openModal: !this.state.openModal, selectedMode: mode});
    }

    reset(mode) {
        if (mode === 'default') {
            this.setState({
                squares: Array(225).fill(null),
                xIsNext: true,
                winner: null,
                numSquares: 225,
                openModal: false,
                mode: 'default',
                selectedMode: null
            })
        }
    }

    renderSquare(i) {
        return (
            <Square
                key={'square'+i.toString()}
                curPiece={this.state.xIsNext ? 'X' : 'O'}
                value={this.state.squares[i]}
                status={!!this.state.squares[i] ? 'clicked-' + this.state.squares[i] : null}
                isWinner={this.state.winner && this.state.winner[1].includes(i)}
                onClick={() => this.handleClick(i)}
            />
        );
    }

    renderBoard() {
        const board = [];
        for (let i = 0; i < 15; i++) {
            let row = [];
            for (let j = i * 15; j < 15 * (i + 1); j++) {
                row.push(this.renderSquare(j));
            }
            board.push(<div className="board-row" key={'row'+i.toString()}>{row}</div>);
        }
        return board;
    }

    render() {
        let status;
        if (this.state.winner) {
            status = 'Winner: ' + this.state.winner[0];
        } else if (this.state.numSquares === 0) {
            status = 'Game ended in a draw';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div>
                <div className="status">{status}</div>
                {this.renderBoard()}
                <div className="btn-options">
                    <Button color="primary" onClick={(e) => this.toggle('default', e)}>RESTART GAME</Button>{' '}
                    <Button color="info" onClick={(e) => this.toggle('ai', e)}>PLAY COMPUTER</Button>{' '}
                </div>
                <Restart
                    modal={this.state.openModal}
                    mode={this.state.selectedMode}
                    reset={(e) => this.reset(this.state.selectedMode, e)}
                    toggle={() => this.toggle()}
                >
                </Restart>
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
            return [squares[a], lines[i]];
        }
    }
    return null;
}