const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const ID3Writer = require('node-id3');
const fs = require('fs');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegPath);

class YTDownloader {
    constructor() {
        this.tmpDir = path.join(__dirname, 'ArslanMedia/audio');
        if (!fs.existsSync(this.tmpDir)) {
            fs.mkdirSync(this.tmpDir, { recursive: true });
        }
    }

    static async downloadMP3(url, metadata = {}, autoWriteTags = true) {
        try {
            const info = await ytdl.getInfo(url);
            const title = metadata.title || info.videoDetails.title;
            const artist = metadata.artist || info.videoDetails.author.name;
            const album = metadata.album || 'YouTube Audio';
            const thumbnail = metadata.thumbnail || info.videoDetails.thumbnails?.pop()?.url;

            const fileName = `${title.replace(/[^\w\s]/gi, '')}_${Date.now()}.mp3`;
            const filePath = path.join(__dirname, 'ArslanMedia/audio', fileName);

            return new Promise((resolve, reject) => {
                const stream = ytdl(url, {
                    quality: 'highestaudio',
                    filter: 'audioonly'
                });

                ffmpeg(stream)
                    .audioBitrate(128)
                    .toFormat('mp3')
                    .save(filePath)
                    .on('end', async () => {
                        if (autoWriteTags) {
                            const tags = {
                                title: title,
                                artist: artist,
                                album: album,
                            };

                            if (thumbnail) {
                                try {
                                    const response = await fetch(thumbnail);
                                    const buffer = await response.arrayBuffer();
                                    tags.image = {
                                        mime: 'image/jpeg',
                                        type: {
                                            id: 3,
                                            name: 'front cover'
                                        },
                                        description: 'Thumbnail',
                                        imageBuffer: Buffer.from(buffer)
                                    };
                                } catch (err) {
                                    console.error('Thumbnail fetch error:', err.message);
                                }
                            }

                            const success = ID3Writer.write(tags, filePath);
                            if (!success) {
                                console.warn('Failed to write ID3 tags');
                            }
                        }

                        resolve({
                            path: filePath,
                            meta: {
                                title,
                                artist,
                                album,
                                thumbnail,
                            }
                        });
                    })
                    .on('error', (err) => {
                        console.error('FFmpeg error:', err);
                        reject(err);
                    });
            });
        } catch (err) {
            console.error('DownloadMP3 error:', err.message);
            throw err;
        }
    }
}

module.exports = YTDownloader;
