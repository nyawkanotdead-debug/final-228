// js/script.js
$(document).ready(function() {
    
    // ----------------------------------------------------------------------
    // 1) General UI: Toggle extra info and smooth scroll
    // ----------------------------------------------------------------------

    // Toggle extra info (jQuery slideToggle)
    $('.reveal-more').on('click', function() {
        const target = $(this).data('target');
        $(target).slideToggle(300);
    });

   

    // Small UX: smooth scroll to contact
    $('a[href="#contact"]').on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $('#contact').offset().top - 70
        }, 600);
    });


    // ----------------------------------------------------------------------
    // 2) Index.html Contact Form Validation (5.1)
    // NOTE: This is simpler validation. Complex validation is on myportfolio.html
    // ----------------------------------------------------------------------
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email RegEx 

    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        let valid = true;
        const formResult = $('#formResult');
        formResult.empty().removeClass('text-success text-danger');

        $(this).find('input, textarea').each(function() {
            const input = $(this);
            const value = input.val().trim();

            input.removeClass('is-invalid');

            // Required field check [cite: 46]
            if (input.prop('required') && value === '') {
                valid = false;
                input.addClass('is-invalid');
                return;
            }

            // Email format check 
            if (input.attr('type') === 'email' && !emailRegex.test(value)) {
                valid = false;
                input.addClass('is-invalid');
                input.next('.invalid-feedback').text('Укажите корректный email (RegEx).');
            }
        });

        if (!valid) {
            formResult.text('Пожалуйста, исправьте ошибки в форме.').addClass('text-danger');
            return;
        }

        // Imitate submission
        formResult.text('Сообщение отправлено. Спасибо!').addClass('text-success');
        $(this)[0].reset();
    });


    // ----------------------------------------------------------------------
    // 3) Boss.html Dynamic Search (5.2)
    // ----------------------------------------------------------------------
    $('#bossSearch').on('keyup', function() { // Use .keyup() 
        const searchText = $(this).val().toLowerCase();

        $('.boss-card-item').each(function() {
            const bossCard = $(this);
            // Search in card title and text (case-insensitive)
            const cardContent = bossCard.text().toLowerCase();

            if (cardContent.includes(searchText)) {
                bossCard.slideDown(200); // Animation for showing 
            } else {
                bossCard.slideUp(200); // Animation for hiding
            }
        });
    });


    // ----------------------------------------------------------------------
    // 4) Gallery.html Filtering (5.5)
    // ----------------------------------------------------------------------

    $('.filter-btn').on('click', function() {
        const filterCategory = $(this).data('filter');
        $('.filter-btn').removeClass('active btn-primary').addClass('btn-outline-secondary');
        $(this).addClass('active btn-primary').removeClass('btn-outline-secondary');

        // jQuery .animate() for smooth transition [cite: 73]
        $('.gallery-grid').find('.gallery-item').fadeOut(300, function() {
            // After fadeOut is complete
            $('.gallery-grid').css({ 'opacity': 0 }); // Hide grid container temporarily
            
            $('.gallery-item').each(function() {
                const item = $(this);
                const itemCategory = item.data('category');

                if (filterCategory === 'all' || itemCategory === filterCategory) {
                    item.css('display', 'block');
                } else {
                    item.css('display', 'none');
                }
            });

            // Fade in the grid and filtered items [cite: 73]
            $('.gallery-grid').animate({ 'opacity': 1 }, 400); 
        });
    });

    // Carousel modal (Lightbox) and Thumbnails
    $('#imgModal').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget);
        const imgSrc = button.data('img') || button.attr('data-img');
        $('#modalImg').attr('src', imgSrc);
    });

    // Thumbnails open modal with fade effect (Lightbox) 
    $('.gallery-thumb').on('click', function() {
        const src = $(this).data('full');
        // Fade out image, change src, fade back in [cite: 73]
        $('#modalImg').fadeOut(100, function() {
            $(this).attr('src', src).fadeIn(250);
        });
        // Open modal via Bootstrap's JS
        const modalEl = new bootstrap.Modal(document.getElementById('imgModal'));
        modalEl.show();
    });

    // ----------------------------------------------------------------------
    // 5) MyPortfolio.html - CRUD Table & Complex Form Validation (5.4 & 5.1)
    // NOTE: This logic should be placed in scripts.js, but will only affect myportfolio.html elements
    // ----------------------------------------------------------------------

    let lostTarnished = [
        { id: 1, name: 'Tarnished Warrior', class: 'Vagabond', runes: 500, status: 'Alive' },
        { id: 2, name: 'Fia, Deathbed Companion', class: 'NPC', runes: 0, status: 'Departed' }
    ];
    let nextTarnishedId = 3;

    // CRUD: R (Read) - Render Table
    function renderTarnishedTable() {
        const tbody = $('#tarnishedTableBody');
        tbody.empty(); // Clear current table

        if (lostTarnished.length === 0) {
            tbody.append('<tr><td colspan="6" class="text-center text-muted">Нет записей о Погасших.</td></tr>');
            return;
        }

        $.each(lostTarnished, function(i, tarnished) {
            const row = `
                <tr data-id="${tarnished.id}">
                    <td class="tarnished-name">${tarnished.name}</td>
                    <td class="tarnished-class">${tarnished.class}</td>
                    <td class="tarnished-runes">${tarnished.runes}</td>
                    <td class="tarnished-status">${tarnished.status}</td>
                    <td>
                        <button class="btn btn-sm btn-info edit-btn" data-id="${tarnished.id}">Edit</button>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${tarnished.id}">Delete</button>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });
    }

    // CRUD: C (Create) - Add New Item
    $('#addTarnishedForm').on('submit', function(e) {
        e.preventDefault();
        const newName = $('#tarnishedName').val();
        const newClass = $('#tarnishedClass').val();
        const newRunes = parseInt($('#tarnishedRunes').val());
        const newStatus = $('#tarnishedStatus').val();

        const newTarnished = {
            id: nextTarnishedId++,
            name: newName,
            class: newClass,
            runes: newRunes,
            status: newStatus
        };

        lostTarnished.push(newTarnished);
        $('#addTarnishedModal').modal('hide');
        
        // CRUD Animation: SlideDown for addition 
        const newRow = $(`
            <tr data-id="${newTarnished.id}" style="display:none;">
                <td class="tarnished-name">${newTarnished.name}</td>
                <td class="tarnished-class">${newTarnished.class}</td>
                <td class="tarnished-runes">${newTarnished.runes}</td>
                <td class="tarnished-status">${newTarnished.status}</td>
                <td><button class="btn btn-sm btn-info edit-btn" data-id="${newTarnished.id}">Edit</button></td>
                <td><button class="btn btn-sm btn-danger delete-btn" data-id="${newTarnished.id}">Delete</button></td>
            </tr>
        `);
        $('#tarnishedTableBody').append(newRow);
        newRow.slideDown(400);

        $(this)[0].reset();
    });

    // CRUD: D (Delete)
    $('#tarnishedTableBody').on('click', '.delete-btn', function() {
        const idToDelete = $(this).data('id');
        const row = $(`tr[data-id="${idToDelete}"]`);

        if (confirm("Are you sure you want to send this Tarnished back to the Finger Maiden?")) {
            // CRUD Animation: FadeOut for deletion 
            row.fadeOut(300, function() {
                lostTarnished = lostTarnished.filter(t => t.id !== idToDelete);
                $(this).remove();
                renderTarnishedTable(); // Rerender in case last row was deleted
            });
        }
    });

    // CRUD: U (Update) - Inline Editing
    $('#tarnishedTableBody').on('click', '.edit-btn', function() {
        const idToEdit = $(this).data('id');
        const row = $(`tr[data-id="${idToEdit}"]`);
        
        // Simple inline editing: replace td content with input fields
        if (row.find('.save-btn').length) return; // Prevent double edit

        row.find('.tarnished-name, .tarnished-class, .tarnished-runes, .tarnished-status').each(function() {
            const currentValue = $(this).text();
            const fieldClass = $(this).attr('class');
            let inputField;
            
            if (fieldClass.includes('tarnished-runes')) {
                inputField = `<input type="number" class="form-control form-control-sm" value="${currentValue}" min="0">`;
            } else if (fieldClass.includes('tarnished-status')) {
                 inputField = `<select class="form-select form-select-sm"><option value="Alive">Alive</option><option value="Departed">Departed</option></select>`;
            } else {
                inputField = `<input type="text" class="form-control form-control-sm" value="${currentValue}">`;
            }
            
            $(this).data('old-value', currentValue).html(inputField);
        });

        // Change Edit button to Save
        $(this).removeClass('btn-info edit-btn').addClass('btn-success save-btn').text('Save');
        row.find('.delete-btn').after(`<button class="btn btn-sm btn-secondary cancel-btn" data-id="${idToEdit}">Cancel</button>`);
    });

    // CRUD: U (Update) - Save changes
    $('#tarnishedTableBody').on('click', '.save-btn', function() {
        const idToSave = $(this).data('id');
        const row = $(`tr[data-id="${idToSave}"]`);
        
        let updatedTarnished = lostTarnished.find(t => t.id === idToSave);
        if (!updatedTarnished) return;

        // Extract new values
        updatedTarnished.name = row.find('.tarnished-name input').val();
        updatedTarnished.class = row.find('.tarnished-class input').val();
        updatedTarnished.runes = parseInt(row.find('.tarnished-runes input').val());
        updatedTarnished.status = row.find('.tarnished-status select').val();

        // Revert to text display
        row.find('.tarnished-name').html(updatedTarnished.name);
        row.find('.tarnished-class').html(updatedTarnished.class);
        row.find('.tarnished-runes').html(updatedTarnished.runes);
        row.find('.tarnished-status').html(updatedTarnished.status);

        // Revert buttons
        $(this).removeClass('btn-success save-btn').addClass('btn-info edit-btn').text('Edit');
        row.find('.cancel-btn').remove();
    });

    // CRUD: U (Update) - Cancel
    $('#tarnishedTableBody').on('click', '.cancel-btn', function() {
        const idToCancel = $(this).data('id');
        const row = $(`tr[data-id="${idToCancel}"]`);

        // Revert to old values
        row.find('.tarnished-name, .tarnished-class, .tarnished-runes, .tarnished-status').each(function() {
            $(this).html($(this).data('old-value'));
        });

        // Revert buttons
        row.find('.save-btn').removeClass('btn-success save-btn').addClass('btn-info edit-btn').text('Edit');
        $(this).remove();
    });

    // Initial table render
    renderTarnishedTable();


    // ----------------------------------------------------------------------
    // 6) Complex Form Validation (MyPortfolio Modal) (5.1)
    // ----------------------------------------------------------------------

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    function checkPasswordStrength(password) {
        let strength = 0;
        if (password.length > 7) strength++; // Min length
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++; // Mixed case
        if (password.match(/\d/)) strength++; // Numbers
        if (password.match(/[@$!%*?&]/)) strength++; // Special characters

        const strengthIndicator = $('#passwordStrength');
        strengthIndicator.removeClass('text-danger text-warning text-success').text('');

        if (password.length === 0) return;

        if (strength <= 1) {
            strengthIndicator.text('Weak').addClass('text-danger');
        } else if (strength <= 3) {
            strengthIndicator.text('Medium').addClass('text-warning');
        } else {
            strengthIndicator.text('Strong').addClass('text-success');
        }
    }

    $('#registerPassword').on('input', function() {
        checkPasswordStrength($(this).val()); // Password strength indicator [cite: 48]
    });

    $('#registrationForm').on('submit', function(e) {
        e.preventDefault();
        let valid = true;
        const form = $(this);
        const nameInput = $('#registerName');
        const emailInput = $('#registerEmail');
        const passInput = $('#registerPassword');
        const confirmPassInput = $('#registerConfirmPassword');

        // Clear previous feedback
        form.find('input').removeClass('is-invalid');
        $('#passwordMatchFeedback').text('').removeClass('text-danger text-success');

        // Check required fields (Name, Email, Pass, ConfirmPass) [cite: 46]
        if (nameInput.val().trim() === '') { nameInput.addClass('is-invalid'); valid = false; }
        if (emailInput.val().trim() === '') { emailInput.addClass('is-invalid'); valid = false; }
        if (passInput.val().trim() === '') { passInput.addClass('is-invalid'); valid = false; }
        if (confirmPassInput.val().trim() === '') { confirmPassInput.addClass('is-invalid'); valid = false; }

        // Email RegEx check 
        if (valid && !emailRegex.test(emailInput.val().trim())) {
            emailInput.addClass('is-invalid');
            emailInput.next('.invalid-feedback').text('Некорректный формат Email (RegEx).');
            valid = false;
        }

        // Password Match check [cite: 49]
        if (valid && passInput.val() !== confirmPassInput.val()) {
            passInput.addClass('is-invalid');
            confirmPassInput.addClass('is-invalid');
            $('#passwordMatchFeedback').text('Пароли не совпадают.').addClass('text-danger');
            valid = false;
        }

        if (!valid) {
            $('#registerResult').text('Пожалуйста, исправьте ошибки.').addClass('text-danger').removeClass('text-success');
            return; // Prevent form submission [cite: 51]
        }

        // Success Feedback [cite: 50]
        $('#registerResult').text('Регистрация успешна! Добро пожаловать, Погасший.').addClass('text-success').removeClass('text-danger');
        form[0].reset();
        checkPasswordStrength(''); // Reset strength indicator
    });

});
// /js/script.js

// Получаем элементы по их ID
const quoteToggle = document.getElementById('quoteToggle');
const loreQuote = document.getElementById('loreQuote');

// Проверяем, что элементы существуют, прежде чем добавлять обработчик
if (quoteToggle && loreQuote) {
    // В функцию обработчика передаем объект события (event)
    quoteToggle.addEventListener('click', function(event) {
        
        // **********************************************
        // ГЛАВНОЕ ИЗМЕНЕНИЕ: Отменяем стандартное действие элемента
        // Это предотвращает отправку формы и перезагрузку страницы.
        event.preventDefault();
        // **********************************************

        // Метод .classList.toggle() добавляет класс, если его нет, и удаляет, если он есть.
        loreQuote.classList.toggle('d-none');

        // (Необязательно) Изменяем текст кнопки для лучшего UX
        if (loreQuote.classList.contains('d-none')) {
            quoteToggle.textContent = 'Показать цитату из лора';
        } else {
            quoteToggle.textContent = 'Скрыть цитату из лора';
        }
    });
}
