import { Link } from 'react-router-dom';

export default function Offer() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-20 max-w-3xl">
        <Link to="/" className="text-neon-cyan hover:underline text-sm mb-8 inline-block">← На главную</Link>
        <h1 className="text-3xl font-heading font-bold mb-8 gradient-text">Публичная оферта</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-foreground/80 text-sm leading-relaxed">
          <p>Настоящий документ является публичной офертой (далее — «Оферта») и определяет условия оказания услуг нейрофотосессий.</p>
          
          <h2 className="text-xl font-heading font-semibold text-foreground mt-8">1. Предмет оферты</h2>
          <p>Исполнитель оказывает заказчику услуги по проведению нейрофотосессий, включая фотосъёмку и обработку изображений с использованием нейросетевых технологий.</p>
          
          <h2 className="text-xl font-heading font-semibold text-foreground mt-8">2. Порядок оказания услуг</h2>
          <p>Заказчик оформляет заявку через форму на сайте. После подтверждения заявки исполнитель связывается с заказчиком для согласования деталей и сроков проведения фотосессии.</p>
          
          <h2 className="text-xl font-heading font-semibold text-foreground mt-8">3. Стоимость услуг</h2>
          <p>Стоимость услуг определяется выбранным тарифом и дополнительными пожеланиями заказчика. Актуальные тарифы представлены на сайте.</p>
          
          <h2 className="text-xl font-heading font-semibold text-foreground mt-8">4. Оплата</h2>
          <p>Оплата производится в порядке, согласованном между сторонами. Предоплата составляет 50% от стоимости выбранного тарифа.</p>
          
          <h2 className="text-xl font-heading font-semibold text-foreground mt-8">5. Результат работ</h2>
          <p>Результатом оказания услуг являются обработанные фотографии в электронном виде. Сроки предоставления результатов зависят от выбранного тарифа и срочности.</p>
          
          <h2 className="text-xl font-heading font-semibold text-foreground mt-8">6. Авторские права</h2>
          <p>Авторские права на созданные изображения принадлежат исполнителю. Заказчик получает право на личное использование фотографий.</p>
        </div>
      </div>
    </div>
  );
}
