from playwright.sync_api import sync_playwright
import os
import time

HTML_FILE = os.path.abspath('!DOCTYPE html.html')
URL = f'file://{HTML_FILE}'

def verify_lazy_loading():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print(f"Navigating to {URL}...")
        page.goto(URL)

        # 1. Verify scripts are NOT present initially
        print("Verifying absence of heavy scripts on initial load...")
        scripts_to_check = [
            'jspdf.umd.min.js',
            'html2canvas.min.js',
            'pdf.min.js',
            'mammoth.browser.min.js'
        ]

        initial_check_passed = True
        for script in scripts_to_check:
            # Check if script tag exists in DOM with that src
            count = page.locator(f'script[src*="{script}"]').count()
            if count > 0:
                print(f"[FAIL] Found {script} in DOM on initial load.")
                initial_check_passed = False
            else:
                print(f"[PASS] {script} not found in DOM.")

        if not initial_check_passed:
            print("Initial verification failed. Optimization not applied correctly?")
            browser.close()
            return

        # 2. Generate Report to make Export button visible
        print("Generating report preview...")
        # Ensure the generate button is visible and clickable
        page.wait_for_selector('#generate-report-btn', state='visible')
        page.click('#generate-report-btn')

        # 3. Trigger PDF Export
        print("Triggering PDF export...")
        page.wait_for_selector('#export-pdf-btn', state='visible')
        page.click('#export-pdf-btn')

        print("Waiting for scripts to be injected (5s)...")
        time.sleep(5)

        # 4. Verify scripts ARE present after trigger
        print("Verifying presence of PDF scripts after trigger...")
        pdf_scripts = ['jspdf.umd.min.js', 'html2canvas.min.js']
        final_check_passed = True

        for script in pdf_scripts:
            count = page.locator(f'script[src*="{script}"]').count()
            if count > 0:
                print(f"[PASS] {script} successfully injected.")
            else:
                print(f"[FAIL] {script} NOT found in DOM after trigger.")
                final_check_passed = False

        if final_check_passed:
            print("\nSUCCESS: Lazy loading optimization verified!")
        else:
            print("\nFAILURE: Scripts were not lazy loaded correctly.")

        page.screenshot(path='verification_lazy_load.png')
        browser.close()

if __name__ == '__main__':
    verify_lazy_loading()
