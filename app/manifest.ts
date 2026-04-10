import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ayorinde | Digital Architect',
    short_name: 'Ayorinde',
    description: 'Portfolio of Ayorinde, a Digital Architect and Engineer.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fdfaf6',
    theme_color: '#ff3d00',
    icons: [
      {
        src: '/icon.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}
