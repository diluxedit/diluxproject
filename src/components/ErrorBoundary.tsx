import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<
  {children: React.ReactNode},
  ErrorBoundaryState
> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = {hasError: false, errorMessage: ''};
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'Terjadi kesalahan saat memproses data.',
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B1428] text-white flex items-center justify-center p-6">
          <div className="max-w-lg w-full rounded-xl bg-[#142B4D] border border-white/15 p-8 space-y-4">
            <h1 className="font-display text-xl font-bold">
              Terjadi Gangguan Koneksi Data
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Aplikasi mengalami kendala saat membaca atau menulis data ke basis data.
              Silakan muat ulang halaman atau periksa izin akun admin Anda.
            </p>
            <p className="text-xs font-mono text-slate-400 break-words bg-[#0B1428] p-3 rounded-lg">
              {this.state.errorMessage}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#2563EB] text-white hover:bg-[#1D4ED8] cursor-pointer"
            >
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
