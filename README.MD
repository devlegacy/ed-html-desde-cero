# Curso de HTML 5 desde Cero

[Aplicación demo](https://devlegacy.github.io/ed-html-desde-cero/)

## Notas

### Publish in github-pages

```bash
  npm start webpack.build.prod
  git add .
  git commit -m "Pre publish app"
  git push origin --delete gh-pages
  git subtree push --prefix public origin gh-pages
  rm -R ./public/
```
