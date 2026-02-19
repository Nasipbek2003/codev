// Тестовый скрипт для проверки отправки заявки студента

const testData = {
  fullName: "Тестовый Студент",
  whatsapp: "+996555123456",
  institution: "КГТУ им. Раззакова",
  direction: "Программная инженерия",
  service: "ВКР (дипломная)",
  deadline: "2024-06-15",
  expectedPrice: "10000-15000",
  withWebsite: true,
  description: "Тестовая заявка для проверки работы системы"
};

async function testStudentRequest() {
  try {
    console.log('📤 Отправка тестовой заявки студента...');
    console.log('Данные:', JSON.stringify(testData, null, 2));

    const response = await fetch('http://localhost:3000/api/student-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Заявка успешно отправлена!');
      console.log('Результат:', result);
    } else {
      console.error('❌ Ошибка при отправке заявки:', result);
    }
  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
}

testStudentRequest();
