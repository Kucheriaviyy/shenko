SHENKO site: куда что класть
============================
index.html            сайт (его открывают посетители)
editor.html           конструктор (открывать по адресу сайта: твойник.github.io/shenko/editor.html)
content.json          весь контент сайта; его пишет конструктор, руками не нужно

assets/img/           картинки (WebP/PNG/JPG). Конструктор сам кладёт сюда загруженные фото
assets/models/        3D-модели .glb (до 5 МБ, текстуры 1024-2048 px, Draco)
assets/pdf/           PDF и картинки страниц для PDF-книги (страница 1.webp, 2.webp...)
assets/transitions/   SVG-переходы между секциями. Новый файл: положи сюда
                      и впиши его имя в конструкторе: Настройки, поле "Переходы"
assets/fonts/         шрифты .woff2 и License.txt
assets/css/site.css   стили сайта
assets/js/site.js     отрисовка сайта из content.json
assets/js/editor.js   код конструктора

Как работает Push: картинки и .glb из конструктора загружаются в нужные папки,
затем обновляется content.json. Сайт обновляется через 1-2 минуты.
Локально: python -m http.server в этой папке, затем localhost:8000/editor.html
