#!/usr/bin/env python3
"""
Simple HTTP server to run WebOS locally.
Run this script and open http://localhost:8000 in your browser.
"""
import http.server
import socketserver
import os

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

os.chdir(os.path.dirname(__file__))

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving WebOS at http://localhost:{PORT}")
    print("Press Ctrl+C to stop")
    httpd.serve_forever()