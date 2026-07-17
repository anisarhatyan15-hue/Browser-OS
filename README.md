# Browser-Based Operating System 

A lightweight, fully functional client-side Operating System simulation built entirely inside the browser using modern web technologies. This project showcases dynamic window management, a virtual file system, and custom runtime integration.

##  Key Features

**Custom GUI Environment:** Interactive desktop with a dynamic window manager (drag, minimize, maximize, close) built from scratch using Vanilla JavaScript.
**Persistent File System:** Virtual file explorer utilizing browser `localStorage` for permanent data storage, folder creation, and directory navigation.
**WebAssembly Python Engine :** A built-in Python 3.11 IDE powered by **Pyodide**. It compiles and executes real Python scripts directly in the browser's sandbox via WebAssembly, complete with dynamic standard output (`stdout`) redirection.
**System Process Monitor:** Real-time Task Manager tracking open windows, active application memory, and system processes.
**Data Portability:** Native JSON encoding to backup and restore the entire OS state, including the file system and user configurations.

## Tech Stack

**Frontend:** HTML5, CSS3 (Modern Flexbox, Grid, and Custom Animations), Vanilla JavaScript (ES6+)
**Core Runtimes:** WebAssembly (Wasm via Pyodide CDN)
**Storage Engine:** Browser LocalStorage & Virtual IO String Buffers

## How to Run Locally

Since this is a 100% client-side application, you don't need to install any external backend servers or Node.js packages.

1. Clone or download this repository.
2. Open the `index.html` file in any modern web browser (Chrome, Edge, Firefox, Safari).
3. *Note for Python IDE:* Make sure you have an active internet connection when opening the Python app, as it fetches the Pyodide WebAssembly runtime dynamically.