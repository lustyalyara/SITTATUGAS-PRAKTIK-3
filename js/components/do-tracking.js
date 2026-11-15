Vue.component('do-tracking', {
  template: '#tpl-do-tracking', props: ['tracking', 'paketList', 'pengirimanList', 'stok'],
  data() { return { keyword: '', searched: false, results: [], progressText: {}, formError: '', form: this.emptyForm() }; },
  filters: {
    rupiah(value) { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value) || 0); },
    tanggal(value) { if (!value) return '-'; const d = new Date(`${value}T00:00:00`); return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }); },
    tanggalWaktu(value) { if (!value) return '-'; const d = new Date(value.replace(' ', 'T')); return d.toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }); }
  },
  computed: {
    allOrders() {
      const seen = new Map();
      this.tracking.forEach(entry => Object.entries(entry).forEach(([nomorDO, detail]) => seen.set(nomorDO, { nomorDO, ...detail })));
      return [...seen.values()];
    },
    selectedPackage() { return this.paketList.find(x => x.kode === this.form.paket) || null; },
    nextDoNumber() {
      const year = new Date().getFullYear();
      const nums = this.allOrders.map(x => { const m = x.nomorDO.match(new RegExp(`^DO${year}-(\\d+)$`)); return m ? Number(m[1]) : 0; });
      return `DO${year}-${String(Math.max(0, ...nums) + 1).padStart(3, '0')}`;
    }
  },
  watch: {
    keyword(value) { if (!value) { this.results = []; this.searched = false; } },
    'form.paket'() { this.formError = ''; }
  },
  methods: {
    emptyForm() { const now = new Date(); const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10); return { nim: '', nama: '', ekspedisi: '', paket: '', tanggalKirim: localDate }; },
    searchOrder() {
      const q = this.keyword.toLowerCase(); this.searched = true;
      this.results = this.allOrders.filter(x => x.nomorDO.toLowerCase().includes(q) || String(x.nim).toLowerCase().includes(q));
    },
    clearSearch() { this.keyword = ''; this.results = []; this.searched = false; this.$refs.searchInput && this.$refs.searchInput.focus(); },
    createOrder() {
      const f = this.form;
      if (!f.nim || !f.nama || !f.ekspedisi || !f.paket || !f.tanggalKirim) { this.formError = 'Semua data Delivery Order wajib diisi.'; return; }
      if (!/^\d{8,20}$/.test(f.nim)) { this.formError = 'NIM harus terdiri dari 8–20 angka.'; return; }
      if (!this.selectedPackage) { this.formError = 'Pilih paket bahan ajar yang tersedia.'; return; }
      const order = { [this.nextDoNumber]: { nim: f.nim, nama: f.nama, status: 'Dalam Perjalanan', ekspedisi: f.ekspedisi, tanggalKirim: f.tanggalKirim, paket: f.paket, total: this.selectedPackage.harga, perjalanan: [{ waktu: new Date().toLocaleString('sv-SE'), keterangan: 'Delivery Order dibuat dan menunggu proses pengiriman' }] } };
      this.$emit('update-tracking', [...this.tracking, order]);
      this.form = this.emptyForm(); this.formError = ''; this.keyword = this.nextDoNumber; this.$nextTick(this.searchOrder);
    },
    addProgress(order) {
      const text = (this.progressText[order.nomorDO] || '').trim(); if (!text) return;
      const updated = this.tracking.map(entry => {
        if (!entry[order.nomorDO]) return entry;
        const detail = { ...entry[order.nomorDO], perjalanan: [...(entry[order.nomorDO].perjalanan || []), { waktu: new Date().toLocaleString('sv-SE'), keterangan: text }] };
        return { ...entry, [order.nomorDO]: detail };
      });
      this.$emit('update-tracking', updated); this.progressText = { ...this.progressText, [order.nomorDO]: '' };
      this.$nextTick(this.searchOrder);
    }
  }
});
