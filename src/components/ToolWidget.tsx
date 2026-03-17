import { useToolsView } from '../stores/toolsStore'
import { LandingToolCard } from './LandingToolCard'

export function ToolWidget() {
  const toolsView = useToolsView()

  return (
    <>
      {toolsView.map((tool) => {
        if (tool.type === 'LANDING') {
          return <LandingToolCard key={tool.id} {...tool} />
        }
        return null
      })}
    </>
  )
}