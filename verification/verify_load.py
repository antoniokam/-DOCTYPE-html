from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Absolute path to file
        cwd = os.getcwd()
        filepath = f"file://{cwd}/!DOCTYPE html.html"

        print(f"Navigating to {filepath}")
        page.goto(filepath)

        # Check title
        print(f"Title: {page.title()}")

        # Check that heavy scripts are NOT in the head
        # We can check by selector
        # They were: jspdf, html2canvas, pdf.js, mammoth

        scripts = page.locator('head script').all()
        found_heavy = False
        for s in scripts:
            src = s.get_attribute('src')
            if src:
                # print(f"Found script: {src}")
                if "jspdf" in src or "html2canvas" in src or "mammoth" in src or "pdf.js" in src:
                     print(f"ERROR: Found heavy script that should be lazy loaded: {src}")
                     found_heavy = True

        if found_heavy:
            exit(1)
        else:
            print("SUCCESS: No heavy scripts found in head.")

        # Take screenshot of initial state
        page.screenshot(path="verification/initial_load.png")
        print("Screenshot saved to verification/initial_load.png")

        browser.close()

if __name__ == "__main__":
    run()
