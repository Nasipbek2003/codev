import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages } = body

    console.log('Получен запрос к chat API:', { messagesCount: messages.length })

    // Проверяем наличие API ключа
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY не найден!')
      return NextResponse.json(
        { error: 'API ключ не настроен' },
        { status: 500 }
      )
    }

    // Преобразуем формат сообщений для Claude API
    // Claude использует другой формат: system отдельно, остальные в messages
    const systemMessage = messages.find((m: any) => m.role === 'system')
    const conversationMessages = messages.filter((m: any) => m.role !== 'system')

    // Убедимся, что сообщения имеют правильный формат
    const formattedMessages = conversationMessages.map((m: any) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content)
    }))

    const requestBody = {
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 8000,
      messages: formattedMessages,
      ...(systemMessage && { system: systemMessage.content })
    }

    console.log('Отправка запроса к Claude API...')

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    const responseText = await response.text()
    console.log('Claude API response status:', response.status)

    if (!response.ok) {
      console.error('Claude API error response:', responseText)
      let errorData
      try {
        errorData = JSON.parse(responseText)
      } catch {
        errorData = { message: responseText }
      }
      
      return NextResponse.json(
        { 
          error: 'Claude API error', 
          status: response.status,
          details: errorData 
        },
        { status: response.status }
      )
    }

    const data = JSON.parse(responseText)
    console.log('Claude API успешный ответ')
    
    // Преобразуем ответ Claude в формат OpenAI для совместимости с фронтендом
    const openAIFormat = {
      id: data.id,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: data.model,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: data.content[0].text,
          },
          finish_reason: data.stop_reason === 'end_turn' ? 'stop' : data.stop_reason,
        },
      ],
      usage: {
        prompt_tokens: data.usage.input_tokens,
        completion_tokens: data.usage.output_tokens,
        total_tokens: data.usage.input_tokens + data.usage.output_tokens,
      },
    }

    return NextResponse.json(openAIFormat)

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate response', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
