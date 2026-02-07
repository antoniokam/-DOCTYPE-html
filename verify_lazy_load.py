from playwright.sync_api import sync_playwright
import os
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Track network requests
        requests = []
        page.on("request", lambda request: requests.append(request.url))

        # 1. Load the page
        print("Loading page...")
        filepath = os.path.abspath("!DOCTYPE html.html")
        page.goto(f"file://{filepath}")

        # Wait for initial render
        page.wait_for_selector("h1:has-text('Piattaforma Reporting Sostenibilità ESRS')")
        print("Page loaded.")

        # 2. Check initial requests
        # We need to give a moment for any potential sync scripts to fire (if they were there)
        time.sleep(2)

        tinymce_loaded = any("tinymce.min.js" in url for url in requests)
        jspdf_loaded = any("jspdf.umd.min.js" in url for url in requests)

        print(f"TinyMCE loaded initially: {tinymce_loaded}")
        print(f"jsPDF loaded initially: {jspdf_loaded}")

        if tinymce_loaded:
            print("FAILURE: TinyMCE should not be loaded initially.")
        else:
            print("SUCCESS: TinyMCE deferred.")

        if jspdf_loaded:
            print("FAILURE: jsPDF should not be loaded initially.")
        else:
            print("SUCCESS: jsPDF deferred.")

        # 3. Trigger TinyMCE load by navigating to a DR
        print("Navigating to a DR...")

        # The link for BP-1
        link = page.locator("a[data-dr-id='BP-1']").first
        if link.count() > 0:
            print("Found BP-1 link. Clicking...")

            # We expect a request to tinymce
            with page.expect_request(lambda request: "tinymce.min.js" in request.url) as request_info:
                link.click()

            print("TinyMCE request detected.")

            # Wait for editor to initialize (class tox-tinymce)
            page.wait_for_selector(".tox-tinymce", timeout=15000)
            print("TinyMCE editor visible.")

            page.screenshot(path="verification_lazy_load.png")
        else:
            print("BP-1 link not found. Sidebar might not be rendered correctly.")
            # Take screenshot to see what's wrong
            page.screenshot(path="verification_failed.png")

        browser.close()

if __name__ == "__main__":
    run()
