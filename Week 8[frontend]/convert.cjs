const { mdToPdf } = require('C:\\temp_md2pdf\\node_modules\\md-to-pdf');

(async () => {
    try {
        await mdToPdf({ path: 'c:\\xampp\\venuesync\\VenueSync_UserManual.md' }, { dest: 'C:\\Users\\hassa\\OneDrive\\Desktop\\VenueSync_UserManual.pdf' });
        console.log('Done converting to PDF.');
    } catch (err) {
        console.error('Error generating PDF:', err);
    }
})();
