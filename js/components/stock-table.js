Vue.component('ba-stock-table', {
  template: '#tpl-stock-table', props: ['stok', 'upbjjList', 'kategoriList'],
  data() { return { keyword: '', filterUpbjj: '', filterKategori: '', filterStok: 'semua', sortBy: 'judul', formOpen: false, editing: false, formError: '', deleteOpen: false, selected: null, form: this.emptyForm() }; },
  filters: {
    rupiah(value) { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value) || 0); },
    buah(value) { return `${Number(value) || 0} buah`; }
  },
  computed: {
    kategoriTersedia() { return [...new Set(this.stok.filter(x => !this.filterUpbjj || x.upbjj === this.filterUpbjj).map(x => x.kategori))].sort(); },
    filteredStok() {
      let rows = this.stok.filter(item => {
        const text = `${item.kode} ${item.judul}`.toLowerCase();
        const matchText = text.includes(this.keyword.toLowerCase());
        const matchArea = !this.filterUpbjj || item.upbjj === this.filterUpbjj;
        const matchCategory = !this.filterKategori || item.kategori === this.filterKategori;
        const matchStock = this.filterStok === 'semua' || (this.filterStok === 'kosong' ? Number(item.qty) === 0 : Number(item.qty) > 0 && Number(item.qty) < Number(item.safety));
        return matchText && matchArea && matchCategory && matchStock;
      });
      return rows.slice().sort((a, b) => this.sortBy === 'judul' ? a.judul.localeCompare(b.judul) : this.sortBy === 'stok' ? Number(a.qty) - Number(b.qty) : Number(a.harga) - Number(b.harga));
    },
    countAman() { return this.stok.filter(x => Number(x.qty) >= Number(x.safety) && Number(x.qty) > 0).length; },
    countMenipis() { return this.stok.filter(x => Number(x.qty) > 0 && Number(x.qty) < Number(x.safety)).length; },
    countKosong() { return this.stok.filter(x => Number(x.qty) === 0).length; }
  },
  watch: {
    filterUpbjj() { this.filterKategori = ''; },
    filterStok(value) { if (value === 'kosong') this.filterKategori = this.filterKategori; }
  },
  methods: {
    emptyForm() { return { kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', harga: '', qty: 0, safety: 0, catatanHTML: '' }; },
    resetFilter() { this.keyword = ''; this.filterUpbjj = ''; this.filterKategori = ''; this.filterStok = 'semua'; this.sortBy = 'judul'; },
    openCreate() { this.editing = false; this.form = this.emptyForm(); this.formError = ''; this.formOpen = true; },
    openEdit(item) { this.editing = true; this.form = { ...item }; this.formError = ''; this.formOpen = true; },
    closeForm() { this.formOpen = false; this.formError = ''; },
    saveForm() {
      const f = this.form;
      if (!f.kode || !f.judul || !f.kategori || !f.upbjj || !f.lokasiRak || f.harga === '' || f.qty === '' || f.safety === '') { this.formError = 'Semua kolom wajib diisi.'; return; }
      if (Number(f.harga) <= 0 || Number(f.qty) < 0 || Number(f.safety) < 0 || !Number.isFinite(Number(f.harga)) || !Number.isFinite(Number(f.qty)) || !Number.isFinite(Number(f.safety))) { this.formError = 'Harga harus lebih dari 0 dan stok tidak boleh negatif.'; return; }
      if (!this.editing && this.stok.some(x => x.kode.toLowerCase() === f.kode.toLowerCase())) { this.formError = 'Kode mata kuliah sudah terdaftar.'; return; }
      const rows = this.stok.slice();
      if (this.editing) { const i = rows.findIndex(x => x.kode === f.kode); if (i !== -1) rows.splice(i, 1, { ...f, harga: Number(f.harga), qty: Number(f.qty), safety: Number(f.safety) }); }
      else rows.push({ ...f, kode: f.kode.toUpperCase(), harga: Number(f.harga), qty: Number(f.qty), safety: Number(f.safety) });
      this.$emit('update-stok', rows); this.closeForm();
    },
    askDelete(item) { this.selected = item; this.deleteOpen = true; },
    deleteItem() { this.$emit('update-stok', this.stok.filter(x => x.kode !== this.selected.kode)); this.deleteOpen = false; this.selected = null; }
  }
});
