import { trousersOperationsByCategory, equipmentByCategory, professionByCategory, technicalConditionsByCategory } from './trousers.js';
import { Products } from './product.js';

function processRequest(input) {
    if (!input || !input.trim()) {
        return '<p>Помилка: Порожній ввід.</p>';
    }

    const wordsArray = input.toLowerCase().split(',').map(word => word.trim()).filter(word => word);
    const firstWord = wordsArray[0];

    if (!Products.includes(firstWord)) {
        return '<p>Невідома категорія продукту. Допустимі категорії: штани, жакети.</p>';
    }

    let table = '<table border="1">';
    table += '<tr><th>№</th><th>Завдання</th><th>Обладнання</th><th>Фах</th><th>Технічні умови</th></tr>';
    let rowNumber = 1;

    if (wordsArray.length === 1) {
        for (let category in trousersOperationsByCategory) {
            table += `<tr><th colspan="5">${category}</th></tr>`;
            const operations = Object.keys(trousersOperationsByCategory[category]);
            for (let i = 0; i < operations.length; i++) {
                const operation = operations[i];
                table += `<tr>`;
                table += `<td>${rowNumber++}</td>`;
                table += `<td>${operation}</td>`;
                table += `<td>${equipmentByCategory[category][i] || 'Немає даних'}</td>`;
                table += `<td>${professionByCategory[category][i] || 'Немає даних'}</td>`;
                table += `<td>${technicalConditionsByCategory[category][i] || 'Немає даних'}</td>`;
                table += `</tr>`;
            }
        }
    } else {
        const searchWords = wordsArray.slice(1);
        for (let category in trousersOperationsByCategory) {
            let hasMatch = false;
            const operations = Object.keys(trousersOperationsByCategory[category]);
            const matchedOperations = [];

            for (let i = 0; i < operations.length; i++) {
                const operation = operations[i];
                const operationWords = trousersOperationsByCategory[category][operation];
                const match = operationWords.some(opWord =>
                    searchWords.some(searchWord => opWord.includes(searchWord))
                );
                if (match) {
                    hasMatch = true;
                    matchedOperations.push({ index: i, operation });
                }
            }

            if (hasMatch) {
                table += `<tr><th colspan="5">${category}</th></tr>`;
                for (let { index, operation } of matchedOperations) {
                    table += `<tr>`;
                    table += `<td>${rowNumber++}</td>`;
                    table += `<td>${operation}</td>`;
                    table += `<td>${equipmentByCategory[category][index] || 'Немає даних'}</td>`;
                    table += `<td>${professionByCategory[category][index] || 'Немає даних'}</td>`;
                    table += `<td>${technicalConditionsByCategory[category][index] || 'Немає даних'}</td>`;
                    table += `</tr>`;
                }
            } else {
                table += `<tr><th colspan="5">${category}</th></tr>`;
                for (let i = 0; i < operations.length; i++) {
                    const operation = operations[i];
                    table += `<tr>`;
                    table += `<td>${rowNumber++}</td>`;
                    table += `<td>${operation}</td>`;
                    table += `<td>${equipmentByCategory[category][i] || 'Немає даних'}</td>`;
                    table += `<td>${professionByCategory[category][i] || 'Немає даних'}</td>`;
                    table += `<td>${technicalConditionsByCategory[category][i] || 'Немає даних'}</td>`;
                    table += `</tr>`;
                }
            }
        }
    }

    table += '</table>';
    return table;
}

export { processRequest };

document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submit_button');
    const tableContainer = document.getElementById('jeans-details');

    if (!submitButton || !tableContainer) {
        console.error("Елемент submit_button або jeans-details не знайдено.");
        return;
    }

    submitButton.addEventListener('click', () => {
        try {
            const inputValue = document.getElementById('input-text')?.value || '';
            const result = processRequest(inputValue);
            tableContainer.innerHTML = result;
        } catch (error) {
            tableContainer.innerHTML = `<p>Помилка при обробці даних: ${error.message}</p>`;
            console.error("Помилка при обробці даних:", error.message);
        }
    });
});
