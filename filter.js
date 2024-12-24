class FilterManager {
    constructor() {
        this.subjectFilter = document.getElementById('subjectFilter');
        this.titleFilter = document.getElementById('titleFilter');
        this.subtitleFilter = document.getElementById('subtitleFilter');
        
        this.initialize();
    }

    initialize() {
        this.updateFilterOptions();
        
        // Add event listeners
        this.subjectFilter.addEventListener('change', () => {
            this.updateFilterOptions();
            this.applyFilters();
        });
        
        this.titleFilter.addEventListener('change', () => {
            this.updateSubtitleOptions();
            this.applyFilters();
        });
        
        this.subtitleFilter.addEventListener('change', () => this.applyFilters());
    }

    updateFilterOptions() {
        const selectedSubject = this.subjectFilter.value;
        
        // Update subject filter
        const subjects = ['all', ...new Set(notesData.map(note => note.subject))];
        this.updateSelect(this.subjectFilter, subjects);
        this.subjectFilter.value = selectedSubject;

        // Update title filter based on selected subject
        const filteredNotes = selectedSubject === 'all' ? 
            notesData : 
            notesData.filter(note => note.subject === selectedSubject);
        
        const titles = ['all', ...new Set(filteredNotes.map(note => note.title))];
        this.updateSelect(this.titleFilter, titles);
        
        this.updateSubtitleOptions();
    }

    updateSubtitleOptions() {
        const selectedSubject = this.subjectFilter.value;
        const selectedTitle = this.titleFilter.value;
        
        let filteredNotes = notesData;
        if (selectedSubject !== 'all') {
            filteredNotes = filteredNotes.filter(note => note.subject === selectedSubject);
        }
        if (selectedTitle !== 'all') {
            filteredNotes = filteredNotes.filter(note => note.title === selectedTitle);
        }
        
        const subtitles = ['all', ...new Set(filteredNotes.map(note => note.subtitle))];
        this.updateSelect(this.subtitleFilter, subtitles);
    }

    updateSelect(select, options) {
        const value = select.value;
        select.innerHTML = options.map(option => 
            `<option value="${option}">${option === 'all' ? 'All' : option}</option>`
        ).join('');
        if (options.includes(value)) {
            select.value = value;
        }
    }

    applyFilters() {
        const subject = this.subjectFilter.value;
        const title = this.titleFilter.value;
        const subtitle = this.subtitleFilter.value;
        
        const notes = document.querySelectorAll('.note-card');
        notes.forEach(note => {
            const noteSubject = note.dataset.subject;
            const noteTitle = note.dataset.title;
            const noteSubtitle = note.dataset.subtitle;
            
            const showNote = (subject === 'all' || subject === noteSubject) &&
                           (title === 'all' || title === noteTitle) &&
                           (subtitle === 'all' || subtitle === noteSubtitle);
            
            note.style.display = showNote ? 'block' : 'none';
        });
    }
}

// Initialize filter functionality
new FilterManager();