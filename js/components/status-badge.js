Vue.component('status-badge', {
  props: ['qty', 'safety', 'note'], template: '#tpl-status-badge', data() { return { hovering: false }; },
  computed: {
    statusClass() { return Number(this.qty) === 0 ? 'status-empty' : Number(this.qty) < Number(this.safety) ? 'status-low' : 'status-safe'; },
    statusText() { return Number(this.qty) === 0 ? '● Kosong' : Number(this.qty) < Number(this.safety) ? '▲ Menipis' : '● Aman'; },
    plainNote() { const el = document.createElement('div'); el.innerHTML = this.note || 'Tidak ada catatan'; return el.textContent; }
  }
});
