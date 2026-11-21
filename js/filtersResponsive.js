export function initFilters(allRows, renderCards) {
    const fType = document.getElementById("filter-type");
    const fDim = document.getElementById("filter-dim");
    const fCol = document.getElementById("filter-colors");

    function applyFilters() {
        const typeVal = fType.value;
        const dimVal = fDim.value;
        const colVal = fCol.value;

        const filtered = allRows.filter(r => {
            const type = r?.c?.[0]?.v ?? "";
            const dim = r?.c?.[1]?.v ?? "";
            const col = r?.c?.[2]?.v ?? "";

            return (
                (!typeVal || type === typeVal) &&
                (!dimVal || dim === dimVal) &&
                (!colVal || col === colVal)
            );
        });

        updateFilterOptions();
        renderCards(filtered);
    }

    function updateFilterOptions() {
        const typeVal = fType.value;
        const dimVal = fDim.value;
        const colVal = fCol.value;

        // TYPE -> ignora TYPE
        const rowsForTypes = allRows.filter(r => {
            const dim = r?.c?.[1]?.v ?? "";
            const col = r?.c?.[2]?.v ?? "";

            return (
                (!dimVal || dim === dimVal) &&
                (!colVal || col === colVal)
            );
        });

        // DIM -> ignora DIM
        const rowsForDims = allRows.filter(r => {
            const type = r?.c?.[0]?.v ?? "";
            const col = r?.c?.[2]?.v ?? "";

            return (
                (!typeVal || type === typeVal) &&
                (!colVal || col === colVal)
            );
        });

        // COLORI -> ignora COLORI
        const rowsForCols = allRows.filter(r => {
            const type = r?.c?.[0]?.v ?? "";
            const dim = r?.c?.[1]?.v ?? "";

            return (
                (!typeVal || type === typeVal) &&
                (!dimVal || dim === dimVal)
            );
        });

        const types = new Set(
            rowsForTypes.map(r => r?.c?.[0]?.v ?? "")
        );

        const dims = new Set(
            rowsForDims.map(r => r?.c?.[1]?.v ?? "")
        );

        const cols = new Set(
            rowsForCols.map(r => r?.c?.[2]?.v ?? "")
        );

        refillSelect(fType, types, "Tutti");
        refillSelect(fDim, dims, "Tutte");
        refillSelect(fCol, cols, "Tutti");
    }

    function refillSelect(select, values, labelAll) {
        const current = select.value;

        select.innerHTML = `<option value="">${labelAll}</option>`;

        [...values]
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b, "it"))
            .forEach(v => {
                const opt = document.createElement("option");
                opt.value = v;
                opt.textContent = v;
                select.appendChild(opt);
            });

        if (current && [...values].includes(current)) {
            select.value = current;
        }
    }

    fType.addEventListener("change", applyFilters);
    fDim.addEventListener("change", applyFilters);
    fCol.addEventListener("change", applyFilters);

    updateFilterOptions();
    applyFilters();
}