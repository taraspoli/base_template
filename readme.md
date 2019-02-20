# Общая информация

1. Загрузка `git clone https://github.com/taraspoli/base_template.git .`
2. Инициализация `npm install`
3. Запуск `gulp`
4. Финальная компиляция `gulp build`
5. Рабочая папка проекта `app`, финальная папка `dist`

# Установка плагинов

Для того чтобы установить модуль достаточно выполнить команду:
`npm install [module_name] --save`

Добавить модуль в `gulp`:

### JS:
```js
gulp.task('scripts', function() {
  return gulp.src([
    ...
    'node_modules/owl.carousel/dist/owl.carousel.min.js',
    ...
  ])
}) 
```

### CSS:
```js
gulp.task('css-libs', ['sass'], function() {
	return gulp.src([
    ...
    'node_modules/owl.carousel/dist/assets/owl.carousel.min.css',
  ])
}) 
```
Если модуля нет в `npm` - достаточно добавить файл `[module_name].min.js` и/или `[module_name].min.css` в папку `libs`
PS: Минифицированые версии использовать не обязательно.

# Инфо по плагинам
## Ретина: 
### HTML:
Стандартная запись.
Атрибуты - желательно. Баг с размерами не воспроизвелся.

### CSS:
Дописать _at-2x_
```css
.logo {
  background-image: url('component.png') at-2x;
}
```