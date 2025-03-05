import { defineConfig } from 'vite'; // Vite yapılandırma fonksiyonu
import { glob } from 'glob'; // Dosya eşleştirme için Glob modülü
import injectHTML from 'vite-plugin-html-inject'; // HTML eklemek için eklenti
import FullReload from 'vite-plugin-full-reload'; // Tam sayfa yenileme için eklenti
import SortCss from 'postcss-sort-media-queries'; // CSS medya sorgularını sıralamak için eklenti

export default defineConfig(({ command }) => {
  // Vite yapılandırmasını dışa aktar
  return {
    define: {
      [command === 'serve' ? 'global' : '_global']: {}, // Komuta bağlı olarak global değişkenleri tanımla
    },
    root: 'src', // Kök dizini ayarla
    build: {
      sourcemap: true, // Kaynak haritalarını etkinleştir
      rollupOptions: {
        input: glob.sync('./src/*.html'), // Glob kullanarak HTML dosyalarını girdi olarak al
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor'; // node_modules için ayrı vendor parçası
            }
          },
          entryFileNames: chunkInfo => {
            if (chunkInfo.name === 'commonHelpers') {
              return 'commonHelpers.js'; // commonHelpers parçası için özel isim
            }
            return '[name].js'; // Varsayılan parça isimlendirme
          },
          assetFileNames: assetInfo => {
            if (assetInfo.name && assetInfo.name.endsWith('.html')) {
              return '[name].[ext]'; // HTML varlıkları için özel isimlendirme
            }
            return 'assets/[name]-[hash][extname]'; // Hash ile varsayılan varlık isimlendirme
          },
        },
      },
      outDir: '../dist', // Çıkış dizini
      emptyOutDir: true, // Çıkış dizinini boşalt
    },
    plugins: [
      injectHTML(), // HTML ekleme eklentisi
      FullReload(['./src/**/**.html']), // Tam sayfa yenileme eklentisi
      SortCss({
        sort: 'mobile-first', // Mobil öncelikli sıralama
      }),
    ],
  };
});
