const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const ts = require('gulp-typescript');
const { deleteAsync } = require('del');
const replace = require('gulp-replace');

// TypeScript project
const tsProject = ts.createProject('tsconfig.json');

/* =====================
   CLEAN
===================== */
gulp.task('clean', function () {
  return deleteAsync(['dist']);
});

/* =====================
   TYPESCRIPT
===================== */
gulp.task('typescript', function () {
  return tsProject
    .src()
    .pipe(tsProject())
    .pipe(gulp.dest('dist/js'));
});

/* =====================
   FIX .js IMPORTS
===================== */
gulp.task('fix-imports', function () {
  return gulp.src('dist/js/**/*.js')
    .pipe(
      replace(
        /from\s+['"](\.\/[^'"]+?)(?<!\.js)['"]/g,
        "from '$1.js'"
      )
    )
    .pipe(gulp.dest('dist/js'));
});

/* =====================
   SCSS → CSS
===================== */
gulp.task('scss', function () {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'));
});

/* =====================
   HTML
===================== */
gulp.task('html', function () {
  return gulp.src('src/index.html')
    .pipe(gulp.dest('dist'));
});

/* =====================
   IMAGES (используем node:fs для надежности)
===================== */
gulp.task('images', function (done) {
  const fs = require('fs');
  const path = require('path');
  
  const srcDir = 'src/images';
  const destDir = 'dist/images';
  
  // Создаем директорию, если ее нет
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  // Копируем файлы
  function copyDir(src, dest) {
    if (!fs.existsSync(src)) {
      console.log(`Директория не существует: ${src}`);
      done();
      return;
    }
    
    const items = fs.readdirSync(src, { withFileTypes: true });
    
    for (const item of items) {
      const srcPath = path.join(src, item.name);
      const destPath = path.join(dest, item.name);
      
      if (item.isDirectory()) {
        if (!fs.existsSync(destPath)) {
          fs.mkdirSync(destPath, { recursive: true });
        }
        copyDir(srcPath, destPath);
      } else {
        // Читаем файл как буфер (бинарные данные)
        const data = fs.readFileSync(srcPath);
        fs.writeFileSync(destPath, data);
      }
    }
  }
  
  copyDir(srcDir, destDir);
  done();
});

/* =====================
   BROWSER SYNC
===================== */
gulp.task('serve', function (done) {
  browserSync.init({
    server: './dist',
    port: 3000,
    open: false
  });
  done();
});

function reload(done) {
  browserSync.reload();
  done();
}

/* =====================
   WATCH
===================== */
gulp.task('watch', function () {
  gulp.watch(
    'src/ts/**/*.ts',
    gulp.series('typescript', 'fix-imports', reload)
  );

  gulp.watch(
    'src/scss/**/*.scss',
    gulp.series('scss', reload)
  );

  gulp.watch(
    'src/index.html',
    gulp.series('html', reload)
  );

  gulp.watch(
    'src/images/**/*',
    gulp.series('images', reload)
  );
});

/* =====================
   BUILD / DEV
===================== */
gulp.task(
  'build',
  gulp.series(
    'clean',
    gulp.parallel(
      'typescript',
      'scss',
      'html',
      'images'
    ),
    'fix-imports'
  )
);

gulp.task('dev', gulp.series('build', 'serve', 'watch'));
gulp.task('default', gulp.series('dev'));