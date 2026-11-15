(async function () {
  const templateFiles = ['stock-table', 'do-tracking', 'status-badge', 'app-modal'];
  try {
    const templates = await Promise.all(templateFiles.map(async name => {
      const response = await fetch(`templates/${name}.html`);
      if (!response.ok) throw new Error(`Template ${name} tidak ditemukan`);
      return response.text();
    }));
    templates.forEach((html, index) => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      document.body.appendChild(wrapper);
    });
    const scripts = ['status-badge', 'app-modal', 'stock-table', 'do-tracking'];
    for (const name of scripts) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `js/components/${name}.js`;
        script.onload = resolve; script.onerror = reject;
        document.body.appendChild(script);
      });
    }
    const data = await SittaAPI.getData();
    new Vue({
      el: '#app',
      data: {
        tab: 'stok', stok: data.stok || [], upbjjList: data.upbjjList || [],
        kategoriList: data.kategoriList || [], paketList: data.paket || [],
        pengirimanList: data.pengirimanList || [], tracking: data.tracking || []
      }
    });
  } catch (error) {
    console.error(error);
    document.querySelector('#app').innerHTML = `<div class="load-error"><h2>Aplikasi belum dapat dimuat</h2><p>${error.message}</p><p>Buka folder proyek menggunakan VS Code lalu pilih <b>Open with Live Server</b>.</p></div>`;
  }
})();
