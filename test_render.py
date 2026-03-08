import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Get absolute path to the file
        file_path = f"file://{os.path.abspath('!DOCTYPE html.html')}"

        await page.goto(file_path, wait_until='networkidle')

        # Click the generate report button to trigger renderReportPreview
        await page.click('#generate-report-btn')

        # Wait a bit
        await page.wait_for_timeout(2000)

        # Check if preview is rendered
        preview_content = await page.inner_text('#report-preview-content')
        if "Bilancio di Sostenibilità 2024" in preview_content:
            print("Report preview rendered successfully.")
        else:
            print("Failed to render report preview.")

        await browser.close()

asyncio.run(main())
