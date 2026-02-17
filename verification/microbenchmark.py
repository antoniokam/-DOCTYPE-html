import os
import time
from playwright.sync_api import sync_playwright

def run_microbenchmark():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        result = page.evaluate("""() => {
            const size = 10 * 1024 * 1024; // 10MB
            // Create realistic HTML content
            const chunk = '<div class="test">Hello World & àèìòù</div> ';
            const count = Math.ceil(size / chunk.length);
            const str = chunk.repeat(count);

            const header = '<html><head><meta charset="utf-8"></head><body>';
            const footer = '</body></html>';
            const fullStr = header + str + footer;

            const t0 = performance.now();
            const encoded = encodeURIComponent(fullStr);
            const dataUri = 'data:application/vnd.ms-word;charset=utf-8,' + encoded;
            const t1 = performance.now();

            const t2 = performance.now();
            const blob = new Blob(['\ufeff', fullStr], {type: 'application/vnd.ms-word'});
            const url = URL.createObjectURL(blob);
            const t3 = performance.now();

            URL.revokeObjectURL(url);

            return {
                encodeTime: t1 - t0,
                blobTime: t3 - t2,
                encodedLength: dataUri.length,
                blobSize: blob.size
            };
        }""")

        print(f"Encode time (10MB HTML): {result['encodeTime']:.2f} ms")
        print(f"Blob time (10MB HTML): {result['blobTime']:.2f} ms")
        print(f"Encoded length: {result['encodedLength'] / 1024 / 1024:.2f} MB")
        print(f"Blob size: {result['blobSize'] / 1024 / 1024:.2f} MB")

        browser.close()

if __name__ == "__main__":
    run_microbenchmark()
