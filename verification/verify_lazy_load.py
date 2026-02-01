import sys
import threading
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright
import urllib.parse

# Start a simple server
def start_server():
    server = HTTPServer(('localhost', 8082), SimpleHTTPRequestHandler)
    server.serve_forever()

server_thread = threading.Thread(target=start_server, daemon=True)
server_thread.start()
time.sleep(1) # Wait for server

try:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Track loaded scripts
        loaded_scripts = set()
        page.on("request", lambda request: loaded_scripts.add(request.url))

        file_name = "!DOCTYPE html.html"
        url_path = urllib.parse.quote(file_name)
        print(f"Navigating to http://localhost:8082/{url_path}")
        page.goto(f"http://localhost:8082/{url_path}")
        page.wait_for_load_state("networkidle")

        # Check initial load
        heavy_libs = ["tinymce.min.js", "jspdf.umd.min.js", "html2canvas.min.js", "pdf.min.js", "mammoth.browser.min.js"]

        print("\n--- Initial Load Verification ---")
        initial_fail = False
        for lib in heavy_libs:
            found = any(lib in url for url in loaded_scripts)
            if found:
                print(f"[FAIL] {lib} loaded initially.")
                initial_fail = True
            else:
                print(f"[PASS] {lib} NOT loaded initially.")

        if initial_fail:
            print("ERROR: Initial lazy loading failed.")
            sys.exit(1)

        # Interaction 1: Load Editor (TinyMCE)
        print("\n--- Interaction: Load Editor ---")
        # We need to find a link to a DR. BP-1 is a good candidate.
        # But first we might need to ensure the report builder is visible?
        # The structure is initialized in init().
        # We need to click a link in the sidebar.

        # Wait for nav to populate
        page.wait_for_selector("aside#report-nav")

        # Click BP-1 link
        # It might be hidden in a collapsed menu?
        # ESRS 2 is usually open or we can just try to click the link if it exists in DOM.
        # renderReportBuilderNav builds the whole tree based on selection. ESRS 2 is selected by default.

        try:
            print("Clicking BP-1 link...")
            page.click("a[data-dr-id='BP-1']")

            # Wait for script load
            # Tinymce load might take a moment.
            page.wait_for_timeout(3000)

            # Check if tinymce loaded
            found_tinymce = any("tinymce.min.js" in url for url in loaded_scripts)
            if found_tinymce:
                print("[PASS] TinyMCE loaded after interaction.")
            else:
                print("[FAIL] TinyMCE NOT loaded after interaction.")
                sys.exit(1)
        except Exception as e:
            print(f"Interaction failed: {e}")
            # print page html for debug
            # print(page.content())
            sys.exit(1)

        # Interaction 2: Export PDF
        print("\n--- Interaction: Export PDF ---")
        try:
            print("Clicking Generate Report...")
            page.click("#generate-report-btn")

            print("Clicking Export PDF...")
            page.click("#export-pdf-btn")

            # Wait for script load
            page.wait_for_timeout(3000)

            found_jspdf = any("jspdf.umd.min.js" in url for url in loaded_scripts)
            found_html2canvas = any("html2canvas.min.js" in url for url in loaded_scripts)

            if found_jspdf:
                print("[PASS] jsPDF loaded.")
            else:
                print("[FAIL] jsPDF NOT loaded.")

            if found_html2canvas:
                print("[PASS] html2canvas loaded.")
            else:
                print("[FAIL] html2canvas NOT loaded.")

            if not (found_jspdf and found_html2canvas):
                sys.exit(1)

        except Exception as e:
            print(f"Export interaction failed: {e}")
            sys.exit(1)

        browser.close()
        print("\nSUCCESS: All verifications passed.")

except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
