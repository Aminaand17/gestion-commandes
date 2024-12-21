
function fetchClientInfo() {
    const phone = document.getElementById('telephone').value;
    if (phone) {
        fetch(`/client-info/${phone}`)
            .then(response => response.json())
            .then(data => {
                if (data.client) {
                    document.getElementById('nom').value = data.client.surname;
                    document.getElementById('prenom').value = data.client.firstname;
                    document.getElementById('adresse').value = data.client.address;
                } else {
                    alert('Client non trouvé');
                }
            });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const articlesList = document.getElementById('articlesList');
    const selectedArticlesTable = document.getElementById('selectedArticles');
    const totalAmountSpan = document.getElementById('totalAmount');
    const saveCommandeBtn = document.getElementById('saveCommandeBtn');
    const searchInput = document.getElementById('searchArticle');
    function handleArticleSelection(event) {
        const checkbox = event.target;
        const articleId = checkbox.dataset.id;
        const articleName = checkbox.dataset.libelle;
        const articlePrice = parseFloat(checkbox.dataset.prix);
        const articleStock = parseInt(checkbox.dataset.stock, 10);
        if (checkbox.checked) {
            const row = document.createElement('tr');
            row.setAttribute('data-id', articleId);
            row.innerHTML = `
                    <td class="px-4 py-2">${articleName}</td>
                    <td class="px-4 py-2">${articlePrice.toFixed(2)}</td>
                    <td class="px-4 py-2">
                        <input type="number" name="quantities[${articleId}]" value="1" class="quantityInput border px-2 py-1 rounded" min="1" max="${articleStock}" onchange="updateTotalAmount()">
                    </td>
                    <td class="px-4 py-2">${articlePrice.toFixed(2)}</td>
                    <td class="px-4 py-2">
                        <button type="button" class="removeArticleButton bg-red-500 text-white py-1 px-3 rounded">Supprimer</button>
                    </td>
                `;
            selectedArticlesTable.appendChild(row);
        } else {
            const row = selectedArticlesTable.querySelector(`tr[data-id="${articleId}"]`);
            if (row) row.remove();
        }

        updateTotalAmount();
    }
    function updateTotalAmount() {
        let totalAmount = 0;
        selectedArticlesTable.querySelectorAll('tr').forEach(row => {
            const quantityInput = row.querySelector('.quantityInput');
            const price = parseFloat(row.querySelector('td:nth-child(2)').textContent);
            const quantity = parseInt(quantityInput.value, 10);
            const rowTotal = price * quantity;
            row.querySelector('td:nth-child(4)').textContent = rowTotal.toFixed(2);
            totalAmount += rowTotal;
        });
        totalAmountSpan.textContent = totalAmount.toFixed(2);
    }

    function removeArticle(event) {
        if (!event.target.classList.contains('removeArticleButton')) return;
        const row = event.target.closest('tr');
        row.remove();
        updateTotalAmount();
    }
    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.toLowerCase();
        const rows = articlesList.querySelectorAll('tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const articleName = cells[1].textContent.toLowerCase();
            const shouldDisplay = articleName.includes(searchTerm);
            row.style.display = shouldDisplay ? '' : 'none';
        });
    });
    articlesList.addEventListener('change', function (event) {
        if (event.target.classList.contains('articleCheckbox')) {
            handleArticleSelection(event);
        }
    });
    selectedArticlesTable.addEventListener('click', function (event) {
        removeArticle(event);
    });
});



