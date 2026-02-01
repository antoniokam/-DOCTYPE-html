import sys
import threading
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright
import urllib.parse

# Start a simple server
def start_server():
    server = HTTPServer(('localhost', 8083), SimpleHTTPRequestHandler)
    server.serve_forever()

server_thread = threading.Thread(target=start_server, daemon=True)
server_thread.start()
time.sleep(1) # Wait for server

try:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        file_name = "!DOCTYPE html.html"
        url_path = urllib.parse.quote(file_name)
        print(f"Navigating to http://localhost:8083/{url_path}")
        page.goto(f"http://localhost:8083/{url_path}")
        page.wait_for_load_state("networkidle")

        # Open Editor
        print("Opening editor...")
        page.click("a[data-dr-id='BP-1']")

        # Wait for editor to appear
        # The editor iframe usually has a class 'tox-edit-area__iframe' or similar
        print("Waiting for editor...")
        page.wait_for_selector(".tox-tinymce", timeout=10000)

        # Take screenshot
        page.screenshot(path="verification/editor_loaded.png")
        print("Screenshot saved to verification/editor_loaded.png")

        browser.close()

except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
