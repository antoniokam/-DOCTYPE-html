from playwright.sync_api import sync_playwright
import os
import sys

def test_lazy_load():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Load local file
        file_path = os.path.abspath("!DOCTYPE html.html")
        page.goto(f"file://{file_path}")

        # 1. Verify scripts are NOT present initially
        scripts_to_check = [
            "jspdf",
            "html2canvas",
            "pdf.js",
            "mammoth",
            "tinymce"
        ]

        failed = False
        print("Checking initial state...")
        for script in scripts_to_check:
            count = page.evaluate(f"document.querySelectorAll('script[src*=\"{script}\"]').length")
            if count == 0:
                print(f"✅ {script} is NOT loaded initially.")
            else:
                print(f"❌ {script} IS loaded initially (FAIL).")
                failed = True

        # 2. Trigger interaction to load TinyMCE (click a requirement)
        print("Clicking a requirement to trigger TinyMCE load...")
        try:
            # Locate the link for BP-1 in the sidebar
            link = page.locator("a[data-dr-id='BP-1']")
            if link.count() > 0:
                link.click()
                print("Clicked BP-1 link.")

                # Wait for script to load (polling check)
                # We can wait for the script tag to appear
                try:
                    page.wait_for_selector('script[src*="tinymce"]', timeout=10000)
                    print("✅ TinyMCE script appeared in DOM.")
                except:
                    print("❌ TinyMCE script did NOT appear in DOM within timeout.")
                    failed = True
            else:
                print("Could not find BP-1 link.")
                failed = True

        except Exception as e:
            print(f"Interaction failed: {e}")
            failed = True

        page.screenshot(path="verification/verification.png")
        browser.close()

        if failed:
            sys.exit(1)

if __name__ == "__main__":
    test_lazy_load()
