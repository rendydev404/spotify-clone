// hooks/useDebounce.ts
import { useState, useEffect } from 'react';

// Hook ini mengambil sebuah nilai (seperti query pencarian)
// dan hanya mengembalikan nilai tersebut setelah jeda waktu tertentu (delay).
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Atur timer untuk memperbarui nilai setelah delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Bersihkan timer setiap kali nilai berubah (user mengetik lagi)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Hanya jalankan ulang jika nilai atau delay berubah

  return debouncedValue;
}