(() => {
    const id = new URLSearchParams(location.search).get("tournament");
    const open = document.getElementById("open-in-duelio");
    if (!id || !/^[A-Za-z0-9._:-]{6,128}$/.test(id)) return;
    const capability = /^#invite=[0-9a-f]{32}$/.test(location.hash)
      ? location.hash
      : "";
    open.href = `duelio://tournament/${encodeURIComponent(id)}${capability}`;
    open.dataset.openDuelio = "";
  })();
