const puppeteer = require('C:\\temp_md2pdf\\node_modules\\puppeteer');
const path = require('path');

(async () => {
    let browser;
    try {
        console.log('Launching puppeteer...');
        browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        console.log('Opening HTML file...');
        await page.goto('file:///c:/xampp/venuesync/uml.html', { waitUntil: 'networkidle0' });
        
        // Wait an extra second for mermaid to finish rendering
        await new Promise(r => setTimeout(r, 2000));
        
        console.log('Taking screenshot for Use Case Diagram...');
        const useCaseEl = await page.$('#usecase-diagram');
        await useCaseEl.screenshot({ path: 'C:\\Users\\hassa\\OneDrive\\Desktop\\VenueSync_UseCase.png' });
        
        console.log('Taking screenshot for Class Diagram...');
        const classEl = await page.$('#class-diagram');
        await classEl.screenshot({ path: 'C:\\Users\\hassa\\OneDrive\\Desktop\\VenueSync_ClassDiagram.png' });
        
        console.log('Taking screenshot for Sequence Diagram...');
        const seqEl = await page.$('#sequence-diagram');
        await seqEl.screenshot({ path: 'C:\\Users\\hassa\\OneDrive\\Desktop\\VenueSync_SequenceDiagram.png' });
        
        console.log('Successfully saved PNGs to Desktop.');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        if (browser) await browser.close();
    }
})();
