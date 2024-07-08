import { useEffect, useState } from 'react'
import { api } from '../lib/axios'

type Prompt = {
  id: string
  title: string
  template: string
}
interface PromptSelectProps {
  onSelected: (template: string) => void
}
export const PromptSelect = ({ onSelected }: PromptSelectProps) => {
  const [prompts, setPrompts] = useState<Prompt[] | null>(null)

  useEffect(() => {
    async function fetchPrompts() {
      api.get('/prompts').then((response) => setPrompts(response.data))
    }

    fetchPrompts()
  }, [])

  function handlePromptSelected(promptId: string) {
    console.log('Prompt selected:', promptId)
    const selectedPrompt = prompts?.find((prompt) => prompt.id === promptId)
    if (selectedPrompt) {
      onSelected(selectedPrompt.template)
    }
  }
  return (
    <>
      <label htmlFor="prompt">Prompt</label>
      <select
        id="prompt"
        className="select select-bordered w-full"
        onChange={(e) => handlePromptSelected(e.target.value)}
        defaultValue={'default'}
      >
        <option value="default" disabled hidden>
          Select your prompt
        </option>
        {prompts?.map((prompt) => (
          <option key={prompt.id} value={prompt.id}>
            {prompt.title}
          </option>
        ))}
      </select>
    </>
  )
}
