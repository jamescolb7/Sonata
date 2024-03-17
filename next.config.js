/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'cdn-images.dzcdn.net',
				port: '',
				pathname: '/images/**',
			},
			{
				protocol: 'https',
				hostname: 'cdn-images.dzcdn.net',
				port: '',
				pathname: '/images/**',
			},
			{
				protocol: 'https',
				hostname: 'e-cdns-images.dzcdn.net',
				port: '',
				pathname: '/images/**',
			},
		],
	}
};

module.exports = nextConfig;