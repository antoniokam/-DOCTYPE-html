from playwright.sync_api import sync_playwright
import os

HTML_FILE = os.path.abspath('!DOCTYPE html.html')
URL = f'file://{HTML_FILE}'

def verify_lazy_loading():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Load the page
        print(f"Navigating to {URL}...")
        page.goto(URL)

        # 2. Verify scripts are NOT present initially
        print("Verifying absence of heavy scripts on initial load...")
        scripts_to_check = [
            'jspdf.umd.min.js',
            'html2canvas.min.js',
            'pdf.min.js',
            'mammoth.browser.min.js'
        ]

        content = page.content()
        initial_check_passed = True
        for script in scripts_to_check:
            if script in content:
                # Note: They might be in the source code as string literals in the loadScript calls.
                # We need to check if they are loaded as script tags in the DOM.
                count = page.locator(f'script[src*="{script}"]').count()
                if count > 0:
                    print(f"FAILED: Found {script} in DOM on initial load.")
                    initial_check_passed = False
                else:
                    print(f"PASSED: {script} not found in DOM.")
            else:
                 print(f"PASSED: {script} not found in HTML content.")

        if not initial_check_passed:
            print("Initial verification failed. Optimization not applied correctly?")
            browser.close()
            return

        # 3. Trigger PDF Generation to test lazy loading
        print("Triggering PDF export to test lazy loading...")

        # Need to ensure the template is rendered and button exists
        page.wait_for_selector('#export-pdf-btn')

        # Intercept network requests (file:// requests are tricky, but we can check DOM changes)
        page.click('#export-pdf-btn')

        # Wait for the modal or some indication that loading started/finished
        # The script shows a modal "Caricamento librerie PDF..." then "Generazione PDF..."

        print("Waiting for scripts to be injected...")
        page.wait_for_timeout(3000) # Give it time to inject and load

        # 4. Verify scripts ARE present after trigger
        print("Verifying presence of PDF scripts after trigger...")
        pdf_scripts = ['jspdf.umd.min.js', 'html2canvas.min.js']
        final_check_passed = True

        for script in pdf_scripts:
            # We check the DOM for the injected script tag
            count = page.locator(f'script[src*="{script}"]').count()
            if count > 0:
                print(f"PASSED: {script} successfully injected.")
            else:
                print(f"FAILED: {script} NOT found in DOM after trigger.")
                final_check_passed = False

        page.screenshot(path='verification_lazy_load.png')
        print("Screenshot saved to verification_lazy_load.png")

        browser.close()

if __name__ == '__main__':
    verify_lazy_loading()
