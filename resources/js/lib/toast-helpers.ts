import { toast } from "sonner";
import type { Page } from "@inertiajs/core";

// Definisikan tipe untuk aksi Inertia agar lebih aman
type InertiaAction = (options: object) => void;

// Opsi yang bisa dikustomisasi untuk setiap pemanggilan
interface ToastPromiseOptions {
  loadingText: string;
  successText: string;
  errorText: string;
  onSuccess?: () => void; // Callback tambahan jika sukses
}

/**
 * Membungkus aksi Inertia di dalam toast.promise untuk menampilkan notifikasi loading.
 * @param action - Fungsi aksi Inertia (contoh: (options) => post('/url', options)).
 * @param options - Teks dan callback untuk toast.
 */
export function handleInertiaPromise(action: InertiaAction, options: ToastPromiseOptions) {

  const promise = new Promise((resolve, reject) => {
    action({
      onSuccess: (page: Page) => resolve(page),
      onError: (errors: Record<string, string>) => reject(errors),
      preserveScroll: true,
    });
  });

  toast.promise(promise, {
    loading: options.loadingText,
    success: (data) => {
      // Jalankan callback tambahan seperti onClose() jika ada
      if (options.onSuccess) {
        options.onSuccess();
      }
      return options.successText;
    },
    error: (errors: any) => {
      // Coba cari pesan error spesifik, jika tidak ada, gunakan teks default
      const firstError = errors[Object.keys(errors)[0]];
      return firstError || options.errorText;
    },
  });
}
