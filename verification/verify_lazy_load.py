
import os
from playwright.sync_api import sync_playwright, expect

def verify_lazy_load():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Monitor network
        jspdf_requested = False
        def handle_request(request):
            nonlocal jspdf_requested
            if 'jspdf' in request.url:
                print(f"Network request detected: {request.url}")
                jspdf_requested = True

        page.on("request", handle_request)

        abs_path = os.path.abspath('!DOCTYPE html.html')
        url = f'file://{abs_path}'
        print(f"Navigating to: {url}")

        page.goto(url)

        # 1. Check initial state
        if jspdf_requested:
            print("FAILURE: jsPDF requested during page load.")
        else:
            print("SUCCESS: jsPDF NOT requested during page load.")

        # 2. Generate Report to reveal Export button
        print("Clicking Generate Report...")
        try:
            generate_btn = page.locator('#generate-report-btn')
            expect(generate_btn).to_be_visible(timeout=5000)
            generate_btn.click()

            # 3. Click Export PDF
            print("Waiting for Export button...")
            export_btn = page.locator('#export-pdf-btn')
            expect(export_btn).to_be_visible(timeout=5000)

            print("Clicking Export PDF...")
            export_btn.click()

            # Wait for library to load
            page.wait_for_timeout(5000)

            if jspdf_requested:
                print("SUCCESS: jsPDF requested after export click.")
            else:
                print("FAILURE: jsPDF NOT requested after export click.")

            page.screenshot(path='verification/lazy_load_result.png')

        except Exception as e:
            print(f"Error during interaction: {e}")
            page.screenshot(path='verification/error.png')

        browser.close()

if __name__ == "__main__":
    verify_lazy_load()
