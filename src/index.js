import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from "reactstrap";
import { L, calculateWinner, four, straightFour, three, brokenThree } from './utils';
import './index.css';

const RANDTAB = zobrist();
const TRANSPOS_TAB = {};

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
            lastMove: null,
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

function terminal(squares) {
    return calculateWinner(squares) || !squares.includes(null);
}

function actions(squares) {
    const res = [];
    let threatSpace = [];
    const checkRow = [0, L, -L];
    const checkCol = [-1, 0, 1];
    let util = utility(squares);
    for (let i = 0; i < squares.length; i++) {
        if (!squares[i]) {
            let found = false;
            for (let row of checkRow) {
                if (found) break;
                for (let col of checkCol) {
                    if (((i + 1) % 15 === 0 && col === 1) || (i % 15 === 0 && col === -1)) {
                        continue;
                    }
                    let n = i + row + col;
                    if (n >= 0 && n < 255 && squares[n]) {
                        res.push(i);
                        found = true;
                        break;
                    }
                }
            }
        }
    }
    for (let i of res) {
        let xActionUtil = utility(result(squares, i, 'X'));
        let oActionUtil = utility(result(squares, i, 'O'));
        if (xActionUtil !== util || oActionUtil !== util) {
            threatSpace.push([i, Math.max(Math.abs(xActionUtil-util), Math.abs(oActionUtil-util))]);
        }
    }
    threatSpace = threatSpace.sort((a,b) => b[1]-a[1]);
    return threatSpace.length > 0 ? threatSpace.map(x => x[0]).slice(0, 3) : res.slice(0, 3);
}

function result(squares, action, player) {
    const board = squares.slice();
    board[action] = player;
    return board;
}

function utility(squares) {
    const winner = calculateWinner(squares);
    if (winner) {
        return winner[0] === 'X' ? Infinity : -Infinity;
    } else {
        let bt, t, f, sf;
        [bt, t, f, sf] = [brokenThree(squares), three(squares), four(squares), straightFour(squares)];
        return 15 * (bt[0] - bt[1]) + 25 * (t[0] - t[1]) + 100 * (f[0] - f[1]) + 500 * (sf[0] - sf[1]);
    }
}

function maxPlayer(squares, alpha, beta, depth) {
    if (terminal(squares) || depth > 3) {
        return [utility(squares), null];
    }
    const [boardHash, curActs] = [hash(squares), actions(squares)];
    let v = [alpha, curActs[0]];
    if (boardHash in TRANSPOS_TAB) return [alpha, TRANSPOS_TAB[boardHash]];
    for (let action of curActs) {
        const minVal = minPlayer(result(squares, action, 'X'), v[0], beta, depth + 1);
        if (minVal[0] > v[0]) {
            v = [minVal[0], action];
            if (v[0] >= beta) {
                break;
            }
        }
    }
    TRANSPOS_TAB[boardHash] = v[1];
    return v;
}

function minPlayer(squares, alpha, beta, depth) {
    if (terminal(squares) || depth > 3) {
        return [utility(squares), null];
    }
    const [boardHash, curActs] = [hash(squares), actions(squares)];
    let v = [beta, curActs[0]];
    if (boardHash in TRANSPOS_TAB) return [beta, TRANSPOS_TAB[boardHash]];
    for (let action of curActs) {
        const maxVal = maxPlayer(result(squares, action, 'O'), alpha, v[0], depth + 1);
        if (maxVal[0] < v[0]) {
            v = [maxVal[0], action];
            if (alpha >= v[0]) {
                break;
            }
        }
    }
    TRANSPOS_TAB[boardHash] = v[1];
    return v;

}

function aiMove(state) {
    return minPlayer(state, -Infinity, Infinity, 0)[1];
}

function zobrist() {
    let res = new Uint32Array(2*L*L);
    for (let i = 0; i < res.length; i++) {
        res[i] = Math.random() * 4294967296;
    }
    return res;
}

function hash(state) {
    let h = 0;
    for (let i = 0; i < state.length; i++) {
        if (state[i]) {
            const j = state[i] === 'X' ? 0 : 1;
            h ^= RANDTAB[i*2+j];
        }
    }
    return h;
}
