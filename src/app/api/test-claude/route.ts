import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'ANTHROPIC_API_KEY не найден в переменных окружения'
      }, { status: 500 });
    }

    // Проверяем формат ключа
    const keyPrefix = apiKey.substring(0, 15);
    const keyLength = apiKey.length;

    console.log('Testing Claude API...');
    console.log('API Key prefix:', keyPrefix);
    console.log('API Key length:', keyLength);

    // Тестовый запрос к Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: 'Привет! Ответь одним словом: работает?'
          }
        ]
      }),
    });

    const responseText = await response.text();
    console.log('Claude API response status:', response.status);
    console.log('Claude API response:', responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { raw: responseText };
      }

      return NextResponse.json({
        success: false,
        error: 'Claude API вернул ошибку',
        status: response.status,
        details: errorData,
        keyInfo: {
          prefix: keyPrefix,
          length: keyLength
        }
      }, { status: response.status });
    }

    const data = JSON.parse(responseText);

    return NextResponse.json({
      success: true,
      message: 'Claude API работает!',
      response: data.content[0].text,
      model: data.model,
      usage: data.usage,
      keyInfo: {
        prefix: keyPrefix,
        length: keyLength,
        valid: true
      }
    });

  } catch (error) {
    console.error('Test Claude API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
