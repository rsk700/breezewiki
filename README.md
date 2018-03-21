# BreezeWiki

Personal wiki engine

# Running BreezeWiki locally

For building and running app, you need to have python3, virtualenv, node
installed.

Install node packages, from `/breeze-ui/` run:

    $ npm install

Change `/breezewiki/breeze-ui/package.json` file, add "homepage" property:

    "homepage": "/static"

Build react app, from `/breeze-ui/` run:

    $ npm run-script build

Create folder `/breeze-server/breezeapi/static`.

Copy files from inside `/breeze-ui/build/` into `/breeze-server/breezeapi/static/`.

Create python virtual environment, inside `/breeze-server/`, run:

    $ virtualenv -p python3 ve

Install python packages, inside `/breeze-server/`, run:

    $ ./ve/bin/pip install -r requirements.txt

Manually download file
https://github.com/google/diff-match-patch/blob/master/python3/diff_match_patch.py,
and save into `/breeze-server/diffmatchpatch/`

Start BreezeWiki, provide path to db file, if db is new, file will be
created automatically, inside `/breeze-server/`, run:

    $ python easy-start-breezewiki.py [path to db file]

Now you can access wiki by opening url http://127.0.0.1:5000/ in browser

# Wiki syntax

Wiki syntax has markdown flavor, here is some exapmles of supported elements:

  # Header level 1

  Paragraph text. More text.

  ## Header level 2

  Paragaph text.
  New line in paragraph. url https://google.com

  New paragraph text. Text ---> internal_link some other text.
  Text ---> internal link with multiple words <---

  ```
  preformatted
  text
  ```
