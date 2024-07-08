import { Check, FileVideo, Upload } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { initFFmpeg } from '../lib/ffmpeg'
import { fetchFile } from '@ffmpeg/util'
import { api } from '../lib/axios'

type Status =
  | 'waiting'
  | 'converting'
  | 'uploading'
  | 'generating'
  | 'success'
  | 'error'

export const VideoInputForm = ({
  onVideoUploaded,
}: {
  onVideoUploaded: (id: string) => void
}) => {
  const [status, setStatus] = useState<Status>('waiting')
  const [videoFile, setVideoFile] = useState<File>()
  const promptInputRef = useRef<HTMLTextAreaElement>(null)

  const statusMessages = {
    waiting: 'Upload video',
    converting: 'Converting',
    uploading: 'Uploading',
    success: 'Video uploaded!',
  }
  function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget

    if (!files) {
      return
    }

    const selectedFile = files[0]
    setVideoFile(selectedFile)
  }

  async function convertVideoToAudio(video: File) {
    console.log('Converting video to audio')

    const ffmpeg = await initFFmpeg()

    await ffmpeg.writeFile('input.mp4', await fetchFile(video))

    ffmpeg.on('progress', (progress) => {
      console.log('Convert progress:' + Math.round(progress.progress * 100))
    })

    await ffmpeg.exec([
      '-i',
      'input.mp4',
      '-map',
      '0:a',
      '-b',
      '20k',
      '-acodec',
      'libmp3lame',
      'output.mp3',
    ])

    const data = await ffmpeg.readFile('output.mp3')

    const audioFileBlob = new Blob([data], { type: 'audio/mpeg' })
    const audioFile = new File([audioFileBlob], 'audio.mp3', {
      type: 'audio/mpeg',
    })

    console.log('Convert finished')
    return audioFile
  }

  async function handleUploadVideo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const prompt = promptInputRef.current?.value

    if (!videoFile || !prompt) {
      return
    }

    setStatus('converting')
    const audioFile = await convertVideoToAudio(videoFile)

    const data = new FormData()

    data.append('file', audioFile)

    setStatus('uploading')
    const response = await api.post('/videos', data)
    const videoId = response.data.video.id

    await api.post(`/videos/${videoId}/transcription`, {
      prompt,
    })

    console.log('Video uploaded')
    setStatus('success')
    onVideoUploaded(videoId)
  }

  const previewURL = useMemo(() => {
    if (!videoFile) {
      return undefined
    }

    return URL.createObjectURL(videoFile)
  }, [videoFile])

  return (
    <form className="space-y-2" onSubmit={handleUploadVideo}>
      <label
        htmlFor="video"
        className={`relative cursor-pointer  rounded-md flex aspect-video ${
          !videoFile && 'border border-base-content border-dashed'
        } text-sm flex-col gap-2 items-center justify-center text-base-content hover:border-primary hover:text-primary transition-colors duration-200 ease-in-out`}
      >
        {videoFile ? (
          <video
            src={previewURL}
            controls={false}
            className="pointer-events-none absolute inset-0 rounded-md"
          />
        ) : (
          <>
            <FileVideo className="w-5 h-5" />
            Upload video
          </>
        )}
      </label>
      <input
        type="file"
        id="video"
        accept="video/mp4"
        className="sr-only"
        onChange={handleFileSelected}
      />

      <p className="divider w-full" />

      <div className="space-y-2">
        <label htmlFor="transcription_prompt" className="text-base-content">
          Transcription prompt
        </label>
        <textarea
          disabled={status !== 'waiting'}
          ref={promptInputRef}
          id="transcription_prompt"
          placeholder="Write keywords mentioned in the video separated by comma"
          className="textarea textarea-bordered min-h-20 leading-relaxed w-full"
        />
      </div>
      <button
        id="uploadvideo"
        className={`btn btn-sm w-full pointer-events-none ${
          status === 'success'
            ? 'btn-success opacity-40'
            : 'btn-primary btn-outline'
        } ${status === 'waiting' && 'pointer-events-auto'}`}
      >
        {statusMessages[status]}
        {status === 'waiting' && <Upload className="w-4 h-4" />}
        {(status === 'uploading' || status === 'converting') && (
          <span className="loading loading-spinner" />
        )}
      </button>
    </form>
  )
}
