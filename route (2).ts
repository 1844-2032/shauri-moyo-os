@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply inline-block bg-gold text-green-deep font-semibold text-[15px] px-6 py-3 rounded-card hover:bg-[#E5B45C] transition-colors;
  }
  .btn-ghost {
    @apply inline-block bg-transparent text-parchment font-medium text-[15px] px-6 py-3 rounded-card border border-white/30 hover:border-white/60 transition-colors;
  }
  .btn-dark {
    @apply inline-block bg-green text-parchment font-semibold text-[15px] px-6 py-3 rounded-card hover:bg-green-deep transition-colors;
  }
  .eyebrow {
    @apply text-[12px] font-semibold tracking-[0.12em] uppercase text-gold-deep;
  }
  .card {
    @apply bg-white border border-line rounded-card p-6 shadow-[0_1px_2px_rgba(14,41,34,0.04),0_8px_24px_rgba(14,41,34,0.06)];
  }
  .form-input {
    @apply w-full px-3 py-2.5 border border-line rounded-card text-sm bg-parchment text-ink;
  }
}

body {
  background: #F7F5EF;
  color: #1B1B18;
}
