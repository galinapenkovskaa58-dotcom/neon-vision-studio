import { Link } from 'react-router-dom';
import { Send, MessageCircle } from 'lucide-react';
import logoImg from '@/assets/logo-dsn.png';

export default function Footer() {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex flex-col items-start gap-2 mb-3">
              <img src={logoImg} alt="Dream Studio Nexoria" className="w-14 h-14 rounded-full" />
              <div className="flex flex-col leading-none">
                <span className="text-xs font-heading font-bold tracking-widest uppercase gradient-text">Dream Studio</span>
                <span className="text-[6px] font-heading font-medium tracking-[0.35em] uppercase text-muted-foreground">— Nexoria —</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mt-3 max-w-xs">
              Нейрофотосессии на стыке искусства и технологий. Создаём уникальные образы с помощью ИИ.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">Контакты</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://t.me/Galina_Penkovskaya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  <Send size={16} className="text-neon-cyan" />
                  Telegram
                </a>
              </li>
              <li>
                <a
                  href="https://max.ru/u/f9LHodD0cOLYjuiRhcsdEc_nIGrd6RyFgbGXvAgbDs_B-WIAiP8LjGhOtTs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  <MessageCircle size={16} className="text-neon-purple" />
                  MAX
                </a>
              </li>
              <li>
                <a
                  href="https://vk.com/galinapenkovskaya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-neon-blue">
                    <path d="M12.785 16.241s.288-.032.435-.193c.136-.148.132-.427.132-.427s-.02-1.304.576-1.496c.588-.19 1.341 1.26 2.14 1.818.605.422 1.064.33 1.064.33l2.137-.03s1.117-.071.587-.964c-.043-.073-.308-.661-1.588-1.87-1.34-1.264-1.16-1.059.453-3.246.983-1.332 1.376-2.145 1.253-2.493-.117-.332-.84-.244-.84-.244l-2.406.015s-.178-.025-.31.056c-.13.079-.212.262-.212.262s-.382 1.03-.89 1.907c-1.07 1.85-1.499 1.948-1.674 1.832-.407-.267-.305-1.075-.305-1.648 0-1.793.267-2.54-.521-2.733-.262-.065-.454-.107-1.123-.114-.858-.009-1.585.003-1.996.208-.274.136-.485.44-.356.457.159.022.519.099.71.363.246.341.237 1.107.237 1.107s.142 2.11-.33 2.371c-.325.18-.77-.187-1.725-1.865-.489-.859-.859-1.81-.859-1.81s-.07-.176-.198-.272c-.154-.115-.37-.151-.37-.151l-2.286.015s-.343.01-.469.161c-.112.134-.009.412-.009.412s1.79 4.258 3.817 6.403c1.858 1.967 3.968 1.838 3.968 1.838h.956z"/>
                  </svg>
                  ВКонтакте
                </a>
              </li>
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
