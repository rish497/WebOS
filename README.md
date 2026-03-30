# WebOS - Windows-like Operating System in Chrome

A web-based operating system that mimics the Windows interface, running entirely in your browser.

## Features
- The File Explorer txt files DO NOT SAVE PROGRESS OR EDITS yet. That us for future updates.
- Desktop with icons
- Taskbar with start menu
- Window management (minimize, maximize, close, drag)
- Built-in applications:
  - Notepad: Simple text editor
  - Calculator: Basic calculator
  - Browser: Embedded web browser
  - File Explorer: Simulated file system

## How to Run

### Option 1: Direct Browser Open
1. Open `index.html` directly in your web browser
2. Note: Some features like the browser app may have restrictions

### Option 2: Local Server (Recommended)
1. Make sure Python 3 is installed
2. Run `python server.py` (or `python3 server.py`)
3. Open http://localhost:8000 in your browser
4. This allows full functionality including the embedded browser

## Browser Compatibility

Works best in modern browsers that support:
- CSS Grid and Flexbox
- ES6 JavaScript features
- iframe for the browser app

## Development

The project structure:
- `index.html`: Main HTML file
- `css/desktop.css`: Styles for the desktop and windows
- `js/desktop.js`: Main desktop functionality and window management
- `js/apps.js`: Application definitions and logic
- `js/window.js`: Additional window utilities (currently minimal)

## Limitations

- No real file system (File Explorer is simulated)
- Browser app has security restrictions for cross-origin content
- No persistence (data doesn't save between sessions)
- Calculator is basic (no advanced functions)

## Future Enhancements

- Add more applications (paint, terminal, etc.)
- Implement a virtual file system
- Add themes and customization
- Improve calculator with more functions
- Add sound effects and animations
