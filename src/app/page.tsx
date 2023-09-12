'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { FileVideo, Github, Heart, Play, Upload, Wand2 } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen p-6 bg-gradient-to-r from-yellow-600 to-red-600">
      <div className="flex flex-1 flex-col rounded-xl bg-zinc-900">
        <header className="flex items-center px-6 py-3 justify-between border-b overflow-hidden">
          <div className="flex gap-3 items-center">
            <Play className="h-6 w-6" fill="#f97316" />
            <h1 className="text-xl font-bold">upload.ai</h1>
          </div>
          <div className="flex gap-3 items-center">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              Desenvolvido com <Heart className="h-4 w-4" fill="#dc2626" /> por
              Diogo
            </span>

            <Separator orientation="vertical" className="h-6" />

            <Button variant="outline">
              <Github className="h-4 w-4 mr-2" />
              Github
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6 flex gap-6">
          <div className="flex flex-col flex-1 gap-4">
            <div className="grid grid-rows-2 gap-4 flex-1">
              <Textarea
                className="resize-none p-4 leading-relaxed"
                placeholder="Inclua o prompt para a IA..."
              />
              <Textarea
                className="resize-none p-4 leading-relaxed"
                placeholder="Resultado gerado pela IA..."
                readOnly
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Lembre-se: você pode utilizar a variável{' '}
              <code className="text-orange-400">{'{transcription}'}</code> no
              seu prompt para adicionar o conteúdo da transcrição do vídeo
              selecionado.
            </p>
          </div>

          <aside className="w-full max-w-xs space-y-6">
            <form className="space-y-6">
              <label
                htmlFor="video"
                className="border flex rounded-md border-dashed aspect-video
                cursor-pointer text-sm flex-col gap-2 items-center justify-center
                text-muted-foreground hover:bg-primary/5"
              >
                <FileVideo className="h-4 w-4" />
                Selecione um vídeo
              </label>

              <input
                type="file"
                id="video"
                accept="video/mp4"
                className="sr-only"
              />

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="transcription_prompt">
                  Prompt de transcrição
                </Label>
                <Textarea
                  id="transcription_prompt"
                  className="min-h-[5rem] leading-relaxed resize-none"
                  placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula (,)"
                />
              </div>

              <Button type="submit" className="flex w-full">
                Carregar vídeo
                <Upload className="h-4 w-4 ml-2" />
              </Button>
            </form>

            <Separator />

            <form className="space-y-6">
              <div className="space-y-4">
                <Label>Prompt</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um prompt..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Título do vídeo</SelectItem>
                    <SelectItem value="descrition">
                      Descrição do vídeo
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Modelo</Label>
                <Select disabled defaultValue="gpt3.5">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
                  </SelectContent>
                </Select>
                <span className="block text-xs text-muted-foreground italic">
                  Você poderá customizar essa opção em breve
                </span>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Temperatura</Label>
                <Slider min={0} max={1} step={0.1} />
                <span className="block text-xs text-muted-foreground italic leading-relaxed">
                  Valores mais altos tendem a deixar o resultado mais criativo e
                  com possíveis erros.
                </span>
              </div>

              <Button type="submit" className="w-full">
                Executar
                <Wand2 className="h-4 w-4 ml-2" />
              </Button>
            </form>
          </aside>
        </main>
      </div>
    </div>
  )
}
