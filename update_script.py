import re

with open('!DOCTYPE html.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Update handleFileImport
search_import = """            try {
                let content = '';
                if (file.name.endsWith('.docx')) {
                    const arrayBuffer = await file.arrayBuffer();
                    const result = await mammoth.convertToHtml({ arrayBuffer });
                    content = result.value;
                } else if (file.name.endsWith('.pdf')) {
                    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;
                    const arrayBuffer = await file.arrayBuffer();
                    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;"""

replace_import = """            try {
                let content = '';
                if (file.name.endsWith('.docx')) {
                    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js');
                    const arrayBuffer = await file.arrayBuffer();
                    const result = await mammoth.convertToHtml({ arrayBuffer });
                    content = result.value;
                } else if (file.name.endsWith('.pdf')) {
                    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js');
                    window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;
                    const arrayBuffer = await file.arrayBuffer();
                    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;"""

if search_import in content:
    content = content.replace(search_import, replace_import)
    print("handleFileImport updated")
else:
    print("handleFileImport block not found")

# Update exportToPdf
# I will use a regex or string match for the function definition start and end logic is complicated to match whole block if indentation varies.
# But I can match the start of the function and the initial lines.

search_export = """        function exportToPdf() {
            const { jsPDF } = window.jspdf;
            const reportContent = document.getElementById("report-preview-content");

            showModal('Generazione PDF in corso...', 'Esportazione');

            html2canvas(reportContent, { scale: 2, windowWidth: reportContent.scrollWidth, windowHeight: reportContent.scrollHeight }).then(canvas => {"""

replace_export = """        async function exportToPdf() {
            try {
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');

                const { jsPDF } = window.jspdf;
                const reportContent = document.getElementById("report-preview-content");

                showModal('Generazione PDF in corso...', 'Esportazione');

                html2canvas(reportContent, { scale: 2, windowWidth: reportContent.scrollWidth, windowHeight: reportContent.scrollHeight }).then(canvas => {"""

if search_export in content:
    content = content.replace(search_export, replace_export)
    print("exportToPdf updated start")

    # I also need to close the try block. The function ends with:
    #                 pdf.save("bilancio_sostenibilita_cm_service.pdf");
    #                 showModal('PDF esportato con successo!', 'Esportazione Completata');
    #             });
    #         }

    search_export_end = """                pdf.save("bilancio_sostenibilita_cm_service.pdf");
                showModal('PDF esportato con successo!', 'Esportazione Completata');
            });
        }"""

    replace_export_end = """                pdf.save("bilancio_sostenibilita_cm_service.pdf");
                showModal('PDF esportato con successo!', 'Esportazione Completata');
            });
            } catch (error) {
                console.error("Export error:", error);
                showModal("Errore durante il caricamento delle librerie di esportazione.", "Errore");
            }
        }"""

    if search_export_end in content:
        content = content.replace(search_export_end, replace_export_end)
        print("exportToPdf updated end")
    else:
        print("exportToPdf end block not found")

else:
    print("exportToPdf start block not found")

with open('!DOCTYPE html.html', 'w', encoding='utf-8') as f:
    f.write(content)
