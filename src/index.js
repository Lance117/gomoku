import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from "reactstrap";
import './index.css';

const L = 15;
const LINES = calculateLines(5);
const SIXES = calculateLines(6);
const SEVENS = calculateLines(7);

function Square(props) {
    let name = props.sqState ? 'square ' + props.sqState : 'square unclicked';
    if (props.isWinner) name = name + ' is-winner';
    if (props.lastMove) name = name + ' last-move';
    return (
        <button className={name} cur-piece={props.curPiece} onClick={() => props.onClick()}>
            {props.value}
        </button>
    );
}

function Restart(props) {
    let title, modalMsg;
    if (props.mode === 'default') {
        title = 'Play With a Friend';
        modalMsg = 'Are you sure you want to restart?';
    } else if (props.mode === 'ai') {
        title = 'Play Against Computer';
        modalMsg = 'Are you sure you want to play against computer?';
    }
    return (
        <Modal isOpen={props.modal} toggle={props.toggle}>
            <ModalHeader toggle={props.toggle}>{title}</ModalHeader>
            <ModalBody>
                {modalMsg}
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={props.reset}>Yes</Button>{' '}
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
            mode: 'ai',
            selectedMode: null,
            lastMove: null
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
            spotsOccupied: this.state.spotsOccupied + 1,
            lastMove: i
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
            selectedMode: null,
            lastMove: null
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
                lastMove={!this.state.winner && this.state.lastMove === i}
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
            window.setTimeout((move) => this.handleClick(aiMove(this.state.squares)), 500);
        }
    }

    render() {
        let status, alertColor;
        if (this.state.winner) {
            status = 'Winner: ' + this.state.winner[0];
            alertColor = this.state.winner[0] === 'X' ? 'success' : 'danger';
        } else if (this.state.spotsOccupied === L * L) {
            status = 'Game ended in a draw';
        } else if (this.state.mode === 'ai' && !this.state.xIsNext) {
            status = 'Thinking...';
            alertColor = 'info';
        } else if (this.state.mode === 'ai') {
            status = 'Human vs AI: your turn';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
            alertColor = this.state.xIsNext ? 'info' : 'primary';
        }
        const thinking = this.state.mode === 'ai' && !this.state.xIsNext && !this.state.winner;

        return (
            <div>
                <Alert color={alertColor}>
                    {status}
                    {thinking && <Spinner size="sm" color="primary" />}
                </Alert>
                {this.renderBoard()}
                <div className="btn-options">
                    <Button color="info" onClick={(e) => this.toggle('ai', e)}>PLAY COMPUTER</Button>{' '}
                    <Button color="primary" onClick={(e) => this.toggle('default', e)}>PLAY A FRIEND</Button>{' '}
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

function makeDiags(start, n, d) {
    const res = [];
    for (let i = 0; i < n; i++) {
        res.push(start + i * d)
    }
    return res;
}

function calculateLines(n) {
    const res = [];
    for (let i = 0; i < L; i++) {
        // get winning row lines
        for (let j = i * L; j <= i * L + L - n; j++) {
            const row = [];
            for (let k = 0; k < n; k++) {
                row.push(j + k);
            }
            res.push(row);
        }
        // get winning col lines
        for (let j = i; j <= i + L * (L - n); j += L) {
            const col = [];
            for (let k = 0; k < n; k++) {
                col.push(j + L * k);
            }
            res.push(col);
        }
        // get winning diag lines
        for (let j = 0; j < L - n - 1 - i; j++) {
            const d1 = L + 1;
            const d2 = L - 1;
            let col1 = i + d1 * j;
            let col2 = d2 * (j + 1) - i;
            let row1 = L * i + d1 * j;
            let row2 = L * i + d2 * (j + 1);
            res.push(makeDiags(col1, n, d1));
            res.push(makeDiags(col2, n, d2));
            res.push(makeDiags(row1, n, d1));
            res.push(makeDiags(row2, n, d2));
        }
    }
    return res;
}

function calculateWinner(squares) {
    for (let i = 0; i < LINES.length; i++) {
        if (squares[LINES[i][0]] && LINES[i].every( (x, i, arr) => squares[x] === squares[arr[0]])) {
            return [squares[LINES[i][0]], LINES[i]]
        }
    }
    return null;
}

function four(squares) {
    const res = [0, 0];
    for (let i = 0; i < LINES.length; i++) {
        const lineNum = LINES[i];
        const line = lineNum.map(x => squares[x]).sort();
        if (line[0] && line.filter(x => x === line[0]).length === 4 && !line[4]) {
            if (line[0] === 'X') {
                res[0] += 1;
            } else {
                res[1] += 1;
            }
        }
    }
    return res;
}

function straightFour(squares) {
    const res = [0, 0];
    for (let i = 0; i < SIXES.length; i++) {
        const line = SIXES[i];
        const slice = line.slice(1, 5);
        const isFour = squares[slice[0]] && slice.every((x, i, arr) => squares[x] === squares[arr[0]]);
        if (isFour && !(squares[line[0]] || squares[line[5]])) {
            if (squares[slice[0]] === 'X') {
                res[0] += 1;
            } else {
                res[1] += 1;
            }
        }
    }
    return res;
}

function three(squares) {
    const res = [0, 0];
    for (let i = 0; i < SEVENS.length; i++) {
        const line = SEVENS[i];
        const sLine = line.map(x => squares[x]);
        const slice = line.slice(2, 5);
        const isThree = squares[slice[0]] && slice.every((x, i, arr) => squares[x] === squares[arr[0]]);
        if (isThree && sLine.filter(x => x === null).length === 4) {
            if (squares[slice[0]] === 'X') {
                res[0] += 1;
            } else {
                res[1] += 1;
            }
        }
    }
    for (let i = 0; i < SIXES.length; i++) {
        const line = SIXES[i];
        const sLine = line.map(x => squares[x]);
        const slice = line.slice(1, 4);
        const isThree = squares[slice[0]] && slice.every((x, i, arr) => squares[x] === squares[arr[0]]);
        if (isThree && sLine.filter(x => x === null).length === 3) {
            if (squares[slice[0]] === 'X') {
                res[0] += 1;
            } else {
                res[1] += 1;
            }
        }
    }
    return res;
}

function brokenThree(squares) {
    const res = [0, 0];
    for (let i = 0; i < SIXES.length; i++) {
        const line = SIXES[i];
        const slice = line.slice(1, 5);
        const sLine = slice.map(x => squares[x]).sort();
        const isThree = sLine[0] && sLine.filter(x => x === sLine[0]).length === 3 && !sLine[4];
        if (isThree && !(squares[line[0]] || squares[line[5]])) {
            if (squares[slice[0]] === 'X') {
                res[0] += 1;
            } else {
                res[1] += 1;
            }
        }
    }
    return res;
}

function terminal(squares) {
    return calculateWinner(squares) || !squares.includes(null);
}

function actions(squares) {
    const res = [];
    const checkRow = [0, L, -L, 2*L, -2*L];
    const checkCol = [-2, -1, 0, 1, 2];
    for (let i = 0; i < squares.length; i++) {
        if (!squares[i]) {
            let found = false;
            for (let row of checkRow) {
                if (found) break;
                for (let col of checkCol) {
                    let n = i + row + col;
                    if (n >= 0 && n < 255 && squares[n] === 'X') {
                        res.push(i);
                        found = true;
                        break;
                    }
                }
            }
        }
    }
    return res;
}

function result(squares, action, player) {
    const board = squares.slice();
    board[action] = player;
    return board;
}

function utility(squares) {
    const winner = calculateWinner(squares);
    if (winner) {
        if (winner[0] === 'X') {
            return 1000000;
        } else {
            return -1000000;
        }
    } else {
        let bt, t, f, sf;
        [bt, t, f, sf] = [brokenThree(squares), three(squares), four(squares), straightFour(squares)];
        return 15 * (bt[0] - bt[1]) + 25 * (t[0] - t[1]) + 40 * (f[0] - f[1]) + 400 * (sf[0] - sf[1]);
    }
}

function maxPlayer(squares, alpha, beta, depth) {
    if (terminal(squares) || depth === 2) {
        return [utility(squares), null];
    }
    let v = [alpha, null];
    for (let action of actions(squares)) {
        const minVal = minPlayer(result(squares, action, 'X'), v[0], beta, depth + 1);
        if (minVal[0] > v[0]) {
            v = [minVal[0], action];
            if (v[0] >= beta) {
                break;
            }
        }
    }
    return v;
}

function minPlayer(squares, alpha, beta, depth) {
    if (terminal(squares) || depth === 2) {
        return [utility(squares), null];
    }
    let v = [beta, null];
    for (let action of actions(squares)) {
        const maxVal = maxPlayer(result(squares, action, 'O'), alpha, v[0], depth + 1);
        if (maxVal[0] < v[0]) {
            v = [maxVal[0], action];
            if (alpha >= v[0]) {
                break;
            }
        }
    }
    return v;

}

function aiMove(state) {
    let a = minPlayer(state, -Infinity, Infinity, 0);
    // console.log(a);
    return a[1];
}