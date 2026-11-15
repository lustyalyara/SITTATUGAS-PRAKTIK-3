// Service untuk mengambil data dummy dari file JSON.
window.SittaAPI = {
  async getData() {
    const response = await fetch('data/dataBahanAjar.json');
    if (!response.ok) throw new Error('Data bahan ajar tidak dapat dimuat. Jalankan melalui Live Server.');
    return response.json();
  }
};
