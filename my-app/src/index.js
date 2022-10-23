import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function WinSquare(props) {
  return (
    <button className="win-square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    // 勝利マスへ色付け
    if(this.props.winnerIdx === i) {
      return (
        <WinSquare
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key ={i}
      />
      );
    }
    // 通常マス
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key ={i}
      />
    );
  }

  render() {
    var list = [];
    var data = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
    ];
  
    for(let i = 0; i < data.length; i++){
      let row = [];
      for(let j = 0; j < data[i].length; j++){
        row.push(this.renderSquare(data[i][j]));
      }
      list.push(<div className="board-row" key ={i}>{row}</div>);
    }
  
    return(
      <div>
        {list}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          idx: null,
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          idx: i
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerRes = calculateWinner(current.squares);
    let winner = null;
    let winnerIdx = null;
    if(winnerRes !== null) {
      winner = winnerRes.winner;
      winnerIdx = winnerRes.idx;
    }

    const moves = history.map((step, move) => {
      const cell = culculateCellInfo(step.idx);
      let desc = '最初から始める';
      if(move) {
        desc = '#' + move + ' へ移動 (' + cell.row + ',' + cell.col + ')';
      }

      if(this.state.stepNumber === move) {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
          </li>
        );  
      } 
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = winner + " の勝ちです";
    } else {
      status = "次: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winnerIdx={winnerIdx}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
  }
}

class WinnerRes {
  constructor(winner, idx) {
    this.winner = winner;
    this.idx = idx;
  }
}

function culculateCellInfo(i) {
  const info = [
    new Cell(1, 1),
    new Cell(1, 2),
    new Cell(1, 3),
    new Cell(2, 1),
    new Cell(2, 2),
    new Cell(2, 3),
    new Cell(3, 1),
    new Cell(3, 2),
    new Cell(3, 3),
  ];

  if(i === null) return null;

  return info[i];
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return new WinnerRes(squares[a], a);
    }
  }
  return null;
}

