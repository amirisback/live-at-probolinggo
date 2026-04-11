import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Live At Probolinggo',
    short_name: 'LiveAtPBL',
    description: 'Portal layanan warga Probolinggo — Dari Warga Untuk Warga',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAFAFA',
    theme_color: '#2563EB',
    icons: [
      {
        src: '/icon-192x192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: '/icon-512x512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
    ],
  }
}
