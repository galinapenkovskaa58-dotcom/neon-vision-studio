import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-20 max-w-3xl">
        <Link to="/" className="text-neon-cyan hover:underline text-sm mb-8 inline-block">← На главную</Link>
        <h1 className="text-3xl font-heading font-bold mb-8 gradient-text">Политика конфиденциальности</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-foreground/80 text-sm leading-relaxed">
          <p>Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сайта Dream Studio Nexoria.</p>
          
          <h2 className="text-xl font-heading font-semibold text-foreground mt-8">1. Сбор информации</h2>
          <p>Мы собираем следующую информацию: имя, номер телефона, контактные данные мессенджера, предпочтения по стилю съёмки и другие данные, которые вы добровольно предоставляете через форму записи.</p>
          
          <h2 className="text-xl font-heading font-semibold text-foreground mt-8">2. Использование информации</h2>
          <p>Собранные данные используются исключительно для обработки заявок на фотосессии, связи с клиентами и улучшения качества сервиса.</p>
          
          <h2 className="text-xl font-heading font-semibold text-foreground mt-8">3. Защита данных</h2>
          <p>Мы принимаем все необходимые меры для защиты ваших персональных данных от несанкционированного доступа, изменения, раскрытия или уничтожения.</p>
          
          <h2 className="text-xl font-heading font-semibold text-foreground mt-8">4. Передача третьим лицам</h2>
          <p>Мы не передаём ваши персональные данные третьим лицам, за исключением случаев, предусмотренных законодательством РФ.</p>
          
          <h2 className="text-xl font-heading font-semibold text-foreground mt-8">5. Согласие</h2>
          <p>Отправляя заявку через форму на сайте, вы подтверждаете своё согласие с настоящей Политикой конфиденциальности.</p>
          
          <h2 className="text-xl font-heading font-semibold text-foreground mt-8">6. Контакты</h2>
          <p>По вопросам, связанным с обработкой персональных данных, вы можете обратиться по электронной почте: hello@neurophoto.ru</p>
        </div>
      </div>
    </div>
  );
}
