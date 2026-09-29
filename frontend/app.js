// ===== CONFIG =====
const API_URL = 'http://localhost:5000/api/opportunities';

// ===== DOM ELEMENTS =====
const form = document.getElementById('opportunity-form');
const formTitle = document.getElementById('form-title');
const opportunityId = document.getElementById('opportunity-id');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const researchAreaInput = document.getElementById('research_area');
const requiredSkillsInput = document.getElementById('required_skills');
const availablePositionsInput = document.getElementById('available_positions');
const deadlineInput = document.getElementById('application_deadline');
const statusSelect = document.getElementById('status');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const listContainer = document.getElementById('opportunities-list');
const messageBox = document.getElementById('message');

// ===== MESSAGE BANNER =====
function showMessage(text, type = 'success') {
  messageBox.textContent = text;
  messageBox.className = 'message ' + type;
  setTimeout(() => {
    messageBox.className = 'message hidden';
  }, 4000);
}

// ===== LOAD ALL OPPORTUNITIES =====
async function loadOpportunities() {
  listContainer.innerHTML = '<p class="loading">Loading...</p>';
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to load');
    const data = await res.json();

    if (data.length === 0) {
      listContainer.innerHTML = '<p class="empty">No opportunities yet. Create one above!</p>';
      return;
    }

    listContainer.innerHTML = '';
    data.forEach(op => {
      const div = document.createElement('div');
      div.className = 'opportunity';
      div.innerHTML = `
        <h3>${escapeHtml(op.title)}</h3>
        <div class="meta"><strong>Area:</strong> ${escapeHtml(op.research_area)}</div>
        <div class="meta"><strong>Description:</strong> ${escapeHtml(op.description)}</div>
        <div class="meta"><strong>Skills:</strong> ${escapeHtml(op.required_skills || 'N/A')}</div>
        <div class="meta"><strong>Positions:</strong> ${op.available_positions}</div>
        <div class="meta"><strong>Deadline:</strong> ${op.application_deadline ? op.application_deadline.substring(0, 10) : 'N/A'}</div>
        <span class="status ${op.status === 'Open' ? 'status-open' : 'status-closed'}">${op.status}</span>
        <div class="actions">
          <button class="small" onclick="editOpportunity(${op.id})">Edit</button>
          <button class="small ${op.status === 'Open' ? 'danger' : 'secondary'}" onclick="toggleStatus(${op.id}, '${op.status}')">
            ${op.status === 'Open' ? 'Close' : 'Reopen'}
          </button>
          <button class="small danger" onclick="deleteOpportunity(${op.id})">Delete</button>
        </div>
      `;
      listContainer.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    listContainer.innerHTML = '<p class="empty">Error loading opportunities.</p>';
    showMessage('Failed to load opportunities', 'error');
  }
}

// ===== ESCAPE HTML =====
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ===== FORM SUBMIT (CREATE or UPDATE) =====
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Basic validation
  if (!titleInput.value.trim() || !descriptionInput.value.trim() || !researchAreaInput.value.trim()) {
    showMessage('Title, Description, and Research Area are required.', 'error');
    return;
  }

  const payload = {
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim(),
    research_area: researchAreaInput.value.trim(),
    required_skills: requiredSkillsInput.value.trim() || null,
    available_positions: parseInt(availablePositionsInput.value) || 1,
    application_deadline: deadlineInput.value || null,
    status: statusSelect.value
  };

  const id = opportunityId.value;
  const method = id ? 'PUT' : 'POST';
  const url = id ? `${API_URL}/${id}` : API_URL;

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Request failed');
    }

    showMessage(id ? 'Opportunity updated!' : 'Opportunity created!', 'success');
    resetForm();
    loadOpportunities();
  } catch (err) {
    console.error(err);
    showMessage(err.message || 'Something went wrong', 'error');
  }
});

// ===== EDIT (fill form with existing data) =====
async function editOpportunity(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error('Not found');
    const op = await res.json();

    opportunityId.value = op.id;
    titleInput.value = op.title;
    descriptionInput.value = op.description;
    researchAreaInput.value = op.research_area;
    requiredSkillsInput.value = op.required_skills || '';
    availablePositionsInput.value = op.available_positions || 1;
    deadlineInput.value = op.application_deadline ? op.application_deadline.substring(0, 10) : '';
    statusSelect.value = op.status;

    formTitle.textContent = 'Update Opportunity';
    submitBtn.textContent = 'Update Opportunity';
    cancelBtn.classList.remove('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    console.error(err);
    showMessage('Could not load opportunity for editing', 'error');
  }
}

// ===== CANCEL EDIT =====
cancelBtn.addEventListener('click', resetForm);

function resetForm() {
  form.reset();
  opportunityId.value = '';
  availablePositionsInput.value = 1;
  statusSelect.value = 'Open';
  formTitle.textContent = 'Post New Opportunity';
  submitBtn.textContent = 'Create Opportunity';
  cancelBtn.classList.add('hidden');
}

// ===== TOGGLE STATUS (Open <-> Closed) =====
async function toggleStatus(id, currentStatus) {
  const newStatus = currentStatus === 'Open' ? 'Closed' : 'Open';
  try {
    // Get full record first
    const getRes = await fetch(`${API_URL}/${id}`);
    const op = await getRes.json();

    // Send update with new status
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: op.title,
        description: op.description,
        research_area: op.research_area,
        required_skills: op.required_skills,
        available_positions: op.available_positions,
        application_deadline: op.application_deadline,
        status: newStatus
      })
    });

    if (!res.ok) throw new Error('Update failed');
    showMessage(`Status changed to ${newStatus}`, 'success');
    loadOpportunities();
  } catch (err) {
    console.error(err);
    showMessage('Could not update status', 'error');
  }
}

// ===== DELETE =====
async function deleteOpportunity(id) {
  if (!confirm('Are you sure you want to delete this opportunity?')) return;
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete failed');
    showMessage('Opportunity deleted', 'success');
    loadOpportunities();
  } catch (err) {
    console.error(err);
    showMessage('Could not delete opportunity', 'error');
  }
}

// ===== INITIAL LOAD =====
loadOpportunities();