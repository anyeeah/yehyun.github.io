import './styles.css';

const API_URL = 'http://likelion12-guestbook.kro.kr:8000/guestbook/';

// 가져와서 리스트 생성
async function fetchEntries() {
    try {
        const response = await fetch(API_URL);
        const entries = await response.json();
        const entriesContainer = document.getElementById('guestbook-entries');
        entriesContainer.innerHTML = '';
        entries.forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.className = 'entry';
            entryElement.innerHTML = `
                <h3>${entry.title}</h3>
                <p>${entry.content}</p>
                <p><strong>${entry.writer}</strong></p>
                <button onclick="deleteEntry(${entry.id})">Delete</button>
            `;
            entriesContainer.appendChild(entryElement);
        });
    } catch (error) {
        console.error('Failed to fetch entries:', error);
    }
}

// 만들기
async function createEntry(entry) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(entry),
        });
        if (!response.ok) {
            throw new Error('Failed to create entry');
        }
        fetchEntries();
    } catch (error) {
        console.error('Failed to create entry:', error);
    }
}

// 삭제하기
async function deleteEntry(entryId) {
    const password = prompt('Please enter your password to delete this entry:');
    if (!password) {
        return;
    }
    try {
        const response = await fetch(`${API_URL}${entryId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });
        const result = await response.json();
        if (result.message === 'success') {
            fetchEntries();
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Failed to delete entry:', error);
    }
}

window.deleteEntry = deleteEntry;

// 완료 누르면
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('guestbook-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const entry = {
            writer: document.getElementById('writer').value,
            title: document.getElementById('title').value,
            content: document.getElementById('content').value,
            password: document.getElementById('password').value,
        };
        await createEntry(entry);
        document.getElementById('guestbook-form').reset();
    });

    
    fetchEntries();
});
