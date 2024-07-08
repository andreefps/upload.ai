import { useState } from 'react'
import { Header } from './components/Header'
import { PromptSelect } from './components/PrompSelect'
import { VideoInputForm } from './components/VideoInputForm'
import { useCompletion } from 'ai/react'
export function App() {
  const [temperature, setTemperature] = useState(0.3)
  const [videoId, setVideoId] = useState<string | null>(null)

  function handlePromptSelected(template: string) {
    setInput(template)
  }

  function handleVideoUploaded(id: string) {
    setVideoId(id)
  }

  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
  } = useCompletion({
    api: 'http://localhost:3333/ai/complete',
    body: {
      videoId,
      temperature,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex gap-6 p-6 ">
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <textarea
              className="textarea textarea-bordered resize-none leading-relaxed "
              placeholder="Paste your prompt here..."
              value={input}
              onChange={handleInputChange}
            />
            <textarea
              className="textarea textarea-bordered resize-none leading-relaxed"
              placeholder="AI generated text will appear here..."
              readOnly
              value={completion}
            />
          </div>
          <p className="text-sm">
            Remember that you can use the variable{' '}
            <code className="text-violet-400">{'{transcription}'}</code> in your
            prompt to add the content of transcript from the selected video.
          </p>
        </div>
        <aside className="w-80 space-y-6">
          <VideoInputForm onVideoUploaded={handleVideoUploaded} />
          <p className="divider w-full" />

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <PromptSelect onSelected={handlePromptSelected} />
            </div>
            <div className="space-y-2">
              <label htmlFor="model">Model</label>
              <select
                className="select select-bordered w-full"
                id="model"
                defaultValue="gpt3.5"
                disabled
              >
                <option value="gpt3.5">GPT 3.5 Turbo 16k</option>
              </select>
              <p className="text-xs text-info/80 italic">
                You'll be able to customize the model soon.
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="temperature">Temperature</label>
              <input
                id="temperature"
                type="range"
                className="range range-xs range-primary"
                min={0}
                max={1}
                step={0.1}
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
              />

              <span className="text-xs text-info/80 italic">
                Higher values are most likely to give more creative results but
                with possible errors
              </span>
            </div>
            <p className="divider w-full" />
            <button
              disabled={isLoading || !videoId}
              type="submit"
              className="btn btn-primary w-full btn-md"
            >
              {isLoading ? (
                <span className="loading loading-spinner">Generating</span>
              ) : (
                <span className={isLoading ? 'loading loading spinner' : ''}>
                  Generate !{' '}
                </span>
              )}
            </button>
          </form>
        </aside>
      </main>
    </div>
  )
}
