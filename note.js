class NoteManager {
    constructor() {
        this.notesContainer = document.getElementById('notesContainer');
        this.initialize();
    }

    initialize() {
        this.renderNotes();
    }

    renderNotes() {
        // Sort notes: pinned first, then by date
        const sortedNotes = [...notesData].sort((a, b) => {
            if (a.isPinned !== b.isPinned) return b.isPinned - a.isPinned;
            return new Date(b.dateCreated) - new Date(a.dateCreated);
        });

        this.notesContainer.innerHTML = sortedNotes.map(note => this.createNoteCard(note)).join('');
        this.addNoteEventListeners();
    }

    createNoteCard(note) {
        const formattedContent = utils.formatContent(note.description);
        const dateCreated = utils.formatDate(note.dateCreated);

        return `
            <div class="card note-card" 
                 data-id="${note.id}"
                 data-subject="${note.subject}"
                 data-title="${note.title}"
                 data-subtitle="${note.subtitle}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <h5 class="card-title">${note.title}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${note.subtitle}</h6>
                            <div class="text-muted small">
                             ID: ${note.id} |  Subject: ${note.subject} | Compiled by: ${note.compiler} | Created: ${dateCreated}
                            </div>
                        </div>
                        <div class="note-actions">
                            <button class="btn btn-sm btn-outline-primary edit-note">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-warning toggle-pin ${note.isPinned ? 'active' : ''}">
                                <i class="fas fa-thumbtack"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-success print-note">
                                <i class="fas fa-print"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger delete-note">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="note-content ${formattedContent.length > 300 ? 'collapsed' : ''}">${formattedContent}</div>
                    ${formattedContent.length > 300 ? 
                        '<div class="read-more">Read More</div>' : ''}
                </div>
            </div>
        `;
    }

    addNoteEventListeners() {
        // Edit note
        document.querySelectorAll('.edit-note').forEach(button => {
            button.addEventListener('click', (e) => {
                const noteId = e.target.closest('.note-card').dataset.id;
                const note = notesData.find(n => n.id === parseInt(noteId));
                if (note) {
                    formManager.editNote(note);
                }
            });
        });

        // Toggle pin
        document.querySelectorAll('.toggle-pin').forEach(button => {
            button.addEventListener('click', (e) => {
                const noteId = e.target.closest('.note-card').dataset.id;
                const note = notesData.find(n => n.id === parseInt(noteId));
                if (note) {
                    note.isPinned = !note.isPinned;
                    this.renderNotes();
                }
            });
        });

        // Print note
        document.querySelectorAll('.print-note').forEach(button => {
            button.addEventListener('click', (e) => {
                const noteCard = e.target.closest('.note-card');
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
                            }
                        </style>
                    </head>
                    <body>
                        <div class="${noteCard.classList}">
                            ${noteCard.innerHTML}
                        </div>
                    </body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.print();
            });
        });

        // Delete note
        document.querySelectorAll('.delete-note').forEach(button => {
            button.addEventListener('click', (e) => {
                if (confirm('Are you sure you want to delete this note?')) {
                    const noteId = e.target.closest('.note-card').dataset.id;
                    const index = notesData.findIndex(n => n.id === parseInt(noteId));
                    if (index !== -1) {
                        notesData.splice(index, 1);
                        this.renderNotes();
                    }
                }
            });
        });

        // Read more/less
        document.querySelectorAll('.read-more').forEach(button => {
            button.addEventListener('click', (e) => {
                const content = e.target.previousElementSibling;
                content.classList.toggle('collapsed');
                e.target.textContent = content.classList.contains('collapsed') ? 
                    'Read More' : 'Read Less';
            });
        });
    }
}

// Initialize note management
const noteManager = new NoteManager();
