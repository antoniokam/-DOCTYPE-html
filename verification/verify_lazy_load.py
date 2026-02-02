import os
import sys
from playwright.sync_api import sync_playwright

def test_lazy_load():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Load the file
        filepath = os.path.abspath("!DOCTYPE html.html")
        page.goto(f"file://{filepath}")

        # 1. Verify libraries are NOT loaded initially
        print("Checking initial state...")
        is_jspdf_present = page.evaluate("() => window.jspdf !== undefined")
        is_html2canvas_present = page.evaluate("() => window.html2canvas !== undefined")

        failed = False

        if is_jspdf_present:
            print("FAILURE: window.jspdf is defined initially.")
            failed = True
        else:
            print("SUCCESS: window.jspdf is undefined initially.")

        if is_html2canvas_present:
            print("FAILURE: window.html2canvas is defined initially.")
            failed = True
        else:
            print("SUCCESS: window.html2canvas is undefined initially.")

        # 2. Trigger Export
        print("Triggering Export PDF...")
        # Check if Generate button is visible (it should be part of initial render)
        if page.is_visible("#generate-report-btn"):
             print("Clicking Generate Report button...")
             page.click("#generate-report-btn")

        # Wait for Export button
        try:
            page.wait_for_selector("#export-pdf-btn", timeout=5000)
            print("Export button found.")
            page.click("#export-pdf-btn")
        except Exception as e:
            print(f"Error finding/clicking export button: {e}")
            sys.exit(1)

        # 3. Wait for libraries to load
        print("Waiting for libraries to load...")
        try:
            page.wait_for_function("() => window.jspdf !== undefined", timeout=10000)
            print("SUCCESS: window.jspdf loaded.")
        except Exception as e:
            print(f"FAILURE: window.jspdf did not load in time: {e}")
            failed = True

        # Take screenshot
        page.screenshot(path="verification/lazy_load_success.png")

        browser.close()

        if failed:
            sys.exit(1)
        else:
            print("VERIFICATION PASSED")
            sys.exit(0)

if __name__ == "__main__":
    test_lazy_load()
