'use client'

import { ChangeEvent, FormEvent, useMemo, useRef, useState } from 'react'
import { CheckCircle, FileVideo, Upload } from 'lucide-react'
import { fetchFile } from '@ffmpeg/util'

import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Separator } from './ui/separator'
import { Label } from './ui/label'
import { getFFmpeg } from '@/lib/ffmpeg'
import { api } from '@/lib/api'
import { Spinner } from './spinner'

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success'

const statusMessage = {
  converting: 'Convertendo...',
  generating: 'Transcrevendo...',
  uploading: 'Carregando...',
  success: 'Sucesso!',
}

interface VideoInputFormProps {
  onVideoUploaded: (id: string) => void
}

export function VideoInputForm({ onVideoUploaded }: VideoInputFormProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>('waiting')
  const [progress, setProgress] = useState<number>(0)

  const promptInputRef = useRef<HTMLTextAreaElement>(null)

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget

    if (!files) {
      return
    }

    const selectedFile = files[0]

    setVideoFile(selectedFile)
  }

  async function convertVideoToAudio(video: File) {
    console.log('Convert started...')

    const ffmpeg = await getFFmpeg()

    await ffmpeg.writeFile('input.mp4', await fetchFile(video))

    // ffmpeg.on('log', (log) => {
    //   console.log(log)
    // })

    ffmpeg.on('progress', (progress) => {
      setProgress(Math.round(progress.progress * 100))
    })

    await ffmpeg.exec([
      '-i',
      'input.mp4',
      '-map',
      '0:a',
      '-b:a',
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

    console.log('Convert finished.')

    return audioFile
  }

  async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const prompt = promptInputRef.current?.value

    if (!videoFile) {
      return
    }

    setStatus('converting')

    const audioFile = await convertVideoToAudio(videoFile)

    const data = new FormData()

    data.append('file', audioFile)

    setStatus('uploading')

    const response = await api.post('/videos', data)

    const videoId = response.data.video.id

    setStatus('generating')

    await api.post(`videos/${videoId}/transcription`, {
      prompt,
    })

    setStatus('success')

    onVideoUploaded(videoId)

    setTimeout(() => {
      setStatus('waiting')
    }, 2000)
  }

  const previewURL = useMemo(() => {
    if (!videoFile) {
      return null
    }

    return URL.createObjectURL(videoFile)
  }, [videoFile])

  return (
    <form onSubmit={handleUploadVideo} className="space-y-6">
      <label
        htmlFor="video"
        className="relative border flex rounded-md border-dashed aspect-video
        cursor-pointer text-sm flex-col gap-2 items-center justify-center
        text-muted-foreground hover:bg-primary/5 overflow-hidden"
      >
        {videoFile ? (
          <video
            src={previewURL ?? ''}
            controls={false}
            className="pointer-events-none absolute inset-0"
          />
        ) : (
          <>
            <FileVideo className="h-4 w-4" />
            Selecione um vídeo
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

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
        <Textarea
          ref={promptInputRef}
          disabled={status !== 'waiting'}
          id="transcription_prompt"
          className="min-h-[5rem] leading-relaxed resize-none"
          placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula (,)"
        />
      </div>

      <Button
        data-success={status === 'success'}
        disabled={status !== 'waiting' && status !== 'success'}
        type="submit"
        className="flex w-full items-center gap-2 justify-center data-[success=true]:bg-emerald-500"
      >
        {status === 'waiting' ? (
          <>
            Carregar vídeo
            <Upload className="h-4 w-4 ml-2" />
          </>
        ) : status === 'converting' ? (
          <div className="flex w-max items-center gap-2">
            {statusMessage[status] + progress + '%'}
            <Spinner />
          </div>
        ) : status !== 'success' ? (
          <div className="flex w-max items-center gap-2">
            {statusMessage[status]}
            <Spinner />
          </div>
        ) : (
          <>
            {statusMessage[status]}
            <CheckCircle className="h-4 w-4" strokeWidth={2} />
          </>
        )}
      </Button>
    </form>
  )
}
