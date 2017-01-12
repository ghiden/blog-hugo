# A blog repo using [Hugo](http://gohugo.io/).

## Instructions

Install pygments and themes:
```bash
pip install Pygments
git submodule update --init --recursive themes/hugo-cactus-theme
```

Add a new post:
```bash
hugo new post/good-to-great.md
```

Write the post with live reload:
```bash
hugo server --buildDrafts
```

Build:
```
hugo
```

Deploy: http://gohugo.io/tutorials/deployment-with-rsync/
