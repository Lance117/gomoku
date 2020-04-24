import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from "reactstrap";
import './index.css';

const L = 15;

function Square(props) {
    let name = props.sqState ? 'square ' + props.sqState : 'square unclicked';
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
            squares: Array(L * L).fill(null),
            xIsNext: true,
            winner: null,
            spotsOccupied: 0,
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
            spotsOccupied: this.state.spotsOccupied + 1
        });
    }

    toggle(mode) {
        this.setState({openModal: !this.state.openModal, selectedMode: mode});
    }

    reset(mode) {
        this.setState({
            squares: Array(L*L).fill(null),
            xIsNext: true,
            winner: null,
            spotsOccupied: 0,
            openModal: false,
            mode: mode,
            selectedMode: null
        })
    }

    renderSquare(i) {
        return (
            <Square
                key={'square'+i.toString()}
                curPiece={this.state.xIsNext ? 'X' : 'O'}
                value={this.state.squares[i]}
                sqState={!!this.state.squares[i] ? 'clicked-' + this.state.squares[i] : null}
                isWinner={this.state.winner && this.state.winner[1].includes(i)}
                onClick={() => this.handleClick(i)}
            />
        );
    }

    renderBoard() {
        const board = [];
        for (let i = 0; i < L; i++) {
            let row = [];
            for (let j = i * L; j < L * (i + 1); j++) {
                row.push(this.renderSquare(j));
            }
            board.push(<div className="board-row" key={'row'+i.toString()}>{row}</div>);
        }
        return board;
    }

    componentDidUpdate() {
        if (this.state.mode === 'ai' && !this.state.xIsNext) {
            const move = aiMove(this.state.squares, this.state.spotsOccupied);
            window.setTimeout((move) => this.handleClick(move), 400, move);
        }
    }

    render() {
        let status;
        if (this.state.winner) {
            status = 'Winner: ' + this.state.winner[0];
        } else if (this.state.spotsOccupied === L * L) {
            status = 'Game ended in a draw';
        } else if (this.state.mode === 'ai' && !this.state.xIsNext) {
            status = 'Thinking...'
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        const thinking = this.state.mode === 'ai' && !this.state.xIsNext && !this.state.winner;

        return (
            <div>
                <div className="status">
                    {status}
                    {thinking && <Spinner size="sm" color="primary" />}
                </div>
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
    for (let i = 0; i < L; i++) {
        // get winning row lines
        for (let j = i * L; j <= i * L + L - 5; j++) {
            res.push([j, j+1, j+2, j+3, j+4]);
        }
        // get winning col lines
        for (let j = i; j <= i + L * 10; j += L) {
            res.push([j, j+L, j+L*2, j+L*3, j+L*4]);
        }
        // get winning diag lines
        for (let j = 0; j < L - 4 - i; j++) {
            const d1 = L + 1;
            const d2 = L - 1;
            let col1 = i + d1 * j;
            let col2 = d2 * (j + 1) - i;
            let row1 = L * i + d1 * j;
            let row2 = L * i + d2 * (j + 1);
            res.push([col1, col1+d1, col1+d1*2, col1+d1*3, col1+d1*4]);
            res.push([col2, col2+d2, col2+d2*2, col2+d2*3, col2+d2*4]);
            res.push([row1, row1+d1, row1+d1*2, row1+d1*3, row1+d1*4]);
            res.push([row2, row2+d2, row2+d2*2, row2+d2*3, row2+d2*4]);
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
            console.log(lines[i])
            return [squares[a], lines[i]];
        }
    }
    return null;
}

function aiMove(state, spotsOccupied) {
    if (state.length === spotsOccupied) return null;
    let pivot = state.length - 1;
    const squares = state.slice();
    const indices = [...Array(L*L).keys()];
    for (let i = 0; i < squares.length - spotsOccupied; i++) {
        while (squares[i]) {
            [squares[i], squares[pivot]] = [squares[pivot], squares[i]];
            [indices[i], indices[pivot]] = [indices[pivot], indices[i]];
            pivot -= 1;
        }
    }
    return indices[Math.floor(Math.random() * (squares.length - spotsOccupied))];
}