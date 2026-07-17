// class WindowManager {
//     constructor(){
//         this.desktop = document.getElementById('desktop');
//         this.startBtn = document.getElementById('start-btn');
//         this.clockEl = document.getElementById('clock');
        
//         this.init();
//     }

//     init(){
//         this.startBtn.addEventListener('click', () =>{
//             this.createWindow('Ողջույն', '<p>Բարի գալուստ քո սեփական Browser OS: Սա առաջին պատուհանն է։</p>');
//         });

//         this.updateClock();
//         setInterval(() => this.updateClock(), 1000);
//     }
//     updateClock() {
//         const now = new Date();
//         const hours = String(now.getHours()).padStart(2, '0');
//         const minutes = String(now.getMinutes()).padStart(2, '0');
//         this.clockEl.textContent = `${hours}:${minutes}`;
//     }

//     createWindow(title, contentHTML){
//         const win = document.createElement('div');
//         win.className = 'os-window';
//         win.style.top = '100px';
//         win.style.left = '100px';

//         win.innerHTML =`
//             <div class="window-header">
//                 <span class="window-title">${title}</span>
//                 <button class="close-btn">X</button>
//             </div>
//             <div class="window-content">${contentHTML}</div>`;

//         this.desktop.appendChild(win);
//         this.makeDraggable(win);

//         win.querySelector('.close-btn').addEventListener('click', () => {
//             win.remove();
//         });

//     }
//     makeDraggable(win) {
//         const header = win.querySelector('.window-header');
//         let isDragging = false;
//         let currentX, currentY, initialX, initialY;

//         header.addEventListener('mousedown', (e) => {
//             isDragging = true;

//         initialX = e.clientX - win.offsetLeft;
//         initialY = e.clientY - win.offsetTop;

//         document.querySelectorAll('.os-window').forEach(w => w.style.zIndex = 1);
//         win.style.zIndex = 10;
//     });

//     document.addEventListener('mousemove', (e) => {
//         if (!isDragging) return;

//         e.preventDefault();

//         currentX = e.clientX - initialX;
//         currentY = e.clientY - initialY;

//         win.style.left = `${currentX}px`;
//         win.style.top = `${currentY}px`;
//     });

//     document.addEventListener('mouseup', () => {
//         isDragging = false;
//     });
// }
// }

// // window.addEventListener('DOMContentLoaded', () => {
// //     new WindowManager();
// // });        


const VIRTUAL_DISK = JSON.parse(localStorage.getItem('os_virtual_disk')) || [];

const saveDiskToStorage = () => {
    localStorage.setItem('os_virtual_disk', JSON.stringify(VIRTUAL_DISK));
};
const APPS = {
    notes: {
        title: "Notes (Նոթատետր)",
        icon: "📝",
        getContent: () => `<textarea class="notes-textarea" placeholder="Գրիր այստեղ..."></textarea>`
    },
    paint: {
        title: "Paint (Նկարչություն)",
        icon: "🎨",
        getContent: () => `
            <div class="paint-container">
                <div class="paint-toolbar">
                    <input type="color" class="paint-color" value="#000000"> <!-- Գույն -->
                    <input type="range" class="paint-size" min="1" max="20" value="5"> <!-- Վրձնի չափս -->
                    <button class="paint-clear">Ջնջել</button> <!-- Մաքրելու կոճակ -->
                </div>
                <canvas class="paint-canvas"></canvas>
            </div>
        `,
        init: (winElement) => {
            const canvas = winElement.querySelector('.paint-canvas');
            const ctx = canvas.getContext('2d'); 
            const colorPicker = winElement.querySelector('.paint-color');
            const sizePicker = winElement.querySelector('.paint-size');
            const clearBtn = winElement.querySelector('.paint-clear');

            canvas.width = 350;
            canvas.height = 220;

            let isDrawing = false; 

            canvas.addEventListener('mousedown', (e) => {
                isDrawing = true;
                ctx.beginPath(); 
                ctx.moveTo(e.offsetX, e.offsetY); 
            });

            canvas.addEventListener('mousemove', (e) => {
                if (!isDrawing) return; 
                ctx.lineTo(e.offsetX, e.offsetY); 
                ctx.strokeStyle = colorPicker.value; 
                ctx.lineWidth = sizePicker.value; 
                ctx.lineCap = 'round'; 
                ctx.stroke();
            });

            canvas.addEventListener('mouseup', () => isDrawing = false);
            canvas.addEventListener('mouseleave', () => isDrawing = false);

            clearBtn.addEventListener('click', () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            });
        }
    },
    pythonRunner: {
    title: "Python IDE",
    icon: "🐍",
    getContent: () => `
        <div style="padding: 10px; background: #1a1a1a; color: #fff; height: 100%; box-sizing: border-box; display: flex; flex-direction: column; font-family: monospace;">  
        <div style="margin-bottom: 8px; display: flex; gap: 10px; align-items: center;">
                <button id="py-run-btn" style="background: #28a745; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;">Run Code ▶</button>
                <span id="py-status" style="color: #ffc107; font-size: 12px;">Սպասեք, Python-ը բեռնվում է...</span>
            </div>
            <textarea id="py-code-input" style="flex-grow: 1; background: #2d2d2d; color: #f8f8f2; border: 1px solid #444; padding: 10px; font-family: monospace; font-size: 14px; resize: none; outline: none; border-radius: 4px;"># Գրիր Python կոդ այստեղ
def greet(name):
    return f"Բարև, {name}! Ողջույն Python-ից՝ WebAssembly-ի միջոցով:"

for i in range(3):
    print(f"Ցիկլ {i+1}")

print(greet("Ծրագրավորող"))
</textarea>
        <div style="margin-top: 8px; font-weight: bold; color: #00adb5; font-size: 12px;">OUTPUT (Կոնսոլ):</div>
            <div id="py-output" style="height: 120px; background: #000; color: #00ff00; padding: 8px; overflow-y: auto; border-radius: 4px; white-space: pre-wrap; margin-top: 4px;"></div>
        </div>
    `,
    init: (winElement) => {
        const runBtn = winElement.querySelector('#py-run-btn');
        const statusText = winElement.querySelector('#py-status');
        const codeInput = winElement.querySelector('#py-code-input');
        const outputBox = winElement.querySelector('#py-output');

        runBtn.disabled = true;

        const initPyodide = async () => {
            try{
                if (!window.pyodideInstance){
                    window.pyodideInstance = await loadPyodide();
                }
                statusText.textContent = "Python 3.11";
                statusText.style.color = "#28a745";
                runBtn.disabled = false;
            }catch (err){
                statusText.textContent = "Error";
                statusText.style.color = "#dc3545";
                outputBox.textContent = err.message;
            }
        };
        runBtn.addEventListener('click', async () => {
            outputBox.textContent = "It is being launched...\n";
            try {
                window.pyodideInstance.runPython(`
                    import sys
                    import io
                    sys.stdout = io.StringIO()
                    sys.stderr = io.StringIO() 
                `);

                const code = codeInput.value;
                await window.pyodideInstance.runPythonAsync(code);

                const stdout = window.pyodideInstance.runPython("sys.stdout.getvalue()");
                const stderr = window.pyodideInstance.runPython("sys.stderr.getvalue()");

                outputBox.textContent = stdout;
                if (stderr) {
                        outputBox.textContent += "\nՍԽԱԼ:\n" + stderr;
                    }
            } catch (err) {
                    outputBox.textContent += "\nRuntime Error:\n" + err.message;
                }
            

        });
        initPyodide();
    }
    },
    controlPanel: {
        title: "Control Panel",
        icon: "⚙️",
        getContent: () => `
            <div style="padding: 15px; background: #f4f6f9; color: #333; height: 100%; box-sizing: border-box; font-family: sans-serif; display: flex; flex-direction: column; gap: 15px;">
                <h3 style="margin: 0; color: #222; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Համակարգի Հիշողություն</h3>
                <div style="background: #ddd; border-radius: 8px; height: 20px; width: 100%; overflow: hidden; position: relative;">
                    <div id="disk-progress-bar" style="background: #00adb5; height: 100%; width: 0%; transition: width 0.3s;"></div>
                </div>
                <div id="disk-usage-text" style="font-size: 13px; color: #555;">Օգտագործված է՝ 0 KB / 5120 KB (Local Storage-ի սահմանաչափ)</div>
                
                <h3 style="margin: 10px 0 0 0; color: #222; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Տվյալների Պահուստավորում (Backup)</h3>
                <div style="display: flex; gap: 10px;">
                    <button id="btn-export-db" style="background: #28a745; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 13px;">Արտահանել (Export JSON)</button>
                    <label style="background: #007bff; color: white; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 13px; display: inline-block;">
                        Ներմուծել (Import JSON)
                        <input type="file" id="btn-import-db" accept=".json" style="display: none;" />
                    </label>
                </div>
            </div>
        `,
        init: (winElement) => {
            const progressBar = winElement.querySelector('#disk-progress-bar');
            const usageText = winElement.querySelector('#disk-usage-text');
            const exportBtn = winElement.querySelector('#btn-export-db');
            const importInput = winElement.querySelector('#btn-import-db');

            const updateDiskStats = () => {
                const rawString = localStorage.getItem('os_virtual_disk') || '[]';
                const bytes = rawString.length * 2; 
                const kilobytes = (bytes / 1024).toFixed(2);
                const maxStorageKB = 5120;
                const percentage = ((kilobytes / maxStorageKB) * 100).toFixed(1);

                progressBar.style.width = `${percentage}%`;
                usageText.textContent = `Օգտագործված է՝ ${kilobytes} KB / ${maxStorageKB} KB (${percentage}%)`;
            };

            exportBtn.addEventListener('click', () => {
                const dataStr = JSON.stringify(VIRTUAL_DISK, null, 2);
                const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
                const exportFileDefaultName = `os_backup_${new Date().toISOString().slice(0,10)}.json`;
                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', exportFileDefaultName);
                linkElement.click();
            });

            importInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const parsedData = JSON.parse(event.target.result);
                        if (Array.isArray(parsedData)) {
                            VIRTUAL_DISK.length = 0;
                            parsedData.forEach(item => VIRTUAL_DISK.push(item));
                            if (typeof saveDiskToStorage === 'function') saveDiskToStorage();
                            updateDiskStats();
                            alert('Տվյալները հաջողությամբ վերականգնվեցին։ Թարմացրեք File Manager-ը։');
                        } else {
                            alert('Սխալ: Ֆայլի կառուցվածքը անվավեր է:');
                        }
                    } catch (err) {
                        alert('Սխալ: Ֆայլը կարդալիս խնդիր առաջացավ:');
                    }
                };
                reader.readAsText(file);
            });

            updateDiskStats();
        }
    },
    controlPanel: {
        title: "Control Panel",
        icon: "⚙️",
        getContent: () => `
            <div style="padding: 15px; background: #f4f6f9; color: #333; height: 100%; box-sizing: border-box; font-family: sans-serif; display: flex; flex-direction: column; gap: 15px;">
                <h3 style="margin: 0; color: #222; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Համակարգի Հիշողություն</h3>
                <div style="background: #ddd; border-radius: 8px; height: 20px; width: 100%; overflow: hidden; position: relative;">
                    <div id="disk-progress-bar" style="background: #00adb5; height: 100%; width: 0%; transition: width 0.3s;"></div>
                </div>
                <div id="disk-usage-text" style="font-size: 13px; color: #555;">Օգտագործված է՝ 0 KB / 5120 KB (Local Storage-ի սահմանաչափ)</div>
                
                <h3 style="margin: 10px 0 0 0; color: #222; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Տվյալների Պահուստավորում (Backup)</h3>
                <div style="display: flex; gap: 10px;">
                    <button id="btn-export-db" style="background: #28a745; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 13px;">Արտահանել (Export JSON)</button>
                    <label style="background: #007bff; color: white; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 13px; display: inline-block;">
                        Ներմուծել (Import JSON)
                        <input type="file" id="btn-import-db" accept=".json" style="display: none;" />
                    </label>
                </div>
            </div>
        `,
        init: (winElement) => {
            const progressBar = winElement.querySelector('#disk-progress-bar');
            const usageText = winElement.querySelector('#disk-usage-text');
            const exportBtn = winElement.querySelector('#btn-export-db');
            const importInput = winElement.querySelector('#btn-import-db');

            const updateDiskStats = () => {
                const rawString = localStorage.getItem('os_virtual_disk') || '[]';
                const bytes = rawString.length * 2; 
                const kilobytes = (bytes / 1024).toFixed(2);
                const maxStorageKB = 5120;
                const percentage = ((kilobytes / maxStorageKB) * 100).toFixed(1);

                progressBar.style.width = `${percentage}%`;
                usageText.textContent = `Օգտագործված է՝ ${kilobytes} KB / ${maxStorageKB} KB (${percentage}%)`;
            };

            exportBtn.addEventListener('click', () => {
                const dataStr = JSON.stringify(VIRTUAL_DISK, null, 2);
                const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
                const exportFileDefaultName = `os_backup_${new Date().toISOString().slice(0,10)}.json`;
                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', exportFileDefaultName);
                linkElement.click();
            });

            importInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const parsedData = JSON.parse(event.target.result);
                        if (Array.isArray(parsedData)) {
                            VIRTUAL_DISK.length = 0;
                            parsedData.forEach(item => VIRTUAL_DISK.push(item));
                            if (typeof saveDiskToStorage === 'function') saveDiskToStorage();
                            updateDiskStats();
                            alert('Տվյալները հաջողությամբ վերականգնվեցին։ Թարմացրեք File Manager-ը։');
                        } else {
                            alert('Սխալ: Ֆայլի կառուցվածքը անվավեր է:');
                        }
                    } catch (err) {
                        alert('Սխալ: Ֆայլը կարդալիս խնդիր առաջացավ:');
                    }
                };
                reader.readAsText(file);
            });

            updateDiskStats();
        }
    },
    taskManager: {
        title: "Task Manager",
        icon: "📊",
        getContent: () => `
            <div style="padding: 10px; background: white; color: #333; height: 100%; box-sizing: border-box; display: flex; flex-direction: column;">
                <div style="font-weight: bold; font-size: 13px; border-bottom: 2px solid #00adb5; padding-bottom: 5px; margin-bottom: 10px; display: flex; justify-content: space-between;">
                    <span>Պրոցես (App)</span>
                    <span>PID</span>
                    <span>Գործողություն</span>
                </div>
                <div class="task-list-container" style="flex-grow: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 5px;"></div>
            </div>
        `,
        init: (winElement) => {
            const renderTasks = () => {
                const container = winElement.querySelector('.task-list-container');
                container.innerHTML = '';

                // Ստանում ենք WindowManager-ի մեջ ակտիվ պրոցեսները
                const processes = window.wm ? window.wm.getProcesses() : [];

                if (processes.length === 0) {
                    container.innerHTML = '<div style="color: #888; text-align: center; margin-top: 20px;">Ակտիվ պրոցեսներ չկան</div>';
                    return;
                }

                processes.forEach(proc => {
                    const row = document.createElement('div');
                    row.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 6px; background: #f5f5f5; border-radius: 4px; font-size: 13px;";
                    row.innerHTML = `
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <span>${proc.icon}</span>
                            <strong>${proc.title}</strong>
                        </div>
                        <span style="font-family: monospace; color: #666;">PID: ${proc.pid}</span>
                        <button class="kill-btn" data-pid="${proc.pid}" style="background: #ff4d4d; color: white; border: none; padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">Kill</button>
                    `;

                    row.querySelector('.kill-btn').addEventListener('click', (e) => {
                        const pidToKill = parseInt(e.target.getAttribute('data-pid'));
                        if (window.wm) {
                            window.wm.killProcess(pidToKill);
                        }
                    });

                    container.appendChild(row);
                });
            };

            // Լսում ենք համակարգային իրադարձությունները, որպեսզի Task Manager-ը ավտոմատ թարմանա
            window.addEventListener('processChanged', renderTasks);
            
            // Առաջին անգամ նկարել ցուցակը
            renderTasks();
        }
    },
    terminal: {
        title: "Terminal (Տերմինալ)",
        icon: "💻",
        getContent: () => `
            <div style="background: #1e1e1e; color: #00ff00; font-family: monospace; padding: 10px; height: 100%; box-sizing: border-box; overflow-y: auto; display: flex; flex-direction: column;">
                <div class="terminal-output" style="flex-grow: 1; white-space: pre-wrap; margin-bottom: 5px;">OS Terminal v1.0.0\nԳրիր 'help' հրամանների ցանկի համար:\n</div>
                <div style="display: flex;">
                    <span style="color: #00adb5; margin-right: 5px;">user@os:~$</span>
                    <input type="text" class="terminal-input" style="background: transparent; border: none; color: #00ff00; font-family: monospace; font-size: 14px; flex-grow: 1; outline: none;" autofocus />
                </div>
            </div>
        `,
        init: (winElement) => {
            const output = winElement.querySelector('.terminal-output');
            const input = winElement.querySelector('.terminal-input');

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const commandLine = input.value.trim();
                    input.value = '';
                    if (!commandLine) return;

                    output.textContent += `user@os:~$ ${commandLine}\n`;

                    const parts = commandLine.split(' ');
                    const cmd = parts[0].toLowerCase();
                    const arg = parts.slice(1).join(' ');

                    switch (cmd) {
                        case 'help':
                            output.textContent += "Հասանելի հրամաններ:\n  ls              - Ցուցադրել ֆայլերի ցանկը\n  cat [filename]  - Կարդալ ֆայլի պարունակությունը\n  touch [name]    - Ստեղծել նոր դատարկ ֆայլ\n  clear           - Մաքրել էկրանը\n  help            - Օգնություն\n";
                            break;
                        case 'ls':
                            if (VIRTUAL_DISK.length === 0) {
                                output.textContent += "(Դատարկ է. ֆայլեր չկան)\n";
                            } else {
                                VIRTUAL_DISK.forEach(file => {
                                    output.textContent += `📄 ${file.name}\n`;
                                });
                            }
                            break;
                        case 'cat':
                            if (!arg) {
                                output.textContent += "Նշիր ֆայլի անունը: Օրինակ՝ cat note.txt\n";
                            } else {
                                const file = VIRTUAL_DISK.find(f => f.name.toLowerCase() === arg.toLowerCase());
                                if (file) {
                                    output.textContent += `${file.content || '(Ֆայլը դատարկ է)'}\n`;
                                } else {
                                    output.textContent += `Սխալ: '${arg}' անունով ֆայլ չգտնվեց:\n`;
                                }
                            }
                            break;
                        case 'touch':
                            if (!arg) {
                                output.textContent += "Նշիր ստեղծվող ֆայլի անունը: Օրինակ՝ touch text.txt\n";
                            } else {
                                const exists = VIRTUAL_DISK.some(f => f.name.toLowerCase() === arg.toLowerCase());
                                if (exists) {
                                    output.textContent += `Սխալ: '${arg}' անունով ֆայլ արդեն կա:\n`;
                                } else {
                                    VIRTUAL_DISK.push({
                                        id: 'file-' + Math.random().toString(36).substr(2, 9),
                                        name: arg,
                                        content: ''
                                    });
                                    if (typeof saveDiskToStorage === 'function') saveDiskToStorage();
                                    output.textContent += `'${arg}' ֆայլը հաջողությամբ ստեղծվեց:\n`;
                                }
                            }
                            break;
                        case 'clear':
                            output.textContent = '';
                            break;
                        default:
                            output.textContent += `Հրամանը չի ճանաչվել: '${cmd}'. Գրիր 'help' ցանկը տեսնելու համար:\n`;
                    }

                    winElement.querySelector('div').scrollTop = winElement.querySelector('div').scrollHeight;
                }
            });
        }
    },
    
    calendar: {
        title: "Calendar (Օրացույց)",
        icon: "📅",
        getContent: () => `
            <div style="padding: 15px; color: #333; background: white; height: 100%; box-sizing: border-box; display: flex; flex-direction: column;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <button class="win-cal-btn win-cal-prev"><</button>
                    <div class="win-calendar-month-year" style="color: #00adb5; font-weight: bold; font-size: 16px;"></div>
                    <button class="win-cal-btn win-cal-next">></button>
                </div>
                <div class="calendar-weekdays" style="display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-weight: 600; font-size: 12px; color: #666; margin-bottom: 10px;">
                    <div>Երկ</div><div>Երք</div><div>Չոր</div><div>Հնգ</div><div>Ուրբ</div><div>Շբթ</div><div>Կիր</div>
                </div>
                <div class="win-calendar-days-container" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; text-align: center; font-size: 14px;"></div>
            </div>
        `,
        init: (winElement) => {
            let viewDate = new Date();

            const renderWinCalendar = () => {
                const year = viewDate.getFullYear();
                const month = viewDate.getMonth();
                const today = new Date().getDate();
                const isCurrentMonth = month === new Date().getMonth() && year === new Date().getFullYear();

                const monthNames = ["Հունվար", "Փետրվար", "Մարտ", "Ապրիլ", "Մայիս", "Հունիս", "Հուլիս", "Օգոստոս", "Սեպտեմբեր", "Հոկտեմբեր", "Նոյեմբեր", "Դեկտեմբեր"];
                winElement.querySelector('.win-calendar-month-year').textContent = `${monthNames[month]} ${year}`;

                const firstDayIndex = new Date(year, month, 1).getDay();
                const shiftDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
                const lastDay = new Date(year, month + 1, 0).getDate();
                const prevLastDay = new Date(year, month, 0).getDate();

                const daysContainer = winElement.querySelector('.win-calendar-days-container');
                daysContainer.innerHTML = '';

                for (let i = shiftDayIndex; i > 0; i--) {
                    const dayDiv = document.createElement('div');
                    dayDiv.className = 'calendar-day other-month';
                    dayDiv.style.padding = '8px 0';
                    dayDiv.textContent = prevLastDay - i + 1;
                    daysContainer.appendChild(dayDiv);
                }

                for (let day = 1; day <= lastDay; day++) {
                    const dayDiv = document.createElement('div');
                    dayDiv.className = 'calendar-day';
                    dayDiv.style.padding = '8px 0';
                    dayDiv.style.borderRadius = '6px';
                    dayDiv.textContent = day;

                    if (day === today && isCurrentMonth) {
                        dayDiv.style.background = '#00adb5';
                        dayDiv.style.color = 'white';
                        dayDiv.style.fontWeight = 'bold';
                    } else {
                        dayDiv.style.color = '#333';
                    }

                    daysContainer.appendChild(dayDiv);
                }

                const totalCells = shiftDayIndex + lastDay;
                const nextMonthDays = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
                for (let day = 1; day <= nextMonthDays; day++) {
                    const dayDiv = document.createElement('div');
                    dayDiv.className = 'calendar-day other-month';
                    dayDiv.style.padding = '8px 0';
                    dayDiv.textContent = day;
                    daysContainer.appendChild(dayDiv);
                }
            };

            winElement.querySelector('.win-cal-prev').addEventListener('click', (e) => {
                e.stopPropagation();
                viewDate.setMonth(viewDate.getMonth() - 1);
                renderWinCalendar();
            });

            winElement.querySelector('.win-cal-next').addEventListener('click', (e) => {
                e.stopPropagation();
                viewDate.setMonth(viewDate.getMonth() + 1);
                renderWinCalendar();
            });

            renderWinCalendar();
        }
    },
    fileManager: {
        title: "File Manager (Ֆայլեր)",
        icon: "📁",
        getContent: () => `
            <div class="file-manager-container">
                <div class="file-manager-toolbar">
                    <button class="file-manager-btn create-file-btn">+ Նոր Ֆայլ</button>
                </div>
                <div class="file-manager-files"></div>
            </div>
        `,
        init: (winElement) => {
            const filesContainer = winElement.querySelector('.file-manager-files');
            const createFileBtn = winElement.querySelector('.create-file-btn');

            const renderFiles = () => {
                filesContainer.innerHTML = '';
                
                VIRTUAL_DISK.forEach((file, index) => {
                    const fileEl = document.createElement('div');
                    fileEl.className = 'file-item';
                    fileEl.innerHTML = `
                        <button class="file-delete-btn">×</button>
                        <div class="file-icon">📄</div>
                        <div class="file-name">${file.name}</div>
                    `;

                    fileEl.addEventListener('dblclick', () => {
                        const event = new CustomEvent('openFile', { detail: file });
                        window.dispatchEvent(event);
                    });

                    const deleteBtn = fileEl.querySelector('.file-delete-btn');
                    deleteBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (confirm(`Ցանկանո՞ւմ եք ջնջել ${file.name} ֆայլը։`)) {
                            VIRTUAL_DISK.splice(index, 1);
                            saveDiskToStorage();
                            renderFiles();
                        }
                    });

                    filesContainer.appendChild(fileEl);
                });
            };

            createFileBtn.addEventListener('click', () => {
                const fileName = prompt('Գրիր ֆայլի անունը:');
                if (!fileName) return;

                VIRTUAL_DISK.push({
                    id: 'file-' + Math.random().toString(36).substr(2, 9),
                    name: fileName,
                    content: ''
                });
                saveDiskToStorage();
                renderFiles();
            });

            renderFiles();
        }
    },
    browser: {
        title: "Browser (Բրաուզեր)",
        icon: "🌐",
        getContent: () => `
            <div class="browser-container">
                <div class="browser-navbar">
                    <input type="text" class="browser-input" placeholder="Գրիր կայքի հասցեն (օրինակ՝ wikipedia.org)..." />
                    <button class="browser-btn">Գնալ</button>
                </div>
                <iframe class="browser-content" src="about:blank"></iframe>
            </div>
        `,
        init: (winElement) => {
            const input = winElement.querySelector('.browser-input');
            const btn = winElement.querySelector('.browser-btn');
            const iframe = winElement.querySelector('.browser-content');

            const loadUrl = () => {
                let url = input.value.trim();
                
                if (url === '') return;

                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    url = 'https://' + url;
                    input.value = url;
                }

                iframe.src = url;
            };

            btn.addEventListener('click', loadUrl);

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    loadUrl();
                }
            });
        }
    },
    calculator: {
        title: "Calculator (Հաշվիչ)",
        icon: "🧮",
        getContent: () => `
            <div style="height: 100%; display: flex; flex-direction: column;">
                <input type="text" class="calc-display" readonly value="0" />
                <div class="calc-grid">
                    <button class="calc-btn">C</button>
                    <button class="calc-btn">/</button>
                    <button class="calc-btn">*</button>
                    <button class="calc-btn">-</button>
                    <button class="calc-btn">7</button>
                    <button class="calc-btn">8</button>
                    <button class="calc-btn">9</button>
                    <button class="calc-btn operator">+</button>
                    <button class="calc-btn">4</button>
                    <button class="calc-btn">5</button>
                    <button class="calc-btn">6</button>
                    <button class="calc-btn operator">=</button>
                    <button class="calc-btn">1</button>
                    <button class="calc-btn">2</button>
                    <button class="calc-btn">3</button>
                    <button class="calc-btn">0</button>
                </div>
            </div>
        `,
        init: (winElement) => {
            const display = winElement.querySelector('.calc-display');
            const buttons = winElement.querySelectorAll('.calc-btn');
            let currentInput = '';

            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const val = btn.innerText;
                    if (val === 'C') {
                        currentInput = '';
                        display.value = '0';
                    } else if (val === '=') {
                        try {
                            display.value = eval(currentInput) || '0';
                            currentInput = display.value;
                        } catch {
                            display.value = 'Սխալ';
                            currentInput = '';
                        }
                    } else {
                        if (display.value === '0') currentInput = '';
                        currentInput += val;
                        display.value = currentInput;
                    }
                });
            });
        }
    }
};


class WindowManager {
    constructor() {
        this.desktop = document.getElementById('desktop');
        this.startBtn = document.getElementById('start-btn'); 
        this.clockEl = document.getElementById('clock');
        this.processes = []; 
        window.wm = this;
        this.init();
    }

    init() {
        
        this.iconsContainer = document.createElement('div');
       // this.iconsContainer.className = 'desktop-icons-container';
        this.desktop.appendChild(this.iconsContainer);
        
        Object.keys(APPS).forEach(appKey => {
            this.createDesktopIcon(appKey);
        });

       
        this.startMenu = document.createElement('div');
        this.startMenu.className = 'start-menu';
        this.startMenu.style.display = 'none'; 
        
        let menuHTML = '<div class="start-menu-title">Հավելվածներ</div>';
        Object.keys(APPS).forEach(appKey => {
            menuHTML += `
                <div class="start-menu-item" data-app="${appKey}">
                    <span class="start-item-icon">${APPS[appKey].icon}</span>
                    <span class="start-item-title">${APPS[appKey].title}</span>
                </div>`;
        });
        this.startMenu.innerHTML = menuHTML;
        this.desktop.appendChild(this.startMenu);

        if (this.startBtn) {
            this.startBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.startMenu.style.display = this.startMenu.style.display === 'none' ? 'block' : 'none';
            });
        }

        this.startMenu.querySelectorAll('.start-menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const appKey = item.getAttribute('data-app');
                this.createWindow(appKey);
                this.startMenu.style.display = 'none';
            });
        });

        this.desktop.addEventListener('click', () => {
            this.startMenu.style.display = 'none';
        });

        this.updateClock();
       // setInterval(() => this.updateClock(), 1000);
       const clockEl = document.getElementById('clock');
        const calWidget = document.getElementById('calendar-widget');
        const prevBtn = document.getElementById('cal-prev-btn');
        const nextBtn = document.getElementById('cal-next-btn');

        let currentCalendarDate = new Date();

        const updateClock = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            clockEl.textContent = `${hours}:${minutes}`;
        };
        setInterval(updateClock, 1000);
        updateClock();

        const renderCalendar = (date) => {
            const year = date.getFullYear();
            const month = date.getMonth();
            const today = new Date().getDate();
            const isCurrentMonth = month === new Date().getMonth() && year === new Date().getFullYear();

            const monthNames = ["Հունվար", "Փետրվար", "Մարտ", "Ապրիլ", "Մայիս", "Հունիս", "Հուլիս", "Օգոստոս", "Սեպտեմբեր", "Հոկտեմբեր", "Նոյեմբեր", "Դեկտեմբեր"];
            document.getElementById('calendar-month-year').textContent = `${monthNames[month]} ${year}`;

            const firstDayIndex = new Date(year, month, 1).getDay();
            const shiftDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
            const lastDay = new Date(year, month + 1, 0).getDate();
            const prevLastDay = new Date(year, month, 0).getDate();

            const daysContainer = document.getElementById('calendar-days-container');
            daysContainer.innerHTML = '';

            for (let i = shiftDayIndex; i > 0; i--) {
                const dayDiv = document.createElement('div');
                dayDiv.className = 'calendar-day other-month';
                dayDiv.textContent = prevLastDay - i + 1;
                daysContainer.appendChild(dayDiv);
            }

            for (let day = 1; day <= lastDay; day++) {
                const dayDiv = document.createElement('div');
                dayDiv.className = 'calendar-day';
                dayDiv.textContent = day;

                if (day === today && isCurrentMonth) {
                    dayDiv.className = 'calendar-day today';
                }

                daysContainer.appendChild(dayDiv);
            }

            const totalCells = shiftDayIndex + lastDay;
            const nextMonthDays = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
            for (let day = 1; day <= nextMonthDays; day++) {
                const dayDiv = document.createElement('div');
                dayDiv.className = 'calendar-day other-month';
                dayDiv.textContent = day;
                daysContainer.appendChild(dayDiv);
            }
        };

        clockEl.addEventListener('click', (e) => {
            e.stopPropagation();
            currentCalendarDate = new Date();
            renderCalendar(currentCalendarDate);
            calWidget.classList.toggle('show');
        });

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
                renderCalendar(currentCalendarDate);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
                renderCalendar(currentCalendarDate);
            });
        }

        document.addEventListener('click', (e) => {
            if (!calWidget.contains(e.target) && e.target !== clockEl) {
                calWidget.classList.remove('show');
            }
        });
        window.addEventListener('openApp', (e) => {
            this.createWindow(e.detail);
        });


        window.addEventListener('openFile', (e) => {
            const fileData = e.detail;
            
            this.createWindow('notes');
            
            const activeWindows = document.querySelectorAll('.os-window');
            const latestNotesWindow = activeWindows[activeWindows.length - 1];
            const textarea = latestNotesWindow.querySelector('.notes-textarea');
            const titleEl = latestNotesWindow.querySelector('.window-title');

            if (textarea) {
                titleEl.textContent = `Notes - ${fileData.name}`;
                textarea.value = fileData.content;

                textarea.addEventListener('input', () => {
                    fileData.content = textarea.value;
                    saveDiskToStorage();
                });
            }
        });
    }

    updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        this.clockEl.textContent = `${hours}:${minutes}`;
    }

    
createDesktopIcon(appKey) {
        const app = APPS[appKey];
        const icon = document.createElement('div');
        icon.className = 'desktop-icon';
        icon.innerHTML = `
            <div class="icon-img">${app.icon}</div>
            <div class="icon-text">${app.title.split(' ')[0]}</div>
        `;

        const iconWidth = 85;  
        const iconHeight = 95; 
        const startTop = 20;  
        const startLeft = 20;  
        
        
        const maxContentHeight = window.innerHeight - 100; 
        const iconsPerColumn = Math.max(1, Math.floor(maxContentHeight / iconHeight));

        
        const currentIconCount = this.iconsContainer.children.length;

      
        const row = currentIconCount % iconsPerColumn;
        const col = Math.floor(currentIconCount / iconsPerColumn);

    
        icon.style.position = 'absolute';
        icon.style.top = `${startTop + row * iconHeight}px`;
        icon.style.left = `${startLeft + col * iconWidth}px`;

        icon.addEventListener('dblclick', () => {
            this.createWindow(appKey);
        });

        this.iconsContainer.appendChild(icon);
        this.makeIconDraggable(icon);
    }
   createWindow(appKey) {
        const app = APPS[appKey];
        const win = document.createElement('div');
        win.className = 'os-window';
        
       
        if (!app) return;
        const pid = Math.floor(Math.random() * 9000) + 1000;
        this.processes.push({
            pid: pid,
            appKey: appKey,
            title: app.title,
            icon: app.icon,
            element: win 
        });
       window.dispatchEvent(new CustomEvent('processChanged'));



        const winId = 'win-' + Math.random().toString(36).substr(2, 9);
        win.setAttribute('id', winId);

        const randomX = 50 + Math.random() * 150;
        const randomY = 50 + Math.random() * 150;
        win.style.left = `${randomX}px`;
        win.style.top = `${randomY}px`;

        win.innerHTML = `
            <div class="window-header">
                <span class="window-title">${app.title}</span>
                <div class="window-controls">
                    <button class="minimize-btn">🗕</button>
                    <button class="maximize-btn">🗖</button>
                    <button class="close-btn">✕</button>
                </div>
            </div>
            <div class="window-content">${app.getContent()}</div>
        `;

        this.desktop.appendChild(win);
        this.makeDraggable(win);

        if (app.init) {
            app.init(win);
        }

        document.querySelectorAll('.os-window').forEach(w => w.style.zIndex = 10);
        win.style.zIndex = 20;

        win.addEventListener('mousedown', () => {
            document.querySelectorAll('.os-window').forEach(w => w.style.zIndex = 10);
            win.style.zIndex = 20;
            this.updateTaskbarActiveState(winId);
        });

        win.querySelector('.close-btn').addEventListener('click', () => {
            win.remove();
            const btn = document.getElementById('btn-' + winId);
            if (btn) btn.remove();
        });

        win.querySelector('.maximize-btn').addEventListener('click', () => {
            win.classList.toggle('maximized');
        });

        win.querySelector('.minimize-btn').addEventListener('click', () => {
            win.classList.add('minimized');
            const btn = document.getElementById('btn-' + winId);
            if (btn) btn.classList.remove('active');
        });

        this.addToTaskbar(winId, app.icon, app.title.split(' ')[0]);
    }


    getProcesses() {
        return this.processes;
    }

    killProcess(pid) {
        const procIndex = this.processes.findIndex(p => p.pid === pid);
        if (procIndex !== -1) {
            const proc = this.processes[procIndex];
            if (proc.element) {
                proc.element.remove(); 
            }
            this.processes.splice(procIndex, 1); 
            window.dispatchEvent(new CustomEvent('processChanged')); 
        }
    }



    addToTaskbar(winId, icon, title) {
        const taskbarAppsContainer = document.getElementById('taskbar-apps');
        if (!taskbarAppsContainer) return;

        const btn = document.createElement('button');
        btn.className = 'taskbar-app-btn active';
        btn.id = 'btn-' + winId;
        btn.innerHTML = `<span>${icon}</span> <span>${title}</span>`;

        btn.addEventListener('click', () => {
            const win = document.getElementById(winId);
            if (!win) return;

            if (win.classList.contains('minimized')) {
                win.classList.remove('minimized');
                document.querySelectorAll('.os-window').forEach(w => w.style.zIndex = 1);
                win.style.zIndex = 10;
                this.updateTaskbarActiveState(winId);
            } else {
                win.classList.add('minimized');
                btn.classList.remove('active');
            }
        });

        taskbarAppsContainer.appendChild(btn);
        this.updateTaskbarActiveState(winId);
    }

    updateTaskbarActiveState(activeWinId) {
        document.querySelectorAll('.taskbar-app-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.getElementById('btn-' + activeWinId);
        if (activeBtn) activeBtn.classList.add('active');
    }
    makeDraggable(win) {
        const header = win.querySelector('.window-header');
        let isDragging = false;
        let currentX, currentY, initialX, initialY;

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            initialX = e.clientX - win.offsetLeft;
            initialY = e.clientY - win.offsetTop;

            document.querySelectorAll('.os-window').forEach(w => w.style.zIndex = 1);
            win.style.zIndex = 10;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            win.style.left = `${currentX}px`;
            win.style.top = `${currentY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }
    makeIconDraggable(icon) {
        let isDragging = false;
        let currentX, currentY, initialX, initialY;
        

        icon.addEventListener('mousedown', (e) => {
            isDragging = true;
            initialX = e.clientX - icon.offsetLeft;
            initialY = e.clientY - icon.offsetTop;
            icon.style.zIndex = 5;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            
            icon.style.left = `${currentX}px`;
            icon.style.top = `${currentY}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                icon.style.zIndex = 2;
            }
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new WindowManager();
});