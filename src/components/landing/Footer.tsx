import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <span className="text-xl font-heading font-bold gradient-text">Dream Studio Nexoria</span>
            <p className="text-muted-foreground text-sm mt-3 max-w-xs">
              Нейрофотосессии на стыке искусства и технологий. Создаём уникальные образы с помощью ИИ.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">Контакты</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Telegram: @neurophoto</li>
              <li>WhatsApp: +7 (999) 123-45-67</li>
              <li>Email: hello@neurophoto.ru</li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">Документы</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link to="/offer" className="text-muted-foreground hover:text-foreground transition-colors">
                  Публичная оферта
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border/30 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Dream Studio Nexoria. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
