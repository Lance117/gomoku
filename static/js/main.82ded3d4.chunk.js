(this.webpackJsonpgomoku=this.webpackJsonpgomoku||[]).push([[0],{21:function(e,t,a){e.exports=a(22)},22:function(e,t,a){"use strict";a.r(t);var n=a(20),r=a(11),s=a(12),l=a(13),u=a(14),o=a(1),i=a.n(o),c=a(7),d=a.n(c),m=(a(27),a(41)),h=a(38),f=a(39),v=a(40),p=a(10);a(28);function g(e){var t=e.status?"square "+e.status:"square unclicked";return e.isWinner&&(t+=" is-winner"),i.a.createElement("button",{className:t,onClick:function(){return e.onClick()}},e.value)}function E(e){var t;return"default"===e.mode&&(t="Single Player Mode"),i.a.createElement(m.a,{isOpen:e.modal,toggle:e.toggle},i.a.createElement(h.a,{toggle:e.toggle},t),i.a.createElement(f.a,null,"Are you sure you want to restart?"),i.a.createElement(v.a,null,i.a.createElement(p.a,{color:"primary",onClick:e.reset},"Restart")," ",i.a.createElement(p.a,{color:"secondary",onClick:e.toggle},"Cancel")))}var k=function(e){Object(u.a)(a,e);var t=Object(l.a)(a);function a(e){var n;return Object(r.a)(this,a),(n=t.call(this,e)).state={squares:Array(225).fill(null),xIsNext:!0,winner:null,numSquares:225,openModal:!1,mode:"default",selectedMode:null},n}return Object(s.a)(a,[{key:"handleClick",value:function(e){var t=this.state.squares.slice();this.state.winner||t[e]||(t[e]=this.state.xIsNext?"X":"O",this.setState({squares:t,xIsNext:!this.state.xIsNext,winner:q(t),numSquares:this.state.numSquares-1}))}},{key:"toggle",value:function(e){this.setState({openModal:!this.state.openModal,selectedMode:e})}},{key:"reset",value:function(e){"default"===e&&this.setState({squares:Array(225).fill(null),xIsNext:!0,winner:null,numSquares:225,openModal:!1,mode:"default",selectedMode:null})}},{key:"renderSquare",value:function(e){var t=this;return i.a.createElement(g,{value:this.state.squares[e],status:this.state.squares[e]?"clicked-"+this.state.squares[e]:null,isWinner:this.state.winner&&this.state.winner[1].includes(e),onClick:function(){return t.handleClick(e)}})}},{key:"renderBoard",value:function(){for(var e=[],t=0;t<15;t++){for(var a=[],n=15*t;n<15*(t+1);n++)a.push(this.renderSquare(n));e.push(i.a.createElement("div",{className:"board-row"},a))}return e}},{key:"render",value:function(){var e,t=this;return e=this.state.winner?"Winner: "+this.state.winner[0]:0===this.state.numSquares?"Game ended in a draw":"Next player: "+(this.state.xIsNext?"X":"O"),i.a.createElement("div",null,i.a.createElement("div",{className:"status"},e),this.renderBoard(),i.a.createElement("div",null,i.a.createElement(p.a,{color:"primary",onClick:function(e){return t.toggle("default",e)}},"RESTART GAME")," ",i.a.createElement(p.a,{color:"info"},"PLAY COMPUTER")," "),i.a.createElement(E,{modal:this.state.openModal,mode:this.state.selectedMode,reset:function(e){return t.reset(t.state.selectedMode,e)},toggle:function(){return t.toggle()}}))}}]),a}(i.a.Component),y=function(e){Object(u.a)(a,e);var t=Object(l.a)(a);function a(){return Object(r.a)(this,a),t.apply(this,arguments)}return Object(s.a)(a,[{key:"render",value:function(){return i.a.createElement("div",{className:"game"},i.a.createElement("div",{className:"game-board"},i.a.createElement(k,null)),i.a.createElement("div",{className:"game-info"},i.a.createElement("div",null),i.a.createElement("ol",null)))}}]),a}(i.a.Component);function q(e){for(var t=function(){for(var e=[],t=0;t<15;t++){for(var a=15*t;a<=15*t+10;a++)e.push([a,a+1,a+2,a+3,a+4]);for(var n=t;n<=t+150;n+=15)e.push([n,n+15,n+30,n+45,n+60]);for(var r=0;r<=11-t;r++){var s=t+16*r;e.push([s,s+16,s+32,s+48,s+64]);var l=14*(r+1)-t;e.push([l,l+14,l+28,l+42,l+56]);var u=15*t+16*r;e.push([u,u+16,u+32,u+48,u+64]);var o=15*t+14*(r+1);e.push([o,o+14,o+28,o+42,o+56])}}return e}(),a=0;a<t.length;a++){var r=Object(n.a)(t[a],5),s=r[0],l=r[1],u=r[2],o=r[3],i=r[4];if(e[s]&&e[s]===e[l]&&e[s]===e[u]&&e[s]===e[o]&&e[s]===e[i])return[e[s],t[a]]}return null}d.a.render(i.a.createElement(y,null),document.getElementById("root"))},28:function(e,t,a){}},[[21,1,2]]]);
//# sourceMappingURL=main.82ded3d4.chunk.js.map