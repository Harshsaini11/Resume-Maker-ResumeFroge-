document.addEventListener('DOMContentLoaded', () => {
    // 1. Containers
    const eduContainer = document.getElementById('education-container');
    const skillsContainer = document.getElementById('skills-container');
    const expContainer = document.getElementById('experience-container');
    const projContainer = document.getElementById('projects-container');
    const customSectionsContainer = document.getElementById('custom-sections-container');


// 🎡 THEME CAROUSEL SELECTION & DRAG SCROLL
const themeSlider = document.getElementById('theme-slider');
const sliderWrapper = document.querySelector('.theme-slider-wrapper');

if (themeSlider && sliderWrapper) {
    // Radio select behavior handling
    themeSlider.addEventListener('change', (e) => {
        if (e.target.name === 'theme') {
            const allCards = themeSlider.querySelectorAll('.theme-card');
            allCards.forEach(card => card.classList.remove('selected'));
            e.target.closest('.theme-card')?.classList.add('selected');
        }
    });

    // Optional: Horizontal Mouse-Drag Scrolling
    let isDown = false;
    let startX;
    let scrollLeft;

    sliderWrapper.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - sliderWrapper.offsetLeft;
        scrollLeft = sliderWrapper.scrollLeft;
    });
    sliderWrapper.addEventListener('mouseleave', () => isDown = false);
    sliderWrapper.addEventListener('mouseup', () => isDown = false);
    sliderWrapper.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - sliderWrapper.offsetLeft;
        const walk = (x - startX) * 2; // Scroll-speed multiplier
        sliderWrapper.scrollLeft = scrollLeft - walk;
    });
}

    // 🖐️ DRAG & DROP / REORDERING LOGIC (Added without changing original logic)
    let draggedSection = null;

    function makeSectionDraggable(fieldset) {
        fieldset.setAttribute('draggable', 'true');

        fieldset.addEventListener('dragstart', (e) => {
            draggedSection = fieldset;
            fieldset.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });

        fieldset.addEventListener('dragend', () => {
            draggedSection = null;
            fieldset.classList.remove('dragging');
            document.querySelectorAll('fieldset').forEach(f => f.classList.remove('drag-over'));
        });

        fieldset.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            if (draggedSection && draggedSection !== fieldset) {
                fieldset.classList.add('drag-over');
            }
        });

        fieldset.addEventListener('dragleave', () => {
            fieldset.classList.remove('drag-over');
        });

        fieldset.addEventListener('drop', (e) => {
            e.preventDefault();
            fieldset.classList.remove('drag-over');
            if (draggedSection && draggedSection !== fieldset) {
                const parent = fieldset.parentNode;
                const allSections = Array.from(parent.querySelectorAll('fieldset'));
                const draggedIndex = allSections.indexOf(draggedSection);
                const targetIndex = allSections.indexOf(fieldset);

                if (draggedIndex < targetIndex) {
                    parent.insertBefore(draggedSection, fieldset.nextSibling);
                } else {
                    parent.insertBefore(draggedSection, fieldset);
                }
            }
        });
    }

    // Initialize drag & drop on existing initial fieldsets
    document.querySelectorAll('fieldset').forEach(makeSectionDraggable);

    // Auto-attach drag & drop on newly created dynamic sections
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.tagName === 'FIELDSET') {
                    makeSectionDraggable(node);
                }
            });
        });
    });

    const formElement = document.getElementById('resume-form');
    if (formElement) {
        observer.observe(formElement, { childList: true, subtree: true });
    }

    // 2. Add Item Generator Functions (Modern Card Header Style)
    const addEducation = (degree = '', college = '', duration = '') => {
        if (!eduContainer) return;
        const div = document.createElement('div');
        div.className = 'dynamic-item';
        div.innerHTML = `
            <div class="item-header">
                <span class="item-number">Education Entry</span>
                <button type="button" class="remove-btn" onclick="this.closest('.dynamic-item').remove()">🗑️ Remove</button>
            </div>
            <div class="input-grid-3">
                <input type="text" name="edu_degree[]" placeholder="Degree (e.g. B.Tech CSE)" value="${degree}" required>
                <input type="text" name="edu_college[]" placeholder="College / University" value="${college}" required>
                <input type="text" name="edu_year[]" placeholder="Duration (e.g. 2023-Present)" value="${duration}" required>
            </div>
        `;
        eduContainer.appendChild(div);
    };

    const addSkill = (category = '', list = '') => {
        if (!skillsContainer) return;
        const div = document.createElement('div');
        div.className = 'dynamic-item';
        div.innerHTML = `
            <div class="item-header">
                <span class="item-number">Skill Category</span>
                <button type="button" class="remove-btn" onclick="this.closest('.dynamic-item').remove()">🗑️ Remove</button>
            </div>
            <div class="input-grid">
                <input type="text" name="skill_category[]" placeholder="Category (e.g. Languages, Core CS, Tools)" value="${category}" required>
                <input type="text" name="skill_list[]" placeholder="Skills (e.g. Core Java, C++, Linux, Git)" value="${list}" required>
            </div>
        `;
        skillsContainer.appendChild(div);
    };

    const addExperience = (role = '', company = '', dates = '', points = '') => {
        if (!expContainer) return;
        const div = document.createElement('div');
        div.className = 'dynamic-item';
        div.innerHTML = `
            <div class="item-header">
                <span class="item-number">Experience Entry</span>
                <button type="button" class="remove-btn" onclick="this.closest('.dynamic-item').remove()">🗑️ Remove</button>
            </div>
            <div class="input-grid-3">
                <input type="text" name="exp_role[]" placeholder="Role Title (e.g. Java Developer Intern)" value="${role}">
                <input type="text" name="exp_company[]" placeholder="Company / Org Name" value="${company}">
                <input type="text" name="exp_dates[]" placeholder="Duration (e.g. Sep 2025 - Present)" value="${dates}">
            </div>
            <textarea name="exp_points[]" rows="2" placeholder="Responsibilities (Har new line ek naya bullet point)...">${points}</textarea>
        `;
        expContainer.appendChild(div);
    };

    const addProject = (title = '', tech = '', points = '') => {
        if (!projContainer) return;
        const div = document.createElement('div');
        div.className = 'dynamic-item';
        div.innerHTML = `
            <div class="item-header">
                <span class="item-number">Project Entry</span>
                <button type="button" class="remove-btn" onclick="this.closest('.dynamic-item').remove()">🗑️ Remove</button>
            </div>
            <div class="input-grid">
                <input type="text" name="proj_title[]" placeholder="Project Title" value="${title}">
                <input type="text" name="proj_tech[]" placeholder="Tech Stack (e.g. Core Java, OOPs)" value="${tech}">
            </div>
            <textarea name="proj_points[]" rows="2" placeholder="Key Achievements (Har new line ek naya bullet point)...">${points}</textarea>
        `;
        projContainer.appendChild(div);
    };

    // 3. Function to Add Entire Custom New Section
    const addCustomSection = (sectionTitle = "Certifications") => {
        if (!customSectionsContainer) return;
        const fieldset = document.createElement('fieldset');
        fieldset.className = 'custom-section-block';

        fieldset.innerHTML = `
            <div class="section-header-control" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <input type="text" name="custom_section_title[]" class="section-title-input" value="${sectionTitle}" placeholder="Section Title (e.g. Certifications)" style="font-weight: bold; font-size: 16px; color: #1e3a8a;" required>
                <button type="button" class="delete-section-btn" onclick="this.closest('fieldset').remove()" style="background:#fef2f2; color:#ef4444; border:1px solid #fecaca; padding:6px 12px; border-radius:6px; cursor:pointer;">🗑️ Delete Section</button>
            </div>
            <div class="custom-items-holder"></div>
            <button type="button" class="add-btn add-custom-item-btn" style="width:100%; margin-top:8px;">➕ Add Item</button>
        `;

        customSectionsContainer.appendChild(fieldset);

        const itemsHolder = fieldset.querySelector('.custom-items-holder');
        const addCustomItemBtn = fieldset.querySelector('.add-custom-item-btn');

        const addCustomItem = () => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'dynamic-item';
            itemDiv.innerHTML = `
                <div class="item-header">
                    <span class="item-number">Entry Item</span>
                    <button type="button" class="remove-btn" onclick="this.closest('.dynamic-item').remove()">🗑️ Remove</button>
                </div>
                <div class="input-grid-3">
                    <input type="text" name="custom_item_title[]" placeholder="Title / Name">
                    <input type="text" name="custom_item_subtitle[]" placeholder="Subtitle / Issuer / Org">
                    <input type="text" name="custom_item_date[]" placeholder="Date / Duration">
                </div>
                <textarea name="custom_item_desc[]" rows="2" placeholder="Details (Bullet points)..."></textarea>
            `;
            itemsHolder.appendChild(itemDiv);
        };

        addCustomItemBtn.addEventListener('click', addCustomItem);
        addCustomItem(); // Add 1 default item
    };

    // 4. Add Default Initial Inputs
    addEducation();
    addSkill("Languages", "Core Java, C++");
    addSkill("Core CS", "Operating Systems, Compiler Design, OOPs");
    addExperience();
    addProject();

    // 5. Event Listeners for Add Buttons
    if (document.getElementById('add-edu-btn')) document.getElementById('add-edu-btn').addEventListener('click', () => addEducation());
    if (document.getElementById('add-skill-btn')) document.getElementById('add-skill-btn').addEventListener('click', () => addSkill());
    if (document.getElementById('add-exp-btn')) document.getElementById('add-exp-btn').addEventListener('click', () => addExperience());
    if (document.getElementById('add-proj-btn')) document.getElementById('add-proj-btn').addEventListener('click', () => addProject());
    
    // Add Custom Section Button Handler
    const addSectionBtn = document.getElementById('add-custom-section-btn');
    if (addSectionBtn) {
        addSectionBtn.addEventListener('click', () => {
            const title = prompt("Enter New Section Title (e.g. Certifications, Achievements, Languages):", "Certifications");
            if (title && title.trim()) {
                addCustomSection(title.trim());
            }
        });
    }

    // 6. Form Submission & Data Parsing Logic
    const form = document.getElementById('resume-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Single Values
        const data = {
            theme: form.querySelector('input[name="theme"]:checked')?.value || 'modern_classic',
            font_family: form.font_family?.value || 'sans-serif',
            theme_color: form.theme_color ? form.theme_color.value : '#2563eb',
            full_name: form.full_name.value,
            role: form.role.value,
            email: form.email.value,
            phone: form.phone.value,
            location: form.location.value,
            github: form.github ? form.github.value : '',
            linkedin: form.linkedin ? form.linkedin.value : '',
            summary: form.summary.value,
    
    // 📸 PHOTO DETAILS
            profile_photo: uploadedProfileImageBase64,
            photo_shape: document.getElementById('photo-shape-select')?.value || 'circle',
            // Dynamic Ordered Sections Array (Reads exact DOM order)
            ordered_sections: []
        };

        // Traverses fieldsets sequentially based on reordered position
        const allFieldsets = form.querySelectorAll('fieldset');

        allFieldsets.forEach(fieldset => {
            // Check Education
            if (fieldset.querySelector('#education-container')) {
                const items = [];
                const degrees = fieldset.querySelectorAll('input[name="edu_degree[]"]');
                const colleges = fieldset.querySelectorAll('input[name="edu_college[]"]');
                const years = fieldset.querySelectorAll('input[name="edu_year[]"]');
                degrees.forEach((deg, i) => {
                    if (deg.value.trim()) {
                        items.push({ degree: deg.value, college: colleges[i].value, year: years[i].value });
                    }
                });
                if (items.length) data.ordered_sections.push({ type: 'education', items });
            }
            // Check Skills
            else if (fieldset.querySelector('#skills-container')) {
                const items = [];
                const cats = fieldset.querySelectorAll('input[name="skill_category[]"]');
                const lists = fieldset.querySelectorAll('input[name="skill_list[]"]');
                cats.forEach((cat, i) => {
                    if (cat.value.trim()) {
                        items.push({ category: cat.value, list: lists[i].value });
                    }
                });
                if (items.length) data.ordered_sections.push({ type: 'skills', items });
            }
            // Check Experience
            else if (fieldset.querySelector('#experience-container')) {
                const items = [];
                const roles = fieldset.querySelectorAll('input[name="exp_role[]"]');
                const companies = fieldset.querySelectorAll('input[name="exp_company[]"]');
                const dates = fieldset.querySelectorAll('input[name="exp_dates[]"]');
                const points = fieldset.querySelectorAll('textarea[name="exp_points[]"]');
                roles.forEach((r, i) => {
                    if (r.value.trim()) {
                        const pts = points[i].value.split('\n').filter(p => p.trim() !== '');
                        items.push({ role: r.value, company: companies[i].value, dates: dates[i].value, points: pts });
                    }
                });
                if (items.length) data.ordered_sections.push({ type: 'experience', items });
            }
            // Check Projects
            else if (fieldset.querySelector('#projects-container')) {
                const items = [];
                const titles = fieldset.querySelectorAll('input[name="proj_title[]"]');
                const techs = fieldset.querySelectorAll('input[name="proj_tech[]"]');
                const points = fieldset.querySelectorAll('textarea[name="proj_points[]"]');
                titles.forEach((t, i) => {
                    if (t.value.trim()) {
                        const pts = points[i].value.split('\n').filter(p => p.trim() !== '');
                        items.push({ title: t.value, tech: techs[i].value, points: pts });
                    }
                });
                if (items.length) data.ordered_sections.push({ type: 'projects', items });
            }
            // Check Custom Sections
            else if (fieldset.classList.contains('custom-section-block')) {
                const titleInput = fieldset.querySelector('input[name="custom_section_title[]"]');
                if (titleInput && titleInput.value.trim()) {
                    const secTitle = titleInput.value.trim();
                    const items = [];
                    const itemDivs = fieldset.querySelectorAll('.dynamic-item');
                    itemDivs.forEach(div => {
                        const t = div.querySelector('input[name="custom_item_title[]"]').value.trim();
                        const sub = div.querySelector('input[name="custom_item_subtitle[]"]').value.trim();
                        const d = div.querySelector('input[name="custom_item_date[]"]').value.trim();
                        const desc = div.querySelector('textarea[name="custom_item_desc[]"]').value.trim();

                        if (t || sub || desc) {
                            const pts = desc ? desc.split('\n').filter(p => p.trim() !== '') : [];
                            items.push({ title: t, subtitle: sub, date: d, points: pts });
                        }
                    });
                    if (items.length) data.ordered_sections.push({ type: 'custom', title: secTitle, items });
                }
            }
        });

        // Render Resume View
        renderResume(data);

        document.getElementById('form-section').style.display = 'none';
        document.getElementById('preview-section').style.display = 'block';
        window.scrollTo(0, 0);
    });

    document.getElementById('edit-btn').addEventListener('click', () => {
        document.getElementById('preview-section').style.display = 'none';
        document.getElementById('form-section').style.display = 'block';
        window.scrollTo(0, 0);
    });

    // 7. Render Resume View Function (Supports Reordered Output)
function renderResume(data) {
    const sheet = document.getElementById('resume-sheet');
    sheet.className = `resume-sheet theme-${data.theme}`;
    sheet.style.fontFamily = data.font_family;

    const themeColor = data.theme_color || '#2563eb';
    sheet.style.setProperty('--theme-accent', themeColor);

    const renderList = (pts) => pts.map(p => `<li>${p}</li>`).join('');

    // Profile Photo HTML Generate Karein (Agar Upload hui ho)
    const photoHTML = data.profile_photo ? 
        `<div class="profile-photo-wrapper ${data.photo_shape}">
            <img src="${data.profile_photo}" alt="Profile Photo">
        </div>` : '';

    let sidebarSectionsHTML = '';
    let mainSectionsHTML = '';

    data.ordered_sections.forEach(sec => {
        let contentHTML = '';
        if (sec.type === 'education') {
            const eduHTML = sec.items.map(e => `<div style="margin-bottom:10px;"><strong>${e.degree}</strong><br><em>${e.college}</em> (${e.year})</div>`).join('');
            sidebarSectionsHTML += `<div class="section"><div class="section-title">Education</div>${eduHTML}</div>`;
        } else if (sec.type === 'skills') {
            const skillsHTML = sec.items.map(s => `<p style="margin-bottom:6px;"><strong>${s.category}:</strong><br>${s.list}</p>`).join('');
            sidebarSectionsHTML += `<div class="section"><div class="section-title">Technical Skills</div>${skillsHTML}</div>`;
        } else if (sec.type === 'experience') {
            const expHTML = sec.items.map(e => `
                <div style="margin-bottom:12px;">
                    <strong>${e.role}</strong> - <em>${e.company}</em> (${e.dates})
                    ${e.points.length ? `<ul>${renderList(e.points)}</ul>` : ''}
                </div>
            `).join('');
            mainSectionsHTML += `<div class="section"><div class="section-title">Work Experience</div>${expHTML}</div>`;
        } else if (sec.type === 'projects') {
            const projHTML = sec.items.map(p => `
                <div style="margin-bottom:12px;">
                    <strong>${p.title}</strong> (Tech: <em>${p.tech}</em>)
                    ${p.points.length ? `<ul>${renderList(p.points)}</ul>` : ''}
                </div>
            `).join('');
            mainSectionsHTML += `<div class="section"><div class="section-title">Key Projects</div>${projHTML}</div>`;
        } else if (sec.type === 'custom') {
            let itemsHTML = sec.items.map(it => `
                <div style="margin-bottom:10px;">
                    <div style="display:flex; justify-content:space-between; font-weight:bold;">
                        <span>${it.title} ${it.subtitle ? `- <em style="font-weight:normal;">${it.subtitle}</em>` : ''}</span>
                        <span>${it.date}</span>
                    </div>
                    ${it.points.length ? `<ul>${renderList(it.points)}</ul>` : ''}
                </div>
            `).join('');
            mainSectionsHTML += `<div class="section"><div class="section-title">${sec.title}</div>${itemsHTML}</div>`;
        }
    });

    const isSidebarTheme = (data.theme === 'left_sidebar' || data.theme === 'right_sidebar');

    if (isSidebarTheme) {
        sheet.innerHTML = `
            <div class="sidebar-column">
                ${photoHTML}
                <div class="sidebar-header">
                    <h1>${data.full_name}</h1>
                    <div class="role">${data.role}</div>
                </div>
                <div class="sidebar-contact">
                    <p>📧 ${data.email}</p>
                    <p>📱 ${data.phone}</p>
                    <p>📍 ${data.location}</p>
                    ${data.github ? `<p>🔗 ${data.github}</p>` : ''}
                    ${data.linkedin ? `<p>💼 ${data.linkedin}</p>` : ''}
                </div>
                ${sidebarSectionsHTML}
            </div>

            <div class="main-column">
                <div class="section">
                    <div class="section-title">Professional Summary</div>
                    <p>${data.summary}</p>
                </div>
                ${mainSectionsHTML}
            </div>
        `;
    } else {
        sheet.innerHTML = `
            <div class="resume-header-with-photo">
                ${photoHTML}
                <div class="resume-header">
                    <h1>${data.full_name}</h1>
                    <div class="role" style="color: var(--theme-accent);">${data.role}</div>
                    <div class="contact">
                        📧 ${data.email} | 📱 ${data.phone} | 📍 ${data.location}
                        ${data.github ? ` | 🔗 ${data.github}` : ''}
                        ${data.linkedin ? ` | 💼 ${data.linkedin}` : ''}
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">Summary</div>
                <p>${data.summary}</p>
            </div>

            ${sidebarSectionsHTML}
            ${mainSectionsHTML}
        `;
    }
}

let uploadedProfileImageBase64 = "";

// Profile photo input listener
const photoInput = document.getElementById('profile-photo-input');
if (photoInput) {
    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                uploadedProfileImageBase64 = evt.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            uploadedProfileImageBase64 = "";
        }
    });
}

});

