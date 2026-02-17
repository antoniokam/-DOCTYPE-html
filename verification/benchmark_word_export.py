import os
import time
import urllib.parse
from playwright.sync_api import sync_playwright
import pathlib

def run_benchmark():
    file_path = os.path.abspath("!DOCTYPE html.html")
    file_uri = pathlib.Path(file_path).as_uri()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Listen to console logs
        # page.on("console", lambda msg: print(f"PAGE CONSOLE: {msg.text}"))

        page.goto(file_uri)
        time.sleep(2)

        # Force render if needed
        html = page.evaluate("document.getElementById('report-preview-container') ? document.getElementById('report-preview-container').innerHTML : ''")
        if len(html) < 100:
             page.evaluate("if (typeof renderReportPreview === 'function') renderReportPreview();")
             time.sleep(1)

        # Inject large content (20MB)
        page.evaluate("""() => {
            const container = document.getElementById('report-preview-container');
            if (!container) {
                document.body.innerHTML += '<div id="report-preview-container"><div id="report-preview-content"></div></div>';
            } else if (!document.getElementById('report-preview-content')) {
                container.innerHTML = '<div id="report-preview-content"></div>';
            }

            const contentDiv = document.getElementById('report-preview-content');
            const largeString = 'A'.repeat(20 * 1024 * 1024);
            contentDiv.innerHTML = `<h1>Large Report Benchmark</h1><p>${largeString}</p>`;
        }""")

        # Mock download and capture href
        href = page.evaluate("""() => {
             let lastHref = '';
             const originalCreateElement = document.createElement;
             document.createElement = function(tagName) {
                 if (!tagName || typeof tagName !== 'string') {
                     try { return originalCreateElement.call(document, tagName); } catch (e) { return null; }
                 }
                 const element = originalCreateElement.call(document, tagName);
                 if (tagName.toLowerCase() === 'a') {
                     element.click = function() {
                         lastHref = this.href;
                         console.log("Download link clicked (mocked), href length: " + this.href.length);
                     };
                 }
                 return element;
             };

             exportToWord();
             return lastHref;
        }""")

        print(f"Captured href starts with: {href[:50]}...")
        if href.startswith("blob:"):
            print("Verified: href is a blob URL.")
        elif href.startswith("data:"):
            print("Verified: href is a data URI.")
        else:
            print(f"Unknown href format: {href[:20]}")

        browser.close()

if __name__ == "__main__":
    try:
        run_benchmark()
    except Exception as e:
        print(f"Benchmark failed: {e}")
