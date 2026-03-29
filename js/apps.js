// Apps definitions
window.apps = {
    notepad: {
        title: 'Notepad',
        icon: '📝',
        content: `
            <textarea style="width: 100%; height: 100%; border: none; resize: none; font-family: monospace;" placeholder="Type here..."></textarea>
        `,
        width: 500,
        height: 400
    },
    calculator: {
        title: 'Calculator',
        icon: '🧮',
        content: `
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; font-family: monospace;">
                <button onclick="calcInput('7')">7</button>
                <button onclick="calcInput('8')">8</button>
                <button onclick="calcInput('9')">9</button>
                <button onclick="calcInput('/')">/</button>
                <button onclick="calcInput('4')">4</button>
                <button onclick="calcInput('5')">5</button>
                <button onclick="calcInput('6')">6</button>
                <button onclick="calcInput('*')">*</button>
                <button onclick="calcInput('1')">1</button>
                <button onclick="calcInput('2')">2</button>
                <button onclick="calcInput('3')">3</button>
                <button onclick="calcInput('-')">-</button>
                <button onclick="calcInput('0')">0</button>
                <button onclick="calcInput('.')">.</button>
                <button onclick="calcInput('=')">=</button>
                <button onclick="calcInput('+')">+</button>
                <button onclick="calcClear()">C</button>
            </div>
            <input id="calc-display" type="text" readonly style="width: 100%; margin-top: 10px; text-align: right; font-size: 20px;">
        `,
        width: 250,
        height: 300
    },
    browser: {
        title: 'Browser',
        icon: '🌐',
        content: `
            <div style="display: flex; margin-bottom: 10px;">
                <input id="url-input" type="text" placeholder="Enter URL" style="flex: 1; padding: 5px;">
                <button onclick="loadPage()">Go</button>
            </div>
            <iframe id="browser-frame" src="about:blank" style="width: 100%; height: calc(100% - 40px); border: 1px solid #ccc;"></iframe>
        `,
        width: 800,
        height: 600
    },
    'file-explorer': {
        title: 'File Explorer',
        icon: '📁',
        content: `
            <div style="display: flex; height: 100%;">
                <div style="width: 200px; border-right: 1px solid #ccc; padding: 10px;">
                    <h4>Folders</h4>
                    <ul>
                        <li>Desktop</li>
                        <li>Documents</li>
                        <li>Downloads</li>
                        <li>Pictures</li>
                    </ul>
                </div>
                <div style="flex: 1; padding: 10px;">
                    <h4>Files</h4>
                    <ul id="file-list">
                        <li>sample.txt</li>
                        <li>image.jpg</li>
                        <li>document.pdf</li>
                    </ul>
                </div>
            </div>
        `,
        width: 600,
        height: 400
    }
};

// Calculator functions
let calcExpression = '';
function calcInput(value) {
    if (value === '=') {
        try {
            calcExpression = eval(calcExpression).toString();
        } catch {
            calcExpression = 'Error';
        }
    } else if (value === 'C') {
        calcExpression = '';
    } else {
        calcExpression += value;
    }
    document.getElementById('calc-display').value = calcExpression;
}

function calcClear() {
    calcExpression = '';
    document.getElementById('calc-display').value = '';
}

// Browser function
function loadPage() {
    const url = document.getElementById('url-input').value;
    const frame = document.getElementById('browser-frame');
    if (url.startsWith('http://') || url.startsWith('https://')) {
        frame.src = url;
    } else {
        frame.src = 'https://' + url;
    }
}