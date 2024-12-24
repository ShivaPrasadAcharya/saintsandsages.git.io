// Main application class to handle initialization and global events
class App {
    constructor() {
        this.initialize();
    }

    initialize() {
        // Handle scroll events for the fixed navigation
        window.addEventListener('scroll', this.handleScroll);
        
        // Initialize double column print functionality
        this.initializePrintLayout();
        
        // Handle modal events to reset form
        document.getElementById('noteForm').addEventListener('hidden.bs.modal', () => {
            formManager.resetForm();
        });
    }

    handleScroll() {
        const nav = document.getElementById('topNav');
        const scrollTop = window.scrollY;
        
        // Add shadow and reduce height when scrolling
        if (scrollTop > 0) {
            nav.classList.add('shadow');
            nav.style.height = '50px';
        } else {
            nav.classList.remove('shadow');
            nav.style.height = 'var(--nav-height)';
        }
    }

    initializePrintLayout() {
        // Add print layout controls to each print button
        document.querySelectorAll('.print-note').forEach(button => {
            const dropdown = document.createElement('div');
            dropdown.className = 'dropdown d-inline-block';
            dropdown.innerHTML = `
                <button class="btn btn-sm btn-outline-success dropdown-toggle" 
                        type="button" 
                        data-bs-toggle="dropdown">
                    <i class="fas fa-print"></i>
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item print-single">Single Column</a></li>
                    <li><a class="dropdown-item print-double">Double Column</a></li>
                </ul>
            `;

            // Replace original print button
            button.parentNode.replaceChild(dropdown, button);
        });

        // Add event listeners for print options
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('print-single')) {
                this.printNote(e.target.closest('.note-card'), false);
            } else if (e.target.classList.contains('print-double')) {
                this.printNote(e.target.closest('.note-card'), true);
            }
        });
    }

    printNote(noteCard, doubleColumn) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Print Note</title>
                <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css" rel="stylesheet">
                <link href="styles.css" rel="stylesheet">
                <style>
                    body { padding: 20px; }
                    @media print {
                        body { padding: 0; }
                        .note-actions { display: none; }
                        ${doubleColumn ? '.card-body { column-count: 2; column-gap: 2rem; }' : ''}
                    }
                </style>
            </head>
            <body>
                <div class="${noteCard.classList}">
                    ${noteCard.innerHTML}
                </div>
                <script>
                    window.onload = () => window.print();
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new App();
});