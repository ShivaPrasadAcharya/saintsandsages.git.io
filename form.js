class FormManager {
    constructor() {
        this.form = document.getElementById('noteEntryForm');
        this.noteModal = new bootstrap.Modal(document.getElementById('noteForm'));
        this.codePreviewModal = new bootstrap.Modal(document.getElementById('codePreview'));
        
        this.initialize();
    }

    initialize() {
        // Save button
        document.getElementById('saveNote').addEventListener('click', () => this.saveNote());
        
        // Generate code button
        document.getElementById('generateCode').addEventListener('click', () => this.generateCode());
        
        // Preview button
        document.getElementById('previewBtn').addEventListener('click', () => this.previewNote());
        
        // Copy code button
        document.getElementById('copyCode').addEventListener('click', () => this.copyCode());
    }

    editNote(note) {
        this.form.noteId.value = note.id;
        this.form.subject.value = note.subject;
        this.form.title.value = note.title;
        this.form.subtitle.value = note.subtitle;
        this.form.description.value = note.description;
        this.form.compiler.value = note.compiler;
        
        this.noteModal.show();
        
        // Scroll to form
        document.getElementById('noteForm').scrollIntoView({ behavior: 'smooth' });
    }

    saveNote() {
        const formData = {
            id: parseInt(this.form.noteId.value) || utils.generateId(),
            subject: this.form.subject.value,
            title: this.form.title.value,
            subtitle: this.form.subtitle.value,
            description: this.form.description.value,
            compiler: this.form.compiler.value,
            dateCreated: utils.getCurrentDate(),
            isPinned: false
        };

        const existingIndex = notesData.findIndex(note => note.id === formData.id);
        if (existingIndex !== -1) {
            formData.isPinned = notesData[existingIndex].isPinned;
            notesData[existingIndex] = formData;
        } else {
            notesData.push(formData);
        }

        noteManager.renderNotes();
        this.noteModal.hide();
        this.resetForm();
    }

    generateCode() {
        const formData = {
            id: parseInt(this.form.noteId.value) || utils.generateId(),
            subject: this.form.subject.value,
            title: this.form.title.value,
            subtitle: this.form.subtitle.value,
            description: this.form.description.value,
            compiler: this.form.compiler.value,
            dateCreated: utils.getCurrentDate(),
            isPinned: false
        };

        const code = `{
            id: ${formData.id},
            subject: "${formData.subject}",
            title: "${formData.title}",
            subtitle: "${formData.subtitle}",
            description: "${formData.description.replace(/"/g, '\\"').replace(/\n/g, '\\n')}",
            compiler: "${formData.compiler}",
            dateCreated: "${formData.dateCreated}",
            isPinned: false
        }`;

        document.getElementById('generatedCode').textContent = code;
        this.codePreviewModal.show();
    }

    previewNote() {
        const formData = {
            id: parseInt(this.form.noteId.value) || utils.generateId(),
            subject: this.form.subject.value,
            title: this.form.title.value,
            subtitle: this.form.subtitle.value,
            description: this.form.description.value,
            compiler: this.form.compiler.value,
            dateCreated: utils.getCurrentDate(),
            isPinned: false
        };

        const previewWindow = window.open('', '_blank');
        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Preview Note</title>
                <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css" rel="stylesheet">
                <link href="styles.css" rel="stylesheet">
            </head>
            <body>
                <div class="container mt-4">
                    ${noteManager.createNoteCard(formData)}
                </div>
            </body>
            </html>
        `);
        previewWindow.document.close();
    }

    copyCode() {
        const code = document.getElementById('generatedCode').textContent;
        navigator.clipboard.writeText(code).then(() => {
            alert('Code copied to clipboard!');
        });
    }

    resetForm() {
        this.form.reset();
        this.form.noteId.value = '';
    }
}

// Initialize form management
const formManager = new FormManager();