from playwright.sync_api import sync_playwright
import os
import sys

def test_lazy_load():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))
        page.on("pageerror", lambda exc: print(f"Browser Error: {exc}"))

        file_path = os.path.abspath("!DOCTYPE html.html")
        page.goto(f"file://{file_path}")

        # Click BP-1
        try:
            link = page.locator("a[data-dr-id='BP-1']")
            if link.count() > 0:
                link.click()
                print("Clicked BP-1 link.")

                # Wait for script to load
                try:
                    page.wait_for_selector('script[src*="tinymce"]', timeout=20000)
                    print("✅ TinyMCE script appeared in DOM.")
                except:
                    print("❌ TinyMCE script did NOT appear in DOM within timeout.")
                    # Dump head content
                    head_html = page.evaluate("document.head.innerHTML")
                    print(f"Head HTML: {head_html[:500]}...") # Print first 500 chars
            else:
                print("Could not find BP-1 link.")

        except Exception as e:
            print(f"Interaction failed: {e}")

        browser.close()

if __name__ == "__main__":
    test_lazy_load()
