'use client';

import { useState } from 'react';
import Head from 'next/head';

interface VideoFormat {
  quality: string;
  format: string;
  url: string;
  size: string;
}

interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
  formats: VideoFormat[];
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [error, setError] = useState('');

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ url }),
      });

      const data = await response.json();

      if (data.success) {
        setVideoInfo(data.data);
      } else {
        setError(data.error || 'Failed to fetch video info');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Cobalt - Video Downloader</title>
        <meta name="description" content="Download any social media video" />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Cobalt
            </h1>
            <p className="text-gray-400 text-xl mb-8">
              Download any social media video
            </p>

            <form onSubmit={handleDownload} className="mb-8">
              <div className="flex gap-4">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste video URL here..."
                  className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-purple-500"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-semibold rounded-lg transition-colors"
                >
                  {loading ? 'Loading...' : 'Get Video'}
                </button>
              </div>
            </form>

            {error && (
              <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200 mb-8">
                {error}
              </div>
            )}

            {videoInfo && (
              <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 text-left">
                <div className="flex gap-6 mb-6">
                  <img
                    src={videoInfo.thumbnail}
                    alt={videoInfo.title}
                    className="w-48 h-36 object-cover rounded-lg"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">
                      {videoInfo.title}
                    </h2>
                    <p className="text-gray-400">Duration: {videoInfo.duration}</p>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-white mb-4">Available Formats</h3>
                <div className="space-y-3">
                  {videoInfo.formats.map((format, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                    >
                      <div>
                        <span className="font-medium text-white">{format.quality}</span>
                        <span className="text-gray-400 ml-2">({format.format})</span>
                        <span className="text-gray-500 ml-2">{format.size}</span>
                      </div>
                      <a
                        href={format.url}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                      >
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {['YouTube', 'Twitter/X', 'TikTok', 'Instagram'].map((platform) => (
                <div
                  key={platform}
                  className="p-3 bg-gray-800/50 rounded-lg text-gray-300"
                >
                  {platform}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
