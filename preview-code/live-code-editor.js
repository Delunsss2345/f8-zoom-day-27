const codeEditor = document.getElementById('codeEditor');
const previewCode = document.getElementById('preview');
const formatBtn = document.getElementById('formatBtn');
const contextMenu = document.getElementById('menu');
const clearBtn = document.getElementById("clearBtn");

let clearCode = "";

const editor = CodeMirror.fromTextArea(codeEditor, {
  lineNumbers: true,
  mode: "javascript", 
  theme: "neo"
});

// function escapeHTML(str) {
//   const div = document.createElement("div");
//   div.textContent = str;
//   return div.innerHTML;
// }


editor.on("change", (e) => {
  const code = e.getValue() ;
  clearCode = code; 
  previewCode.srcdoc = clearCode;
});

clearBtn.onclick = () => {
  editor.setValue(""); 
  previewCode.srcdoc = "";
};

window.onbeforeunload = (e) => {
  if (clearCode.trim()) {
    e.returnValue = "";
    return "";
  }
};

document.oncontextmenu =  (e) => {
  e.preventDefault();

  contextMenu.hidden = false;

  const menuWd = contextMenu.offsetWidth;
  const menuHeight = contextMenu.offsetHeight;
  const wdWidth = window.innerWidth;
  const wdHeight = window.innerHeight;

  let x = e.clientX;
  let y = e.clientY;

  if (x + menuWd > wdWidth) x = wdWidth - menuWd - 3;
  if (y + menuHeight > wdHeight) y = wdHeight - menuHeight - 5;

  contextMenu.style.left = `${x}px`;
  contextMenu.style.top = `${y}px`;
} ;

document.addEventListener('mousedown', (e) => {
  if (!contextMenu.contains(e.target)) { //tránh bấm dính bản than menu
    contextMenu.hidden = true;
  }
});

