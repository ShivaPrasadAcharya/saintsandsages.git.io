class SearchManager {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.searchResults = document.getElementById('searchResults');
        this.prevMatch = document.getElementById('prevMatch');
        this.nextMatch = document.getElementById('nextMatch');
        this.matchCount = document.getElementById('matchCount');
        this.currentMatchIndex = -1;
        this.matches = [];
        
        this.initialize();
    }

    initialize() {
        this.searchInput.addEventListener('input', () => this.handleSearch());
        this.prevMatch.addEventListener('click', () => this.navigateMatch(-1));
        this.nextMatch.addEventListener('click', () => this.navigateMatch(1));
    }

    handleSearch() {
        const searchTerm = this.searchInput.value.trim();
        
        // Clear previous highlights
        this.clearHighlights();
        
        if (searchTerm === '') {
            this.searchResults.classList.add('d-none');
            this.matches = [];
            this.updateMatchCount();
            return;
        }

        // Find and highlight matches
        this.matches = [];
        this.highlightMatches(searchTerm);

        // Update UI
        this.searchResults.classList.remove('d-none');
        this.currentMatchIndex = -1;
        this.updateMatchCount();
        if (this.matches.length > 0) {
            this.navigateMatch(1);
        }
    }

    clearHighlights() {
        const highlights = document.querySelectorAll('.highlight');
        highlights.forEach(highlight => {
            const parent = highlight.parentNode;
            parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        });
        // Normalize to merge adjacent text nodes
        document.getElementById('notesContainer').normalize();
    }

    highlightMatches(searchTerm) {
        const container = document.getElementById('notesContainer');
        const regex = new RegExp(searchTerm, 'gi');
        
        const processNode = (node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                const matches = [...text.matchAll(regex)];
                
                if (matches.length > 0) {
                    const fragment = document.createDocumentFragment();
                    let lastIndex = 0;
                    
                    matches.forEach(match => {
                        // Add text before the match
                        if (match.index > lastIndex) {
                            fragment.appendChild(
                                document.createTextNode(text.slice(lastIndex, match.index))
                            );
                        }
                        
                        // Create and add the highlighted match
                        const highlight = document.createElement('span');
                        highlight.className = 'highlight';
                        highlight.textContent = match[0];
                        fragment.appendChild(highlight);
                        this.matches.push(highlight);
                        
                        lastIndex = match.index + match[0].length;
                    });
                    
                    // Add any remaining text after the last match
                    if (lastIndex < text.length) {
                        fragment.appendChild(
                            document.createTextNode(text.slice(lastIndex))
                        );
                    }
                    
                    node.parentNode.replaceChild(fragment, node);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE && 
                      !['script', 'style', 'textarea'].includes(node.tagName.toLowerCase())) {
                Array.from(node.childNodes).forEach(child => processNode(child));
            }
        };
        
        processNode(container);
    }

    navigateMatch(direction) {
        if (this.matches.length === 0) return;

        // Remove active highlight from current match
        if (this.currentMatchIndex >= 0) {
            this.matches[this.currentMatchIndex].classList.remove('active');
        }

        // Update current match index
        this.currentMatchIndex += direction;
        if (this.currentMatchIndex >= this.matches.length) {
            this.currentMatchIndex = 0;
        } else if (this.currentMatchIndex < 0) {
            this.currentMatchIndex = this.matches.length - 1;
        }

        // Highlight and scroll to new match
        const currentMatch = this.matches[this.currentMatchIndex];
        currentMatch.classList.add('active');
        currentMatch.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        this.updateMatchCount();
    }

    updateMatchCount() {
        this.matchCount.textContent = this.matches.length > 0 ?
            `${this.currentMatchIndex + 1}/${this.matches.length}` : '0/0';
    }
}

// Initialize search functionality
new SearchManager();
