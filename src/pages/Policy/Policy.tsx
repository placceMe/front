import React from 'react';
import { Card, Typography, Space, } from 'antd';
import {  
  LockOutlined, 
  UserOutlined, 
  HomeOutlined 
  
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  address?: string;
  workingHours?: string;
}

interface PrivacyPolicyProps {
  companyName?: string;
  lastUpdated?: string;
  contacts?: {
    dpo: ContactInfo;
    support: ContactInfo;
    security: ContactInfo;
  };
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({
  companyName = "Norsen",
 
}) => {

 

  const SectionCard: React.FC<{ 
    title: string; 
    children: React.ReactNode; 
    icon?: React.ReactNode;
    level?: 1 | 2 | 3 | 4 | 5;
  }> = ({ title, children, icon, level = 2 }) => (
    <Card className="mb-6" size="small">
      <Space direction="vertical" size="middle" className="w-full">
        <Space>
          {icon}
          <Title level={level} className="!mb-0">{title}</Title>
        </Space>
        {children}
      </Space>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <Card className="mb-6">
        <Space direction="vertical" align="center" className="w-full text-center">
         
          <Title level={1} className="!mb-2">Політика конфіденціальності</Title>
          <Title level={3} className="!mt-0 text-gray-600">
            Військовий маркетплейс "{companyName}"
          </Title>
          
        </Space>
      </Card>

     
      <SectionCard title="1. Загальні положення" icon={<UserOutlined />}>
        <Paragraph>
          Ця Політика конфіденціальності описує, як ми збираємо, використовуємо, зберігаємо 
          та захищаємо вашу особисту інформацію на платформі "{companyName}" - спеціалізованому 
          маркетплейсі для військової техніки та обладнання.
        </Paragraph>
        <Paragraph>
          Користуючись нашим сервісом, ви погоджуєтесь з умовами цієї політики.
        </Paragraph>
      </SectionCard>

      <SectionCard title="2. Інформація, яку ми збираємо" icon={<LockOutlined />}>
        <Space direction="vertical" size="middle" className="w-full">
          <div>
            <Title level={4}>2.1 Особиста інформація</Title>
            <ul className="pl-6">
              <li><Text><strong>Ідентифікаційні дані:</strong> ПІБ, дата народження, номер документа</Text></li>
              <li><Text><strong>Контактна інформація:</strong> електронна пошта, номер телефону, адреса</Text></li>
              <li><Text><strong>Військові дані:</strong> звання, підрозділ, військовий квиток (за необхідності)</Text></li>
              <li><Text><strong>Фінансова інформація:</strong> банківські реквізити, платіжні дані</Text></li>
            </ul>
          </div>
          
          <div>
            <Title level={4}>2.2 Технічна інформація</Title>
            <ul className="pl-6">
              <li><Text>IP-адреса та геолокація</Text></li>
              <li><Text>Дані браузера та пристрою</Text></li>
              <li><Text>Логи активності на платформі</Text></li>
              <li><Text>Куки та схожі технології</Text></li>
            </ul>
          </div>

          <div>
            <Title level={4}>2.3 Комерційна інформація</Title>
            <ul className="pl-6">
              <li><Text>Історія покупок і продажів</Text></li>
              <li><Text>Вподобання та пошукові запити</Text></li>
              <li><Text>Відгуки та рейтинги</Text></li>
              <li><Text>Комунікація з іншими користувачами</Text></li>
            </ul>
          </div>
        </Space>
      </SectionCard>

      <SectionCard title="3. Цілі обробки даних">
        <Space direction="vertical" size="middle" className="w-full">
          <div>
            <Title level={4}>3.1 Основні функції платформи</Title>
            <ul className="pl-6">
              <li><Text>Реєстрація та автентифікація користувачів</Text></li>
              <li><Text>Обробка замовлень та платежів</Text></li>
              <li><Text>Зв'язок між покупцями та продавцями</Text></li>
              <li><Text>Технічна підтримка користувачів</Text></li>
            </ul>
          </div>

          <div>
            <Title level={4}>3.2 Безпека та верифікація</Title>
            <ul className="pl-6">
              <li><Text><strong>Перевірка військового статусу</strong> (для доступу до спеціалізованих категорій)</Text></li>
              <li><Text>Запобігання шахрайству та зловживанням</Text></li>
              <li><Text>Дотримання вимог експортного контролю</Text></li>
              <li><Text>Антитерористичний скринінг</Text></li>
            </ul>
          </div>

          <div>
            <Title level={4}>3.3 Покращення сервісу</Title>
            <ul className="pl-6">
              <li><Text>Аналіз поведінки користувачів</Text></li>
              <li><Text>Персоналізація контенту</Text></li>
              <li><Text>Розробка нових функцій</Text></li>
              <li><Text>Маркетингові дослідження</Text></li>
            </ul>
          </div>
        </Space>
      </SectionCard>

      <SectionCard title="4. Особливості обробки військових даних">
     
        <Space direction="vertical" size="middle" className="w-full">
          <div>
            <Title level={4}>4.1 Заходи захисту</Title>
            <ul className="pl-6">
              <li><Text>Шифрування всіх військових ідентифікаторів</Text></li>
              <li><Text>Окреме зберігання від загальної бази даних</Text></li>
              <li><Text>Додаткові рівні авторизації для доступу</Text></li>
            </ul>
          </div>

        </Space>
      </SectionCard>

      <SectionCard title="5. Ваші права">
        <Space direction="vertical" size="middle" className="w-full">
          <Paragraph>
            Відповідно до українського та європейського законодавства, ви маєте такі права:
          </Paragraph>
          
          <div>
            <Title level={4}>5.1 Права доступу та контролю</Title>
            <ul className="pl-6">
              <li><Text><strong>Доступ:</strong> отримати копію ваших даних</Text></li>
              <li><Text><strong>Виправлення:</strong> виправити неточні дані</Text></li>
              <li><Text><strong>Видалення:</strong> запросити видалення даних ("право на забуття")</Text></li>
              <li><Text><strong>Обмеження:</strong> обмежити обробку в певних випадках</Text></li>
            </ul>
          </div>

          <div>
            <Title level={4}>5.2 Права портативності</Title>
            <ul className="pl-6">
              <li><Text><strong>Експорт даних:</strong> отримати дані в машинозчитуваному форматі</Text></li>
              <li><Text><strong>Передача:</strong> передати дані іншому сервісу</Text></li>
            </ul>
          </div>

          <div>
            <Title level={4}>5.3 Права заперечення</Title>
            <ul className="pl-6">
              <li><Text><strong>Маркетинг:</strong> відмовитися від маркетингових повідомлень</Text></li>
              <li><Text><strong>Профайлінг:</strong> заперечити проти автоматизованого прийняття рішень</Text></li>
            </ul>
          </div>
        </Space>
      </SectionCard>

      <SectionCard title="6. Заходи безпеки">
        <Space direction="vertical" size="middle" className="w-full">
          <div>
            <Title level={4}>6.1 Технічні заходи</Title>
            <ul className="pl-6">
              <li><Text><strong>Шифрування:</strong> AES-256 для зберігання, TLS 1.3 для передачі</Text></li>
              <li><Text><strong>Автентифікація:</strong> двофакторна автентифікація (2FA)</Text></li>
              <li><Text><strong>Моніторинг:</strong> цілодобовий моніторинг безпеки</Text></li>
              <li><Text><strong>Резервування:</strong> регулярні зашифровані резервні копії</Text></li>
            </ul>
          </div>

          <div>
            <Title level={4}>6.2 Організаційні заходи</Title>
            <ul className="pl-6">
              <li><Text><strong>Навчання персоналу</strong> з безпеки даних</Text></li>
              <li><Text><strong>Політики доступу</strong> на основі принципу мінімальних привілеїв</Text></li>
              <li><Text><strong>Регулярні аудити</strong> безпеки</Text></li>
              <li><Text><strong>План реагування</strong> на інциденти</Text></li>
            </ul>
          </div>
        </Space>
      </SectionCard>

      



      <SectionCard title="7. Правова основа">
        <Paragraph>Ця політика базується на:</Paragraph>
        <ul className="pl-6">
          <li><Text><strong>Закон України "Про захист персональних даних"</strong> (2010)</Text></li>
          <li><Text><strong>GDPR</strong> (Регламент ЄС 2016/679)</Text></li>
          <li><Text><strong>Закон України "Про електронну комерцію"</strong> (2015)</Text></li>
          <li><Text><strong>Закон України "Про державну таємницю"</strong> (1994)</Text></li>
        </ul>
      </SectionCard>

      <Card className="mt-8 bg-gray-100">
        <Space direction="vertical" align="center" className="w-full text-center">
          <HomeOutlined className="text-2xl text-gray-600" />
         
          <Text type="secondary" italic>
            Ця політика є частиною дипломного проекту та створена виключно в навчальних цілях.
          </Text>
        </Space>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;