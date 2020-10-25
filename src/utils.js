export const L = 15;

const makeDiags = (start, n, d) => {
    const res = [];
    for (let i = 0; i < n; i++) {
        res.push(start + i * d)
    }
    return res;
}

const counter = (arr) => {
    let count = {};
    arr.forEach(x => count[x] = (count[x] || 0) + 1);
    return count;
}

export const calculateLines = (n) => {
    const res = [];
    for (let i = 0; i < L; i++) {
        // row lines
        for (let j = i * L; j <= i * L + L - n; j++) {
            const row = [];
            for (let k = 0; k < n; k++) {
                row.push(j + k);
            }
            res.push(row);
        }
        // col lines
        for (let j = i; j <= i + L * (L - n); j += L) {
            const col = [];
            for (let k = 0; k < n; k++) {
                col.push(j + L * k);
            }
            res.push(col);
        }
        // diag lines
        for (let j = 0; j < L - n + 1 - i; j++) {
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

export const calculateWinner = (squares) => {
    for (let i = 0; i < LINES.length; i++) {
        if (squares[LINES[i][0]] && LINES[i].every( (x, i, arr) => squares[x] === squares[arr[0]])) {
            return [squares[LINES[i][0]], LINES[i]]
        }
    }
    return null;
}

export const four = (squares) => {
    const res = [0, 0];
    for (let i = 0; i < LINES.length; i++) {
        const line = LINES[i].map(x => squares[x]);
        const count = counter(line);
        if (count['X'] === 4 && count[null] === 1) {
            res[0] += 1;
        } else if (count['O'] === 4 && count[null] === 1) {
            res[1] += 1;
        }
    }
    return res;
}

export const straightFour = (squares) => {
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

export const three = (squares) => {
    const res = [0, 0];
    for (let i = 0; i < SEVENS.length; i++) {
        const line = SEVENS[i];
        const sLine = line.map(x => squares[x]);
        const sLine1 = sLine.slice(0, 6);
        const sLine2 = sLine.slice(1, 7);
        const count = counter(sLine);
        const count1 = counter(sLine1);
        const count2 = counter(sLine2);
        const slice = sLine.slice(2, 5);
        const isThree = slice[0] && slice.every(x => x === slice[0]);
        if (isThree && count[null] === 4) {
            if (slice[0] === 'X') {
                res[0] += 1;
            } else {
                res[1] += 1;
            }
            continue;
        }
        for (let s of [sLine1, sLine2]) {
            const sl = s.slice(1, 5);
            const counter = s === sLine1 ? count1 : count2;
            if (counter[null] === 3 && sl.filter(x => x === sl[1]).length === 3 && (!(sl[0] && sl[4]))) {
                if (sl[1] === 'X') {
                    res[0] += 1;
                } else if (sl[1] === 'O') {
                    res[1] += 1;
                }
                break;
            }
        }
    }
    return res;
}

export const brokenThree = (squares) => {
    const res = [0, 0];
    for (let i = 0; i < SIXES.length; i++) {
        const line = SIXES[i];
        const sLine = line.map(x => squares[x]);
        const count = counter(sLine);
        const slice = sLine.slice(1, 5);
        const isThree = slice[0] && slice[3] && slice.filter(x => x === slice[0]).length === 3;
        if (isThree && count[null] === 3) {
            if (slice[0] === 'X') {
                res[0] += 1;
            } else {
                res[1] += 1;
            }
        }
    }
    return res;
}

export const LINES = calculateLines(5);
export const SIXES = calculateLines(6);
export const SEVENS = calculateLines(7);