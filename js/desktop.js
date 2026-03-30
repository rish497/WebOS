// Desktop functionality
const windowsByApp = {}; // appName -> [windowDivs]
let hideTimeout;

document.addEventListener('DOMContentLoaded', function() {
    const desktop = document.getElementById('desktop');
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    const desktopIcons = document.getElementById('desktop-icons');
    const taskbarApps = document.getElementById('taskbar-apps');
    const clock = document.getElementById('clock');
    const windowListPopup = document.getElementById('window-list-popup');
    windowListPopup.addEventListener("mouseenter", () => {
            clearTimeout(hideTimeout);
        });

        windowListPopup.addEventListener("mouseleave", () => {
            hideTimeout = setTimeout(hideWindowList, 300);
        });
        document.addEventListener("mousemove", (e) => {
        const isOnTaskbar = e.target.closest(".taskbar-app");
        const isOnPopup = e.target.closest("#window-list-popup");

        if (!isOnTaskbar && !isOnPopup) {
            hideTimeout = setTimeout(hideWindowList, 200);
        } else {
            clearTimeout(hideTimeout);
        }
    });
    

    const fileSystem = {
        "Home": {
            "readme.txt": "Welcome to WebOS!",
            "notes.txt": "Type something here...",
            "Projects": {
                "game.js": "console.log('My game');",
                "todo.txt": "1. Build OS\n2. Rule the world"
            }
        }
    };
    // Update clock
    function updateClock() {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString();
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Toggle start menu
    startButton.addEventListener('click', function() {
        startMenu.classList.toggle('hidden');
    });

    // Hide start menu when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (!startButton.contains(e.target) && !startMenu.contains(e.target)) {
            startMenu.classList.add('hidden');
        }
    });

    // Handle desktop icon clicks
    desktopIcons.addEventListener('click', function(e) {
        if (e.target.closest('.icon')) {
            const icon = e.target.closest('.icon');
            const app = icon.dataset.app;
            openApp(app);
        }
    });

    // Handle start menu item clicks
    startMenu.addEventListener('click', function(e) {
        if (e.target.classList.contains('start-menu-item')) {
            const app = e.target.dataset.app;
            openApp(app);
            startMenu.classList.add('hidden');
        }
    });

    // Open app function
    function openApp(appName) {
        if (window.apps[appName]) {
            const app = window.apps[appName];
            createWindow(appName, app.title, app.content, app.width, app.height, app.icon);
        }
    }

    // Create window
    function createWindow(appName, title, content, width = 400, height = 300, icon = '') {
        const windowDiv = document.createElement('div');
        windowDiv.className = 'window';
        windowDiv.dataset.app = appName;
        windowDiv.style.width = width + 'px';
        windowDiv.style.height = height + 'px';
        windowDiv.style.left = Math.random() * (window.innerWidth - width) + 'px';
        windowDiv.style.top = Math.random() * (window.innerHeight - height - 40) + 'px';

        const header = document.createElement('div');
        header.className = 'window-header';
        header.innerHTML = `
            <span>${title}</span>
            <div class="window-controls">
                <div class="window-control minimize" title="Minimize"></div>
                <div class="window-control maximize" title="Maximize"></div>
                <div class="window-control close" title="Close"></div>
            </div>
        `;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'window-content';
        contentDiv.innerHTML = content;

        windowDiv.appendChild(header);
        windowDiv.appendChild(contentDiv);
        document.getElementById('windows-container').appendChild(windowDiv);
        // Browser functionality
    if (appName === "file-explorer") {
        let currentPath = ["Home"];

        const folderView = windowDiv.querySelector("#folder-view");
        const fileView = windowDiv.querySelector("#file-view");

        function getCurrentDir() {
            let dir = fileSystem;
            currentPath.forEach(p => dir = dir[p]);
            return dir;
        }

        function render() {
            const dir = getCurrentDir();

            folderView.innerHTML = `<b>${currentPath.join("/")}</b><hr>`;
            fileView.innerHTML = "";

            // Back button
            if (currentPath.length > 1) {
                const back = document.createElement("div");
                back.textContent = "⬅️ Back";
                back.style.cursor = "pointer";
                back.onclick = () => {
                    currentPath.pop();
                    render();
                };
                folderView.appendChild(back);
            }

            Object.keys(dir).forEach(name => {
                const item = document.createElement("div");
                item.style.cursor = "pointer";
                item.style.padding = "4px";

                if (typeof dir[name] === "object") {
                    item.textContent = "📁 " + name;
                    item.onclick = () => {
                        currentPath.push(name);
                        render();
                    };
                } else {
                    item.textContent = "📄 " + name;
                    item.onclick = () => {
                        openFile(name, dir[name]);
                    };
                }

                fileView.appendChild(item);
            });
        }

        function openFile(name, content) {
            createWindow("notepad", name, `<textarea style="width:100%; height:100%;">${content}</textarea>`, 500, 400);
        }

        render();
    }
    if (appName === "browser") {
        setTimeout(() => {
            const input = windowDiv.querySelector("#browser-input");
            const button = windowDiv.querySelector("#browser-go");
            const frame = windowDiv.querySelector("#browser-frame");

            function loadSearch() {
                let query = input.value.trim();
                if (!query) return;

                let url;

                if (query.startsWith("http")) {
                    url = query;
                } else if (query.includes(".")) {
                    url = "https://" + query;
                } else {
                    url = "https://duckduckgo.com/?q=" + encodeURIComponent(query);
                }

                window.open(url, "_blank");
            }

            button.addEventListener("click", loadSearch);

            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") loadSearch();
            });

            // Default page
            
        }, 100);
    }

        // Manage taskbar
        updateTaskbar(appName, icon, windowDiv);

        // Window controls
        header.querySelector('.minimize').addEventListener('click', () => minimizeWindow(windowDiv));
        header.querySelector('.maximize').addEventListener('click', () => maximizeWindow(windowDiv));
        header.querySelector('.close').addEventListener('click', () => closeWindow(windowDiv));

        // Make window draggable
        makeDraggable(windowDiv, header);

        // Bring to front
        bringToFront(windowDiv);
    }

    function updateTaskbar(appName, icon, windowDiv) {
        if (!windowsByApp[appName]) {
            windowsByApp[appName] = [];
        }
        windowsByApp[appName].push(windowDiv);

        let taskbarApp = document.querySelector(`.taskbar-app[data-app="${appName}"]`);
        if (!taskbarApp) {
            taskbarApp = document.createElement('div');
            taskbarApp.className = 'taskbar-app';
            taskbarApp.dataset.app = appName;
            taskbarApp.innerHTML = icon;
            taskbarApps.appendChild(taskbarApp);
        }

        // Update display
        const count = windowsByApp[appName].length;
        if (count > 1) {
            taskbarApp.innerHTML = `${icon} <span class="count">${count}</span>`;
        } else {
            taskbarApp.innerHTML = icon;
        }

        // Click to show list if multiple, else toggle
        taskbarApp.addEventListener("mouseenter", () => {
            clearTimeout(hideTimeout);
            showWindowPreview(taskbarApp, appName);
        });
        
    }

    function closeWindow(windowDiv) {
        const appName = windowDiv.dataset.app;
        windowDiv.remove();
        // Remove from list
        windowsByApp[appName] = windowsByApp[appName].filter(w => w !== windowDiv);
        if (windowsByApp[appName].length === 0) {
            delete windowsByApp[appName];
            const taskbarApp = document.querySelector(`.taskbar-app[data-app="${appName}"]`);
            if (taskbarApp) taskbarApp.remove();
        } else {
            updateTaskbar(appName, window.apps[appName].icon, null); // Update count
        }
    }

    function showWindowPreview(taskbarApp, appName) {
        const windows = windowsByApp[appName];
        if (!windows || windows.length === 0) return;

        windowListPopup.innerHTML = "";

        windows.forEach((w, i) => {
            const item = document.createElement("div");
            item.className = "window-preview-item";

            item.innerHTML = `
                <div class="preview-title">
                    ${window.apps[appName].title} ${windows.length > 1 ? i + 1 : ""}
                </div>
            `;

            item.addEventListener("click", () => {
                w.classList.remove("minimized");
                bringToFront(w);
                updateTaskbarAppActive(appName);
                hideWindowList();
            });

            windowListPopup.appendChild(item);
        });

        const rect = taskbarApp.getBoundingClientRect();
        windowListPopup.style.bottom = "60px";
        const popupWidth = windowListPopup.offsetWidth;
        const iconCenter = rect.left + rect.width / 2;

        windowListPopup.style.left = (iconCenter - popupWidth / 2) + "px";

        windowListPopup.classList.remove("hidden");
        // wait for DOM to render
        requestAnimationFrame(() => {
            const popupWidth = windowListPopup.offsetWidth;
            const iconCenter = rect.left + rect.width / 2;

            windowListPopup.style.left = (iconCenter - popupWidth / 2) + "px";
        });
    }

    function hideWindowList() {
        windowListPopup.classList.add('hidden');
    }

    function minimizeWindow(windowDiv) {
        windowDiv.classList.add('minimized');
        updateTaskbarAppActive(windowDiv.dataset.app);
    }

    function maximizeWindow(windowDiv) {
        if (windowDiv.classList.contains('maximized')) {
            // Restore original size and position
            windowDiv.style.width = windowDiv.dataset.originalWidth + 'px';
            windowDiv.style.height = windowDiv.dataset.originalHeight + 'px';
            windowDiv.style.left = windowDiv.dataset.originalLeft + 'px';
            windowDiv.style.top = windowDiv.dataset.originalTop + 'px';
            windowDiv.classList.remove('maximized');
        } else {
            // Store original values
            windowDiv.dataset.originalWidth = windowDiv.offsetWidth;
            windowDiv.dataset.originalHeight = windowDiv.offsetHeight;
            windowDiv.dataset.originalLeft = windowDiv.offsetLeft;
            windowDiv.dataset.originalTop = windowDiv.offsetTop;
            windowDiv.classList.add('maximized');
        }
    }

    function closeWindow(windowDiv, taskbarApp) {
        const appName = windowDiv.dataset.app;
        windowDiv.remove();
        // Remove from list
        windowsByApp[appName] = windowsByApp[appName].filter(w => w !== windowDiv);
        if (windowsByApp[appName].length === 0) {
            delete windowsByApp[appName];
            const taskbarApp = document.querySelector(`.taskbar-app[data-app="${appName}"]`);
            if (taskbarApp) taskbarApp.remove();
        } else {
            updateTaskbar(appName, window.apps[appName].icon, null); // Update count
            updateTaskbarAppActive(appName);
        }
    }

    function toggleWindow(windowDiv) {
        if (windowDiv.classList.contains('minimized')) {
            windowDiv.classList.remove('minimized');
            bringToFront(windowDiv);
            updateTaskbarAppActive(windowDiv.dataset.app);
        } else {
            minimizeWindow(windowDiv);
        }
    }

    function bringToFront(windowDiv) {
        const windows = document.querySelectorAll('.window');
        windows.forEach(w => w.style.zIndex = 10);
        windowDiv.style.zIndex = 11;
        updateTaskbarAppActive(windowDiv.dataset.app);
    }

    function updateTaskbarAppActive(appName) {
        const taskbarApp = document.querySelector(`.taskbar-app[data-app="${appName}"]`);
        if (taskbarApp) {
            const hasActive = windowsByApp[appName].some(w => !w.classList.contains('minimized'));
            taskbarApp.classList.toggle('active', hasActive);
        }
    }

    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
            bringToFront(element);
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
});