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

            return (!typeVal || type === typeVal) &&
                (!dimVal || dim === dimVal) &&
                (!colVal || col === colVal);
        });

        updateFilterOptions(filtered);
        renderCards(filtered);
    }

    function updateFilterOptions(rows) {
        const types = new Set();
        const dims = new Set();
        const cols = new Set();

        rows.forEach(r => {
            types.add(r?.c?.[0]?.v ?? "");
            dims.add(r?.c?.[1]?.v ?? "");
            cols.add(r?.c?.[2]?.v ?? "");
        });

        refillSelect(fType, types, "Tutti");
        refillSelect(fDim, dims, "Tutte");
        refillSelect(fCol, cols, "Tutti");
    }

    function refillSelect(select, values, labelAll) {
        const current = select.value;

        select.innerHTML = `<option value="">${labelAll}</option>`;

        [...values]
            .sort((a, b) => a.localeCompare(b, "it"))
            .forEach(v => {
                if (!v) return;

                const opt = document.createElement("option");
                opt.value = v;
                opt.textContent = v;
                select.appendChild(opt);
            });

        if ([...values].includes(current)) {
            select.value = current;
        }
    }

    fType.addEventListener("change", applyFilters);
    fDim.addEventListener("change", applyFilters);
    fCol.addEventListener("change", applyFilters);

    applyFilters();
}
